"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerAvatar from "@/components/ui/CustomerAvatar";
import SearchInput from "@/components/ui/SearchInput";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import { filterCustomers } from "@/data/customers";
import { useCustomers } from "@/context/CustomerContext";
import RenewalModal from "@/components/ui/RenewalModal";
import ReminderModal from "@/components/ui/ReminderModal";
import { RefreshCw, MessageCircle } from "lucide-react";

export default function ExpiredPage() {
  const { customers, showToast, renewCustomer } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const expiredCustomers = customers.filter((customer) => customer.status === "Expired");
  const filteredCustomers = filterCustomers(expiredCustomers, searchQuery);

  return (
    <DashboardLayout>
      {/* ---------------- MAIN CONTENT ---------------- */}
      {/* Updated padding for mobile, added bottom padding so bottom nav doesn't overlap */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto pb-24 md:pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Expired</h1>
            <p className="text-xs text-slate-500 mt-1">{expiredCustomers.length} subscriptions have expired · Renew them or follow up</p>
          </div>

          {/* Ensure Search takes full width on mobile */}
          <div className="w-full md:w-auto md:min-w-[280px]">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* ================= DESKTOP TABLE (Hidden on Mobile) ================= */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Expired On</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
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
                      <td className="py-4 px-3 text-slate-600 font-medium">{c.expiredOn}</td>
                      <td className="py-4 px-3">
                        <StatusBadge className="bg-rose-50 text-rose-700 border-rose-200" dot>{c.badge}</StatusBadge>
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <Button size="sm" onClick={() => { setSelectedCustomer(c); setModal("renew"); }}>
                          <RefreshCw size={14} />
                          Renew
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => { setSelectedCustomer(c); setModal("reminder"); }}>
                          Message
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No expired customers found matching your search.
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
            filteredCustomers.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                
                {/* Top Row: Avatar, Info, Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomerAvatar initials={c.initials} />
                    <div>
                      <Link href={`/customers/${c.id}`} className="font-bold text-slate-900 text-sm hover:text-indigo-600">
                        {c.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">Expired {c.expiredOn}</p>
                    </div>
                  </div>
                  <StatusBadge className="bg-[#fdeced] text-[#e11d48] border-none" dot>{c.badge}</StatusBadge>
                </div>
                
                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => { setSelectedCustomer(c); setModal("renew"); }} 
                    className="flex-1 px-3 py-2"
                  >
                    <RefreshCw size={14} /> Renew
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { setSelectedCustomer(c); setModal("reminder"); }} 
                    className="flex-1 px-3 py-2"
                  >
                    <MessageCircle size={14} /> Message
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
              No expired customers found.
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