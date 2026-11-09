export const customers = [
  {
    id: "js",
    initials: "JS",
    name: "John Smith",
    email: "john@email.com",
    phone: "+1 555 012 3456",
    startDate: "Jul 8, 2026",
    duration: "3 mo",
    expires: "Oct 8",
    status: "Expiring soon",
    badge: "3 days left",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    daysLeft: 3,
    category: "1-3",
  },
  {
    id: "mb",
    initials: "MB",
    name: "Michael Brown",
    email: "michael@email.com",
    phone: "+1 555 013 7788",
    startDate: "Jul 12, 2026",
    duration: "3 mo",
    expires: "Oct 12",
    status: "Expiring soon",
    badge: "7 days left",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    daysLeft: 7,
    category: "4-7",
  },
  {
    id: "sk",
    initials: "SK",
    name: "Sarah Khan",
    email: "sarah@email.com",
    phone: "+1 555 019 2210",
    startDate: "Oct 5, 2026",
    duration: "3 mo",
    expires: "Jan 5, 2027",
    status: "Active",
    badge: "Active",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    daysLeft: 63,
  },
  {
    id: "dl",
    initials: "DL",
    name: "David Lee",
    email: "david@email.com",
    phone: "+1 555 014 6621",
    startDate: "Apr 15, 2026",
    duration: "6 mo",
    expires: "Oct 15",
    status: "Expiring soon",
    badge: "10 days left",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    daysLeft: 10,
    category: "8-10",
  },
  {
    id: "ew",
    initials: "EW",
    name: "Emma Wilson",
    email: "emma@email.com",
    phone: "+1 555 011 9034",
    startDate: "Jun 1, 2026",
    duration: "12 mo",
    expires: "Jun 1, 2027",
    status: "Active",
    badge: "Active",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    daysLeft: 210,
  },
  {
    id: "rh",
    initials: "RH",
    name: "Robert Hall",
    email: "robert@email.com",
    phone: "+1 555 017 4410",
    startDate: "Apr 3, 2026",
    duration: "6 mo",
    expires: "Oct 3",
    status: "Expired",
    badge: "2 days ago",
    badgeColor: "bg-rose-50 text-rose-700 border border-rose-200",
    expiredOn: "Oct 3",
  },
  {
    id: "jc",
    initials: "JC",
    name: "James Cole",
    email: "james@email.com",
    phone: "+1 555 018 2965",
    startDate: "Jan 30, 2026",
    duration: "6 mo",
    expires: "Sep 30",
    status: "Expired",
    badge: "5 days ago",
    badgeColor: "bg-rose-50 text-rose-700 border border-rose-200",
    expiredOn: "Sep 30",
  },
  {
    id: "pd",
    initials: "PD",
    name: "Priya Das",
    email: "priya@email.com",
    phone: "+1 555 016 8802",
    expires: "Oct 15",
    daysLeft: 10,
    badge: "10 days left",
    category: "8-10",
    status: "Expiring soon",
  },
];

export const initialCustomers = customers;

export const expiringCustomers = customers
  .filter((customer) => customer.status === "Expiring soon")
  .sort((a, b) => a.daysLeft - b.daysLeft);

export const expiredCustomers = customers.filter(
  (customer) => customer.status === "Expired",
);

export const customerDetails = {
  ...customers[0],
  customerSince: "Apr 8, 2026",
  statusBadge: "Expiring · 3 days left",
  startDate: "Jul 8, 2026",
  expiresDate: "Oct 8, 2026",
  duration: "3 months",
  renewals: [
    { title: "Renewed for 3 months", period: "Jul 8, 2026 → Oct 8, 2026" },
    { title: "First subscription · 3 months", period: "Apr 8, 2026 → Jul 8, 2026" },
  ],
};

export const newCustomerDefaults = {
  fullName: "Sarah Khan",
  phoneNumber: "+1 555 019 2210",
  email: "sarah@email.com",
  startDate: "2026-10-05",
  duration: 3,
};

export const dashboardStats = [
  {
    icon: `"👥"`,
    iconClassName: "bg-slate-100",
    label: "Total customers",
    value: 30,
    valueClassName: "text-slate-900",
    description: "All saved customers",
  },
  {
    icon: "✓",
    iconClassName: "bg-emerald-50 text-emerald-600",
    label: "Active",
    value: 24,
    valueClassName: "text-emerald-600",
    description: "More than 10 days left",
  },
  {
    icon: "🕒",
    iconClassName: "bg-amber-50 text-amber-600",
    label: "Expiring soon",
    value: 4,
    valueClassName: "text-amber-500",
    description: "Within the next 10 days",
  },
  {
    icon: "⚠️",
    iconClassName: "bg-rose-50 text-rose-600",
    label: "Expired",
    value: 2,
    valueClassName: "text-rose-600",
    description: "Follow up to renew",
  },
];

export function filterCustomers(list, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return list;

  return list.filter((customer) =>
    [customer.name, customer.email, customer.phone]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
