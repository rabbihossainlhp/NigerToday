"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerAvatar from "@/components/ui/CustomerAvatar";
import { customerDetails } from "@/data/customers";
import { useCustomers } from "@/context/CustomerContext";
import ReminderModal from "@/components/ui/ReminderModal";
import RenewalModal from "@/components/ui/RenewalModal";
import { ArrowLeft, RefreshCw, MessageCircle, Edit, Trash2, X, Copy, Check } from "lucide-react";

export default function CustomerDetailsPage({ params }) {
  // CRITICAL FIX: Added deleteCustomer here
  const { showToast, renewCustomer, deleteCustomer } = useCustomers();
  const [copiedField, setCopiedField] = useState(null);

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [renewalDuration, setRenewalDuration] = useState(3);

  const customer = customerDetails;

  const calculateNewExpiry = (baseDateStr, months) => {
    const date = new Date(baseDateStr);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const newExpiryDate = calculateNewExpiry("Oct 8, 2026", renewalDuration);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-5 overflow-y-auto pb-24 md:pb-8">
        {/* Back Link */}
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b45e0] hover:text-[#4a36c4]"
        >
          <ArrowLeft size={16} />
          Customers
        </Link>

        {/* ===== MOBILE HEADER ===== */}
        <div className="md:hidden flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
            {customer.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-extrabold text-slate-900 truncate">{customer.name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {customer.statusBadge}
              </span>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CustomerAvatar initials={customer.initials} size="large" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{customer.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {customer.statusBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Customer since {customer.customerSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-sm transition-colors">
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f0f0fc] text-[#5b45e0] font-semibold text-xs hover:bg-[#e0e0fa] transition-colors"
            >
              <MessageCircle size={14} /> Send Reminder
            </button>
            <button
              onClick={() => setIsRenewModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5b45e0] hover:bg-[#4a36c4] text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <RefreshCw size={14} /> Renew Subscription
            </button>
          </div>
        </div>

        {/* ===== MOBILE: Time remaining card ===== */}
        <div className="md:hidden bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Time remaining</p>
          <p className="text-2xl font-black text-amber-600 tracking-tight mb-3">
            {customer.daysLeft} days left
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "85%" }} />
          </div>
        </div>

        {/* ===== MOBILE: Info rows ===== */}
        <div className="md:hidden bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm">
          {[
            { label: "Start date", value: customer.startDate },
            { label: "Duration", value: customer.duration },
            { label: "Expires", value: customer.expiresDate },
            { label: "Phone", value: customer.phone },
            { label: "Email", value: customer.email },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center px-4 py-3.5 text-sm">
              <span className="text-slate-500">{row.label}</span>
              <span className="font-semibold text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>

        {/* ===== MOBILE: Action buttons ===== */}
        <div className="md:hidden space-y-3">
          <button
            onClick={() => setIsRenewModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#5b45e0] text-white font-semibold text-sm shadow-sm transition-colors hover:bg-[#4a36c4]"
          >
            <RefreshCw size={16} /> Renew Subscription
          </button>

          <button
            onClick={() => setIsReminderModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#f0f0fc] text-[#5b45e0] font-semibold text-sm border border-[#e0e0fa] transition-colors hover:bg-[#e0e0fa]"
          >
            <MessageCircle size={16} /> Send Reminder
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-slate-700 font-semibold text-sm border border-slate-200 transition-colors hover:bg-slate-50">
            <Edit size={16} /> Edit customer
          </button>
        </div>

        {/* ===== DESKTOP CONTENT ===== */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Subscription</h2>
                <p className="text-xs text-slate-400">Current plan details</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-amber-500 tracking-tight">
                    {customer.daysLeft} days left
                  </span>
                  <span className="text-xs font-medium text-slate-500">Expires {customer.expiresDate}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[95%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>{customer.startDate}</span>
                  <span>{customer.expiresDate}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Start date</span>
                  <span className="font-semibold text-slate-900">{customer.startDate}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-900">{customer.duration}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Expiration date</span>
                  <span className="font-semibold text-slate-900">{customer.expiresDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Renewal history</h2>
                <p className="text-xs text-slate-400">Every time this subscription was renewed</p>
              </div>
              <div className="space-y-3">
                {customer.renewals.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{r.title}</p>
                      <p className="text-[11px] text-slate-400">{r.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Contact</h2>
              <div className="space-y-3 text-xs">
                {/* Phone */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white rounded-lg text-slate-500 border border-slate-100 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone</p>
                      <p className="font-semibold text-slate-900">{customer.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => copyToClipboard(customer.phone, "phone")} className="text-slate-400 hover:text-slate-600 p-1">
                    {copiedField === "phone" ? (
                      <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white rounded-lg text-slate-500 border border-slate-100 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
                      <p className="font-semibold text-slate-900">{customer.email}</p>
                    </div>
                  </div>
                  <button onClick={() => copyToClipboard(customer.email, "email")} className="text-slate-400 hover:text-slate-600 p-1">
                    {copiedField === "email" ? (
                      <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Delete customer</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Removes this customer and their subscription records. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-colors"
              >
                <Trash2 size={14} /> Delete customer
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ===== MODALS ===== */}
      {isRenewModalOpen && (
        <RenewalModal
          customer={{ ...customer, expires: customer.expiresDate, expiryDate: customer.expiresDate }}
          onClose={() => setIsRenewModalOpen(false)}
          onConfirm={(months) => {
            renewCustomer(customer.id, months);
            setIsRenewModalOpen(false);
          }}
        />
      )}

      {isReminderModalOpen && (
        <ReminderModal
          customer={{ ...customer, expires: customer.expiresDate }}
          onClose={() => setIsReminderModalOpen(false)}
          onConfirm={() => {
            showToast("Reminder ready", `Message copied for ${customer.name}.`);
            setIsReminderModalOpen(false);
          }}
        />
      )}

      {/* ===== UPDATED DELETE MODAL ===== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdeced] text-[#e11d48]">
                  <Trash2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Delete {customer.name}?</h2>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <p className="mt-6 text-sm text-slate-500 leading-relaxed">
              This permanently removes the customer and their subscription records. This cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCustomer(customer.id); // Now this will work!
                  setIsDeleteModalOpen(false);
                  showToast("Customer deleted", `${customer.name} has been removed.`);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#e11d48] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#be123c] transition-colors"
              >
                <Trash2 size={16} /> Delete customer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}