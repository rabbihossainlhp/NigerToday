"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import { useCustomers } from "@/context/CustomerContext";
import { newCustomerDefaults } from "@/data/customers";

export default function AddCustomerPage() {
  const router = useRouter();
  const { addCustomer, showToast } = useCustomers();
  const [fullName, setFullName] = useState(newCustomerDefaults.fullName);
  const [phoneNumber, setPhoneNumber] = useState(newCustomerDefaults.phoneNumber);
  const [email, setEmail] = useState(newCustomerDefaults.email);
  const [startDate, setStartDate] = useState(newCustomerDefaults.startDate);
  const [duration, setDuration] = useState(newCustomerDefaults.duration); // duration in months (3, 6, 12)
  const [today, setToday] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setToday(new Date()), 0);

    return () => clearTimeout(timer);
  }, []);

  // Calculate dynamic expiry date based on start date + duration
  const getCalculatedExpiry = (start, months) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const expiryDate = getCalculatedExpiry(startDate, duration);
  
  const formatDateString = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDaysLeft = (targetDate) => {
    if (!today) return null;

    const target = new Date(targetDate);
    const todayAtStart = new Date(today);
    target.setHours(0, 0, 0, 0);
    todayAtStart.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - todayAtStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(expiryDate);

  const handleAddCustomer = async () => {
    if (submitting) return;
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !startDate) {
      showToast("Could not save customer", "Please complete all customer details.", "error");
      return;
    }
    if (fullName.trim().length < 10) {
      showToast("Could not save customer", "Full name must be at least 10 characters.", "error");
      return;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const expiry = getCalculatedExpiry(startDate, Number(duration));
    if (Number.isNaN(start.getTime()) || Number.isNaN(expiry.getTime())) {
      showToast("Could not save customer", "Please enter a valid subscription start date.", "error");
      return;
    }

    setSubmitting(true);
    let added = false;
    try {
      added = await addCustomer({
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: email.trim(),
        periodStart: start.toISOString(),
        duration: Number(duration),
      });
    } finally {
      setSubmitting(false);
    }
    if (added) router.push("/customers");
  };

  return (
    <DashboardLayout>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-4 pb-24 sm:p-6 md:p-8 md:pb-8 overflow-y-auto space-y-6">
        {/* Back Link */}
        <Link href="/customers" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Customers
        </Link>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Customer</h1>
          <p className="text-xs text-slate-500 mt-1">Save a customer and their subscription. The expiry date is worked out for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Container (Takes 2 Columns) */}
          <Panel className="lg:col-span-2 space-y-8 p-6 lg:p-8">
            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Customer information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Full name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Phone number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </span>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Subscription Settings */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Subscription</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Subscription start date</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Subscription duration</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 3 Months Option */}
                  <label
                    onClick={() => setDuration(3)}
                    className={`cursor-pointer border rounded-2xl p-4 flex items-center gap-3 transition-all ${
                      duration === 3
                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${duration === 3 ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                      {duration === 3 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">3 months</p>
                      <p className="text-[11px] text-slate-400">Ends {formatDateString(getCalculatedExpiry(startDate, 3))}</p>
                    </div>
                  </label>

                  {/* 6 Months Option */}
                  <label
                    onClick={() => setDuration(6)}
                    className={`cursor-pointer border rounded-2xl p-4 flex items-center gap-3 transition-all ${
                      duration === 6
                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${duration === 6 ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                      {duration === 6 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">6 months</p>
                      <p className="text-[11px] text-slate-400">Ends {formatDateString(getCalculatedExpiry(startDate, 6))}</p>
                    </div>
                  </label>

                  {/* 12 Months Option */}
                  <label
                    onClick={() => setDuration(12)}
                    className={`cursor-pointer border rounded-2xl p-4 flex items-center gap-3 transition-all ${
                      duration === 12
                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${duration === 12 ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                      {duration === 12 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">12 months</p>
                      <p className="text-[11px] text-slate-400">Ends {formatDateString(getCalculatedExpiry(startDate, 12))}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button href="/customers" variant="secondary" size="sm" className="px-5 py-2.5">
                Cancel
              </Button>
              <Button size="sm" className="px-5 py-2.5" onClick={handleAddCustomer} disabled={submitting}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                {submitting ? "Saving..." : "Add Customer"}
              </Button>
            </div>
          </Panel>

          {/* Right Side: Subscription Summary Box (Takes 1 Column) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-900">Subscription summary</h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Start date</span>
                <span className="font-semibold text-slate-900">{formatDateString(new Date(startDate))}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Duration</span>
                <span className="font-semibold text-slate-900">{duration} months</span>
              </div>
            </div>

            {/* Calculated Expiration Card */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-1">
              <p className="text-[11px] font-semibold text-indigo-600">Expiration date</p>
              <p className="text-2xl font-black text-indigo-700">{formatDateString(expiryDate)}</p>
              <p className="text-[10px] text-indigo-400 font-medium">Calculated automatically</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">Status after saving</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                daysLeft === null || daysLeft > 10
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : daysLeft > 0
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  daysLeft === null || daysLeft > 10
                    ? "bg-emerald-500"
                    : daysLeft > 0
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}></span>
                {daysLeft === null
                  ? "Calculating status"
                  : daysLeft <= 0
                    ? `Expired · ${Math.abs(daysLeft)} days ago`
                    : daysLeft <= 10
                      ? `Expiring soon · ${daysLeft} days left`
                      : `Active · ${daysLeft} days left`}
              </span>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
