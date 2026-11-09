"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerAvatar from "@/components/ui/CustomerAvatar";
import SearchInput from "@/components/ui/SearchInput";
import StatusBadge from "@/components/ui/StatusBadge";
import SendReminderButton from "@/components/ui/SendReminderButton";
import { useCustomers } from "@/context/CustomerContext";
import { expiringCustomers, filterCustomers } from "@/data/customers";
import RenewalModal from "@/components/ui/RenewalModal";
import ReminderModal from "@/components/ui/ReminderModal";

export default function ExpiringSoonPage() {
  const { showToast, renewCustomer } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = filterCustomers(
    expiringCustomers.filter((customer) =>
      activeTab === "all" ? true : customer.category === activeTab,
    ),
    searchQuery,
  );

  return (
    <DashboardLayout>
      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto pb-24 md:pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Expiring Soon</h1>
            <p className="text-xs text-slate-500 mt-1">4 subscriptions expire within the next 10 days</p>
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
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-[#5b45e0] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All <span className="ml-1 opacity-80">4</span>
          </button>
          <button
            onClick={() => setActiveTab("1-3")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "1-3"
                ? "bg-[#5b45e0] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            1–3 days <span className="ml-1 opacity-80">1</span>
          </button>
          <button
            onClick={() => setActiveTab("4-7")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "4-7"
                ? "bg-[#5b45e0] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            4–7 days <span className="ml-1 opacity-80">1</span>
          </button>
          <button
            onClick={() => setActiveTab("8-10")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "8-10"
                ? "bg-[#5b45e0] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            8–10 days <span className="ml-1 opacity-80">2</span>
          </button>
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
                          <Link href={`/customers/${c.initials.toLowerCase()}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
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
                        <button onClick={() => { setSelectedCustomer(c); setModal("renew"); }} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors">
                          Renew
                        </button>
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
                      <Link href={`/customers/${c.initials.toLowerCase()}`} className="font-bold text-slate-900 text-sm hover:text-indigo-600">
                        {c.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">Expires {c.expires}</p>
                    </div>
                  </div>
                  <StatusBadge className="bg-amber-100 text-amber-800 border-amber-200" dot>{c.badge}</StatusBadge>
                </div>
                
                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => { setSelectedCustomer(c); setModal("reminder"); }} 
                    className="flex-1 px-3 py-2 rounded-xl bg-[#f0f0fc] text-[#5b45e0] font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Reminder
                  </button>
                  <button 
                    onClick={() => { setSelectedCustomer(c); setModal("renew"); }} 
                    className="flex-1 px-3 py-2 rounded-xl bg-[#5b45e0] text-white font-semibold text-xs"
                  >
                    Renew
                  </button>
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
            onConfirm={(months) => { 
              renewCustomer(selectedCustomer.id, months); 
              setModal(null); 
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
      </main>
    </DashboardLayout>
  );
}