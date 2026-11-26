"use client";
import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { useCustomers } from "@/context/CustomerContext";
import RenewalModal from "@/components/ui/RenewalModal";
import ReminderModal from "@/components/ui/ReminderModal";

export default function CustomersPage() {
  const { customers, loading, renewCustomer, showToast } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = customers.filter((c) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = [c.name, c.email, c.phone]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));

    if (activeTab === "active") return matchesSearch && c.status === "Active";
    if (activeTab === "expiring") return matchesSearch && c.status === "Expiring soon";
    if (activeTab === "expired") return matchesSearch && c.status === "Expired";
    return matchesSearch;
  });

  const getStatusBadge = (c) => {
    if (c.status === "Active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Active
        </span>
      );
    }
    if (c.status === "Expiring soon") {
      // Example: you can calculate real days left from c.expires
      const daysLeft = c.daysLeft ?? 3; // replace with real calculation if available
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {daysLeft} days left
        </span>
      );
    }
    if (c.status === "No subscription") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          No subscription
        </span>
      );
    }
    // Expired
    const daysAgo = c.daysAgo ?? Math.abs(c.daysLeft ?? 2);
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {daysAgo} days ago
      </span>
    );
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 pb-24 sm:p-6 md:p-8 md:pb-8 space-y-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customers
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {customers.length} customers
            </p>
          </div>

          <Button
            href="/customers/new"
            size="sm"
            className="h-10 w-10 rounded-full p-0 text-lg transition-none sm:h-auto sm:w-auto sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
          >
            <span className="sm:hidden">+</span>
            <span className="hidden sm:inline">+ Add Customer</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search name, phone or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Empty State */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 1a4 4 0 0 1 0 8m0-8a4 4 0 0 0 0-8" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No customers yet</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Add your first customer to start tracking subscriptions and expiry dates.
              </p>
            </div>
            <Button
              href="/customers/new"
              size="sm"
              className="rounded-lg transition-none"
            >
              + Add Customer
            </Button>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "expiring", label: "Expiring" },
                { key: "expired", label: "Expired" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  variant={activeTab === tab.key ? "filter-active" : "filter"}
                  size="pill"
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* ===== MOBILE LIST (matches your screenshot) ===== */}
            <div className="md:hidden space-y-3">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {c.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/customers/${c.id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600 block truncate"
                    >
                      {c.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {c.status === "Expired" ? `Expired ${c.expires}` : `Expires ${c.expires}`}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">{getStatusBadge(c)}</div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-400">
                  No customers match your filters
                </div>
              )}
            </div>

            {/* ===== DESKTOP TABLE ===== */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Expires</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {c.initials}
                          </span>
                          <div>
                            <Link
                              href={`/customers/${c.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600"
                            >
                              {c.name}
                            </Link>
                            <p className="text-[11px] text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{c.phone}</td>
                      <td className="py-4 px-4 text-slate-500">{c.startDate}</td>
                      <td className="py-4 px-4 text-slate-600">{c.duration} mo</td>
                      <td className="py-4 px-4 text-slate-600">{c.expires}</td>
                      <td className="py-4 px-4">{getStatusBadge(c)}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setModal("reminder");
                          }}
                        >
                          Message
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setModal("renew");
                          }}
                        >
                          Renew
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </>
        )}
      </main>

      {modal === "renew" && (
        <RenewalModal
          customer={selectedCustomer}
          onClose={() => setModal(null)}
          onConfirm={async (months) => {
            const renewed = await renewCustomer(selectedCustomer.id, months);
            if (renewed) setModal(null);
          }}
        />
      )}
      {modal === "reminder" && (
        <ReminderModal
          customer={selectedCustomer}
          onClose={() => setModal(null)}
          onConfirm={() => {
            showToast("Reminder ready", `Message copied for ${selectedCustomer.name}.`);
            setModal(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}