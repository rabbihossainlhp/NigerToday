"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import { userService } from "@/services/userService";
import { useCustomers } from "@/context/CustomerContext";

export default function SettingsPage() {
  const { showToast } = useCustomers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [reminderPreferences, setReminderPreferences] = useState([true, true, true]);

  useEffect(() => {
    let active = true;
    userService
      .getProfile()
      .then((user) => {
        if (!active) return;
        setName(user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" "));
        setEmail(user.email || "");
      })
      .catch((error) => {
        if (active) showToast("Could not load profile", error.message, "error");
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const user = await userService.updateProfile({ fullName: name.trim() });
      setName(user.fullName || name);
      setEmail(user.email || email);
      showToast("Profile updated", "Your account details were saved.", "success");
    } catch (error) {
      showToast("Could not save profile", error.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    try {
      await userService.changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      showToast("Password changed", "Your password was updated.", "success");
    } catch (error) {
      showToast("Could not change password", error.message, "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 pb-24 sm:p-6 md:p-8 md:pb-8 space-y-6 overflow-y-auto max-w-4xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your account and password.</p>
        </div>

        <Panel className="space-y-8 p-6 lg:p-8">
          <form onSubmit={saveProfile} className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Account</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loadingProfile}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  disabled={loadingProfile}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm bg-slate-100/70"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" disabled={loadingProfile || savingProfile} className="px-5 py-2.5">
                {savingProfile ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>

          <hr className="border-slate-100" />

          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Password</h2>
              <p className="text-xs text-slate-500 mt-0.5">Use a strong password that only you know.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Current password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm bg-slate-50/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">New password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm bg-slate-50/30"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="sm" disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Change password"}
              </Button>
            </div>
          </form>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Reminder settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose when a customer shows up as &quot;Expiring soon&quot;.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                Not saved
              </span>
            </div>
            <p className="text-xs text-slate-500">
              These controls are temporary only. The backend currently uses a fixed 10-day expiry window.
            </p>
            <div className="space-y-0 pt-2">
              {[7, 3, 1].map((days, index) => (
                <div
                  key={days}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-xs font-medium text-slate-700">Remind me {days} days before expiry</span>
                  <button
                    type="button"
                    aria-label={`Toggle ${days}-day reminder`}
                    aria-pressed={reminderPreferences[index]}
                    onClick={() =>
                      setReminderPreferences((current) =>
                        current.map((enabled, itemIndex) => itemIndex === index ? !enabled : enabled),
                      )
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      reminderPreferences[index] ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        reminderPreferences[index] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </main>
    </DashboardLayout>
  );
}
