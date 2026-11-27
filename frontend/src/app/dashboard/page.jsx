"use client";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerAvatar from "@/components/ui/CustomerAvatar";
import SendReminderButton from "@/components/ui/SendReminderButton";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import { useCustomers } from "@/context/CustomerContext";
import { dashboardStats } from "@/data/customers";
import { useEffect, useState } from "react";
import RenewalModal from "@/components/ui/RenewalModal";
import ReminderModal from "@/components/ui/ReminderModal";
import { AlertTriangle, MessageCircle, Search } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";

export default function DashboardPage() {
  const { customers, showToast, renewCustomer, sendReminder } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(null);
  const [remoteStats, setRemoteStats] = useState(null);

  useEffect(() => {
    let active = true;
    dashboardService
      .getStats()
      .then((result) => {
        if (active) setRemoteStats(result);
      })
      .catch((error) => {
        if (active) showToast("Could not load dashboard statistics", error.message, "error");
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const expiringCustomers = customers
    .filter((customer) => customer.status === "Expiring soon")
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const expiredCustomers = customers.filter((customer) => customer.status === "Expired");
  const activeCount = customers.filter((customer) => customer.status === "Active").length;
  const attentionCount = expiringCustomers.length + expiredCustomers.length;

  const dashboardExpiringCustomers = expiringCustomers.map((customer) => ({
    ...customer,
    remaining: customer.badge,
    daysColor: "bg-amber-100 text-amber-800",
  }));

  // Combine expired and expiring for the mobile "Needs your attention" list
  const attentionList = [...expiredCustomers, ...dashboardExpiringCustomers].slice(0, 3);
  const stats = dashboardStats.map((stat) => ({
    ...stat,
    value:
      stat.label === "Total customers"
        ? remoteStats?.total ?? customers.length
        : stat.label === "Active"
          ? remoteStats?.active ?? activeCount
          : stat.label === "Expiring soon"
            ? remoteStats?.expiringSoon ?? expiringCustomers.length
            : remoteStats?.expired ?? expiredCustomers.length,
  }));

  return (
    <DashboardLayout>
      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8 space-y-6 overflow-y-auto bg-[#f8f9fc]">
        
        {/* ---------------- MOBILE HEADER ---------------- */}
        <div className="md:hidden flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-slate-500 font-medium">Mon, Oct 5</p>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Dashboard</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-[#5b45e0] flex items-center justify-center font-bold text-sm">
            AO
          </div>
        </div>

        {/* ---------------- DESKTOP HEADER ---------------- */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Monday, October 5, 2026 · Here is who needs your attention today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search name, phone or email"
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <Button href="/customers/new" variant="brand" size="sm" className="py-2 transition-none">
              <span className="text-base font-normal leading-none">+</span> Add Customer
            </Button>
          </div>
        </div>

        {/* ---------------- MOBILE ALERT BANNER ---------------- */}
        <div className="md:hidden bg-[#fef8e2] rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-[#d97706] shrink-0" />
          <p className="text-sm font-semibold text-[#b45309]">{attentionCount} customers need your attention</p>
        </div>

        {/* ---------------- DESKTOP ALERT BANNER ---------------- */}
        <div className="hidden md:flex bg-[#fef8e2] rounded-xl p-4 flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-[#d97706]" />
            <span className="text-sm font-medium text-[#b45309]">
              <strong className="font-bold">{attentionCount} customers need your attention</strong> — {expiringCustomers.length} expire within 10 days and {expiredCustomers.length} have already expired.
            </span>
          </div>
          <Button href="/expiring" variant="secondary" size="sm" className="rounded-lg shrink-0">
            Review now
          </Button>
        </div>

        {/* ---------------- STAT CARDS (MOBILE) ---------------- */}
        <div className="md:hidden grid grid-cols-3 gap-3">
          <div className="bg-[#fdeced] rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#e11d48]">{expiredCustomers.length}</span>
            <span className="text-xs font-semibold text-[#e11d48] mt-1">Expired</span>
          </div>
          <div className="bg-[#fef3c7] rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#d97706]">{expiringCustomers.length}</span>
            <span className="text-xs font-semibold text-[#d97706] mt-1">Expiring</span>
          </div>
          <div className="bg-[#d1fae5] rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#059669]">{activeCount}</span>
            <span className="text-xs font-semibold text-[#059669] mt-1">Active</span>
          </div>
        </div>

        {/* ---------------- STAT CARDS (DESKTOP) ---------------- */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* ---------------- NEEDS YOUR ATTENTION (MOBILE) ---------------- */}
        <div className="md:hidden mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Needs your attention</h2>
            <Link href="/expiring" className="text-sm font-semibold text-[#5b45e0]">See all</Link>
          </div>
          <div className="space-y-3">
            {attentionList.map((c) => (
              <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-[#5b45e0] flex items-center justify-center font-bold text-sm">
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                    {c.status && c.status.includes("Expired") ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold bg-[#fdeced] text-[#e11d48]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span>
                        {c.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#d97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                        {c.remaining}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  aria-label={`Send reminder to ${c.name}`}
                  variant="soft"
                  size="md"
                  onClick={() => { setSelectedCustomer(c); setModal("reminder"); }}
                  className="h-10 w-10 p-0"
                >
                  <MessageCircle size={18} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- BOTTOM SPLIT (DESKTOP) ---------------- */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expiring Soon Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Expiring Soon</h2>
              <p className="text-xs text-slate-400">Sorted by days left</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Expires</th>
                    <th className="py-3 px-2">Remaining</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardExpiringCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 flex items-center gap-3">
                        <CustomerAvatar initials={c.initials} />
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">{c.expires}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.daysColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {c.remaining}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <SendReminderButton onClick={() => { setSelectedCustomer(c); setModal("reminder"); }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Expired Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recently Expired</h2>
                <p className="text-xs text-slate-400">Renew or follow up</p>
              </div>

              <div className="space-y-3">
                {expiredCustomers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {c.initials}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                        <p className="text-[11px] text-rose-500">{c.status}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => { setSelectedCustomer(c); setModal("reminder"); }}>
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100">
              <Link href="/expired" className="inline-flex items-center gap-1 text-xs font-semibold text-[#5b45e0] hover:text-[#4a36c4]">
                View all expired →
              </Link>
            </div>
          </div>
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