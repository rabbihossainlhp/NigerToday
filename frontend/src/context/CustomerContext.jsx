"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { customerService } from "@/services/customerService";
import { renewalService } from "@/services/renewalService";
import { AUTH_CHANGED_EVENT, getAuth } from "@/services/apiClient";
import Toast from "@/components/ui/Toast";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((title, message, type = "success") => {
    setToast({ title, message, type });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const refreshCustomers = useCallback(async () => {
    const records = await customerService.list();
    setCustomers(records);
    return records;
  }, []);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      setLoading(true);
      if (!getAuth()?.accessToken) {
        if (active) {
          setCustomers([]);
          setLoading(false);
        }
        return;
      }

      try {
        const records = await customerService.list();
        if (active) setCustomers(records);
      } catch (error) {
        if (active) showToast("Could not load customers", error.message, "error");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCustomers();
    window.addEventListener(AUTH_CHANGED_EVENT, loadCustomers);
    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, loadCustomers);
    };
  }, [showToast]);

  const addCustomer = async (customer) => {
    if (!customer.name?.trim() || !customer.email?.trim() || !customer.phone?.trim()) {
      showToast("Could not save customer", "Please check the details and try again.", "error");
      return false;
    }

    let created;
    try {
      created = await customerService.create(customer);
    } catch (error) {
      showToast("Could not save customer", error.message, "error");
      return false;
    }

    try {
      await renewalService.create({
        customerId: created.id,
        periodStart: customer.periodStart,
        durationMonths: Number(customer.duration),
        type: "initial",
      });
    } catch (error) {
      try {
        await refreshCustomers();
      } catch (refreshError) {
        showToast(
          "Customer created",
          `The initial subscription could not be saved or the customer list could not be reloaded: ${refreshError.message}`,
          "error",
        );
        return true;
      }
      showToast(
        "Customer saved without a subscription",
        `The customer was created, but the initial subscription could not be saved: ${error.message}`,
        "error",
      );
      return true;
    }

    try {
      await refreshCustomers();
      showToast("Customer added", `${created.name} was successfully added.`, "success");
      return true;
    } catch (error) {
      showToast(
        "Customer and subscription saved",
        `The customer list could not be reloaded: ${error.message}`,
        "error",
      );
      return true;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.remove(id);
      setCustomers((previous) => previous.filter((customer) => customer.id !== id));
      showToast("Customer deleted", "The customer record has been removed.", "success");
      return true;
    } catch (error) {
      showToast("Could not delete customer", error.message, "error");
      return false;
    }
  };

  const sendReminder = async (id, message) => {
    try {
      await customerService.sendReminder(id, message);
      showToast("Reminder sent", "The reminder email was sent successfully.", "success");
      return true;
    } catch (error) {
      showToast("Could not send reminder", error.message, "error");
      return false;
    }
  };

  const renewCustomer = async (id, additionalMonths) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer) {
      showToast("Could not renew subscription", "The customer could not be found.", "error");
      return false;
    }

    const currentExpiry = customer.expiryDate
      ? new Date(`${customer.expiryDate}T00:00:00`)
      : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(currentExpiry.getTime())) {
      showToast("Could not renew subscription", "The current expiry date is invalid.", "error");
      return false;
    }
    if (currentExpiry < today) currentExpiry.setTime(today.getTime());

    try {
      await renewalService.create({
        customerId: customer.id,
        periodStart: currentExpiry.toISOString(),
        durationMonths: Number(additionalMonths),
        type: "renewal",
      });
    } catch (error) {
      showToast("Could not renew subscription", error.message, "error");
      return false;
    }

    try {
      await refreshCustomers();
      showToast("Subscription renewed", `${customer.name} was renewed.`, "success");
    } catch (error) {
      showToast(
        "Subscription renewed",
        `The renewal was saved, but the customer list could not be reloaded: ${error.message}`,
        "error",
      );
    }
    return true;
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        refreshCustomers,
        addCustomer,
        deleteCustomer,
        sendReminder,
        renewCustomer,
        toast,
        showToast,
        clearToast,
      }}
    >
      {children}
      <Toast toast={toast} onClose={clearToast} />
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);
