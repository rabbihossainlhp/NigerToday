"use client";

import { useCustomers } from "@/context/CustomerContext";
import Toast from "@/components/ui/Toast";

export default function GlobalToastContainer() {
  const { toast, clearToast } = useCustomers();
  return <Toast toast={toast} onClose={clearToast} />;
}