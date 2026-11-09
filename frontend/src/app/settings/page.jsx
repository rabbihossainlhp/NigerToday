"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Panel from "@/components/ui/Panel";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Owner");
  const [email, setEmail] = useState("owner@email.com");
  
  // Toggle states for reminder settings
  const [remind7Days, setRemind7Days] = useState(true);
  const [remind3Days, setRemind3Days] = useState(true);
  const [remind1Day, setRemind1Day] = useState(true);

  return (
    <DashboardLayout>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your account and password.</p>
        </div>

        {/* Main Settings Card Container */}
        <Panel className="space-y-8 p-6 lg:p-8">
          
          {/* Section 1: Account */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Account</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs">
                Save changes
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Password */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">Use a strong password that only you know.</p>
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs shrink-0">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Change password
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Reminder Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Reminder settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose when a customer shows up as &quot;Expiring soon&quot;.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                Optional
              </span>
            </div>

            <div className="space-y-0 pt-2">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-slate-700">Remind me 7 days before expiry</span>
                <button
                  type="button"
                  onClick={() => setRemind7Days(!remind7Days)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    remind7Days ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      remind7Days ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-slate-700">Remind me 3 days before expiry</span>
                <button
                  type="button"
                  onClick={() => setRemind3Days(!remind3Days)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    remind3Days ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      remind3Days ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-medium text-slate-700">Remind me 1 day before expiry</span>
                <button
                  type="button"
                  onClick={() => setRemind1Day(!remind1Day)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    remind1Day ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      remind1Day ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </DashboardLayout>
  );
}
