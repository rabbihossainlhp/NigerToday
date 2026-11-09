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
    // Example condition simulating success vs error mock behavior
    if (!newCust.name) {
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
    let renewedName = "";
    let newExpiryFormatted = "";

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          renewedName = c.name;
          const expiryYear = c.expires?.match?.(/\d{4}/)?.[0] || c.startDate?.match?.(/\d{4}/)?.[0] || new Date().getFullYear();
          const currentExpiry = new Date(`${c.expires}, ${expiryYear}`);
          if (Number.isNaN(currentExpiry.getTime())) {
            renewedName = c.name;
            return c;
          }
          currentExpiry.setMonth(currentExpiry.getMonth() + additionalMonths);
          const newExpiresStr = currentExpiry.toISOString().split("T")[0];
          newExpiryFormatted = new Date(newExpiresStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          
          return {
            ...c,
            expires: newExpiresStr,
            expiryDate: newExpiresStr,
            status: "Active",
            renewals: [
              { title: `Renewed for ${additionalMonths} months`, period: `${c.expires} → ${newExpiresStr}` },
              ...(c.renewals ?? []),
            ],
          };
        }
        return c;
      })
    );
    showToast("Subscription renewed", `${renewedName} - new expiry ${newExpiryFormatted}`, "success");
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, deleteCustomer, renewCustomer, toast, showToast, clearToast }}>
      {children}
      <Toast toast={toast} onClose={clearToast} />
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomerContext);