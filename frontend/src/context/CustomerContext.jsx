"use client";
import { createContext, useContext, useState } from "react";
import { initialCustomers } from "@/data/customers";
import Toast from "@/components/ui/Toast";

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [toast, setToast] = useState(null); // { title, message, type: 'success' | 'error' }

  const showToast = (title, message, type = "success") => {
    setToast({ title, message, type });
  };

  const clearToast = () => setToast(null);

  const addCustomer = (newCust) => {
    if (!newCust.name?.trim()) {
      showToast("Could not save customer", "Please check the details and try again.", "error");
      return false;
    }
    setCustomers((prev) => [newCust, ...prev]);
    showToast("Customer added", `${newCust.name} was successfully added.`, "success");
    return true;
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast("Customer deleted", "The customer record has been removed.", "success");
  };

  const renewCustomer = (id, additionalMonths) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer) {
      showToast("Could not renew subscription", "The customer could not be found.", "error");
      return;
    }

    const expiryYear =
      customer.expires?.match?.(/\d{4}/)?.[0] ||
      customer.startDate?.match?.(/\d{4}/)?.[0] ||
      new Date().getFullYear();
    const rawExpiry = customer.expiryDate || `${customer.expires}, ${expiryYear}`;
    const currentExpiry = /^\d{4}-\d{2}-\d{2}$/.test(rawExpiry)
      ? new Date(
          Number(rawExpiry.slice(0, 4)),
          Number(rawExpiry.slice(5, 7)) - 1,
          Number(rawExpiry.slice(8, 10)),
        )
      : new Date(rawExpiry);
    if (Number.isNaN(currentExpiry.getTime())) {
      showToast("Could not renew subscription", "The current expiry date is invalid.", "error");
      return;
    }

    currentExpiry.setMonth(currentExpiry.getMonth() + additionalMonths);
    const newExpiresStr = [
      currentExpiry.getFullYear(),
      String(currentExpiry.getMonth() + 1).padStart(2, "0"),
      String(currentExpiry.getDate()).padStart(2, "0"),
    ].join("-");
    const newExpiryFormatted = currentExpiry.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentExpiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((currentExpiry - today) / (1000 * 60 * 60 * 24));
    const status = daysLeft <= 0 ? "Expired" : daysLeft <= 10 ? "Expiring soon" : "Active";
    const badge =
      status === "Active"
        ? "Active"
        : status === "Expired"
          ? `${Math.abs(daysLeft)} days ago`
          : `${daysLeft} days left`;
    const category =
      daysLeft <= 3 ? "1-3" : daysLeft <= 7 ? "4-7" : daysLeft <= 10 ? "8-10" : undefined;

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              expires: newExpiryFormatted,
              expiryDate: newExpiresStr,
              daysLeft,
              status,
              badge,
              badgeColor:
                status === "Expired"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : status === "Expiring soon"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200",
              ...(category ? { category } : { category: undefined }),
              renewals: [
                {
                  title: `Renewed for ${additionalMonths} months`,
                  period: `${item.expires} → ${newExpiryFormatted}`,
                },
                ...(item.renewals ?? []),
              ],
            }
          : item,
      ),
    );
    showToast(
      "Subscription renewed",
      `${customer.name} - new expiry ${newExpiryFormatted}`,
      "success",
    );
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, deleteCustomer, renewCustomer, toast, showToast, clearToast }}>
      {children}
      <Toast toast={toast} onClose={clearToast} />
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);