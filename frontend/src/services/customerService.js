import { apiRequest } from "./apiClient";

const parseDate = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysLeft = (value) => {
  const expiry = parseDate(value);
  if (!expiry) return null;
  expiry.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / 86400000);
};

export function normalizeCustomer(customer) {
  const name = customer.fullName || customer.name || "";
  const daysLeft = getDaysLeft(customer.expiresAt || customer.expiryDate);
  const status =
    daysLeft === null
      ? "No subscription"
      : daysLeft <= 0
        ? "Expired"
        : daysLeft <= 10
          ? "Expiring soon"
          : "Active";
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
  const expiryDate = customer.expiresAt || customer.expiryDate || null;
  const parsedExpiry = parseDate(expiryDate);

  return {
    ...customer,
    id: customer._id || customer.id,
    name,
    initials,
    phone: customer.phone || customer.phoneNumber || "",
    duration: customer.durationMonths ?? customer.duration ?? null,
    startDate: formatDate(customer.startDate),
    expiryDate: parsedExpiry ? [
      parsedExpiry.getFullYear(),
      String(parsedExpiry.getMonth() + 1).padStart(2, "0"),
      String(parsedExpiry.getDate()).padStart(2, "0"),
    ].join("-") : "",
    expires: formatDate(expiryDate),
    daysLeft,
    status,
    category:
      status === "Expiring soon"
        ? daysLeft <= 3
          ? "1-3"
          : daysLeft <= 7
            ? "4-7"
            : "8-10"
        : undefined,
    expiredOn: status === "Expired" ? formatDate(expiryDate) : undefined,
    badge:
      daysLeft === null
        ? "No subscription"
        : status === "Expired"
          ? `${Math.abs(daysLeft)} days ago`
          : status === "Expiring soon"
            ? `${daysLeft} days left`
            : "Active",
    badgeColor:
      status === "Expired"
        ? "bg-rose-50 text-rose-700 border border-rose-200"
        : status === "Expiring soon"
          ? "bg-amber-100 text-amber-800 border border-amber-200"
          : status === "No subscription"
            ? "bg-slate-100 text-slate-600 border border-slate-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200",
    renewals: customer.renewals || [],
  };
}

export const customerService = {
  async list() {
    const result = await apiRequest("/customer/customers-list?page=1&limit=1000");
    const customers = Array.isArray(result) ? result : result?.result || [];
    return customers.map(normalizeCustomer);
  },

  async getById(id) {
    const customer = await apiRequest(`/customer/${encodeURIComponent(id)}`);
    return normalizeCustomer(customer);
  },

  async create(customer) {
    const created = await apiRequest("/customer/create", {
      method: "POST",
      body: {
        fullName: customer.fullName || customer.name,
        phone: customer.phone || customer.phoneNumber,
        email: customer.email,
      },
    });
    return normalizeCustomer(created);
  },

  async update(id, customer) {
    const updated = await apiRequest(`/customer/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: {
        fullName: customer.fullName || customer.name,
        phone: customer.phone || customer.phoneNumber,
        email: customer.email,
      },
    });
    return normalizeCustomer(updated);
  },

  remove(id) {
    return apiRequest(`/customer/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  sendReminder(id, message) {
    return apiRequest(`/customer/${encodeURIComponent(id)}/reminder`, {
      method: "POST",
      body: { message },
    });
  },
};
