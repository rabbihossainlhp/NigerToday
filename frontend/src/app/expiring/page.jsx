"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerAvatar from "@/components/ui/CustomerAvatar";
import SearchInput from "@/components/ui/SearchInput";
import StatusBadge from "@/components/ui/StatusBadge";
import SendReminderButton from "@/components/ui/SendReminderButton";
import Button from "@/components/ui/Button";
import { useCustomers } from "@/context/CustomerContext";
import { filterCustomers } from "@/data/customers";
import RenewalModal from "@/components/ui/RenewalModal";
import ReminderModal from "@/components/ui/ReminderModal";

export default function ExpiringSoonPage() {
  const { customers, showToast, renewCustomer, sendReminder } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const expiringCustomers = customers.filter(
    (customer) => customer.status === "Expiring soon",
  );
  const filteredCustomers = filterCustomers(
    expiringCustomers.filter((customer) =>
      activeTab === "all" ? true : customer.category === activeTab,
    ),
    searchQuery,
  );
  const categoryCounts = {
    all: expiringCustomers.length,
    "1-3": expiringCustomers.filter((customer) => customer.category === "1-3").length,
    "4-7": expiringCustomers.filter((customer) => customer.category === "4-7").length,
    "8-10": expiringCustomers.filter((customer) => customer.category === "8-10").length,
  };

  return (
    <DashboardLayout>
      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto pb-24 md:pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Expiring Soon</h1>
            <p className="text-xs text-slate-500 mt-1">{expiringCustomers.length} subscriptions expire within the next 10 days</p>
          </div>

          <div className="relative w-full md:w-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            {/* Ensure SearchInput stretches on mobile */}
            <div className="w-full md:w-64">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
        </div>

        {/* Filter Pills / Tabs - Horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            onClick={() => setActiveTab("all")}
            variant={activeTab === "all" ? "brand" : "filter"}
            size="pill"
            className="whitespace-nowrap"
          >
            All <span className="ml-1 opacity-80">{categoryCounts.all}</span>
          </Button>
          <Button
            onClick={() => setActiveTab("1-3")}
            variant={activeTab === "1-3" ? "brand" : "filter"}
            size="pill"
            className="whitespace-nowrap"
          >
            1–3 days <span className="ml-1 opacity-80">{categoryCounts["1-3"]}</span>
          </Button>
          <Button
            onClick={() => setActiveTab("4-7")}
            variant={activeTab === "4-7" ? "brand" : "filter"}
            size="pill"
            className="whitespace-nowrap"
          >
            4–7 days <span className="ml-1 opacity-80">{categoryCounts["4-7"]}</span>
          </Button>
          <Button
            onClick={() => setActiveTab("8-10")}
            variant={activeTab === "8-10" ? "brand" : "filter"}
            size="pill"
            className="whitespace-nowrap"
          >
            8–10 days <span className="ml-1 opacity-80">{categoryCounts["8-10"]}</span>
          </Button>
        </div>

        {/* ================= DESKTOP TABLE (Hidden on Mobile) ================= */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Expires</th>
                  <th className="py-3 px-3">Remaining</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-3 flex items-center gap-3">
                        <CustomerAvatar initials={c.initials} />
                        <div>
                          <Link href={`/customers/${c.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                            {c.name}
                          </Link>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-slate-600 font-medium">{c.phone}</td>
                      <td className="py-4 px-3 text-slate-600 font-medium">{c.expires}</td>
                      <td className="py-4 px-3">
                        <StatusBadge className="bg-amber-100 text-amber-800 border-amber-200" dot>{c.badge}</StatusBadge>
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <SendReminderButton onClick={() => { setSelectedCustomer(c); setModal("reminder"); }} />
                        <Button size="sm" onClick={() => { setSelectedCustomer(c); setModal("renew"); }}>
                          Renew
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No expiring subscriptions found for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE CARDS (Hidden on Desktop) ================= */}
        <div className="md:hidden space-y-3">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((c, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                {/* Top Row: Avatar, Info, Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomerAvatar initials={c.initials} />
                    <div>
                      <Link href={`/customers/${c.id}`} className="font-bold text-slate-900 text-sm hover:text-indigo-600">
                        {c.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">Expires {c.expires}</p>
                    </div>
                  </div>
                  <StatusBadge className="bg-amber-100 text-amber-800 border-amber-200" dot>{c.badge}</StatusBadge>
                </div>
                
                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => { setSelectedCustomer(c); setModal("reminder"); }} 
                    className="flex-1 px-3 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Reminder
                  </Button>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => { setSelectedCustomer(c); setModal("renew"); }} 
                    className="flex-1 px-3 py-2"
                  >
                    Renew
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
              No expiring subscriptions found.
            </div>
          )}
        </div>

        {/* Modals */}
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
            onSend={(message) => sendReminder(selectedCustomer.id, message)}
            onConfirm={() => { 
              showToast("Reminder ready", `Message copied for ${selectedCustomer.name}.`); 
              setModal(null); 
            }} 
          />
        )}
      </main>
    </DashboardLayout>
  );
}