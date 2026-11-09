"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCustomers } from "@/context/CustomerContext";
import { AUTH_CHANGED_EVENT, AUTH_STORAGE_KEY } from "@/components/auth/AuthGuard";

const LOGO_SRC = "/upload/bg_logo.png";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/customers", label: "Customers", icon: "customers" },
  { href: "/expiring", label: "Expiring", icon: "expiring" },
  { href: "/expired", label: "Expired", icon: "expired" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

function NavigationIcon({ name, active }) {
  const className = `h-5 w-5 ${active ? "text-indigo-600 lg:text-white" : "text-slate-400"}`;

  if (name === "dashboard") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    );
  }

  if (name === "customers") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }

  if (name === "expiring") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  if (name === "expired") {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }

  if (name === "more") {
    return (
      <svg className={`h-5 w-5 ${active ? "text-indigo-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customers, showToast } = useCustomers();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const expiringCount = customers.filter((c) => c.status === "Expiring soon").length;
  const expiredCount = customers.filter((c) => c.status === "Expired").length;

  const isMoreActive = pathname === "/expired" || pathname === "/settings";

  const handleLogout = () => {
    setIsMoreMenuOpen(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    showToast("Logged out", "You have been logged out successfully.", "success");
    router.push("/login");
  };

  return (
    <>
      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <aside className="hidden lg:flex w-64 bg-slate-100/70 border-r border-slate-200 flex-col justify-between p-4 shrink-0 min-h-screen">
        <div className="space-y-6">
          <div className="px-2 py-2">
            <div className="relative w-24 h-24">
              <Image
                src={LOGO_SRC}
                alt="NigerToday TV Logo"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/customers" && pathname.startsWith("/customers/"));

              const count =
                item.href === "/expiring"
                  ? expiringCount
                  : item.href === "/expired"
                  ? expiredCount
                  : null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <NavigationIcon name={item.icon} active={active} />
                    {item.label}
                  </span>

                  {count > 0 && (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout Section */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Alex Owner</p>
              <p className="text-slate-500">Business owner</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ---------------- MOBILE BOTTOM NAVIGATION BAR ---------------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-lg">
        <Link
          href="/dashboard"
          onClick={() => setIsMoreMenuOpen(false)}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === "/dashboard" ? "text-indigo-600 font-bold" : "text-slate-500"
          }`}
        >
          <NavigationIcon name="dashboard" active={pathname === "/dashboard"} />
          Dashboard
        </Link>

        <Link
          href="/customers"
          onClick={() => setIsMoreMenuOpen(false)}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith("/customers") ? "text-indigo-600 font-bold" : "text-slate-500"
          }`}
        >
          <NavigationIcon name="customers" active={pathname.startsWith("/customers")} />
          Customers
        </Link>

        <Link
          href="/expiring"
          onClick={() => setIsMoreMenuOpen(false)}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors relative ${
            pathname === "/expiring" ? "text-indigo-600 font-bold" : "text-slate-500"
          }`}
        >
          <div className="relative">
            <NavigationIcon name="expiring" active={pathname === "/expiring"} />
            {expiringCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full">
                {expiringCount}
              </span>
            )}
          </div>
          Expiring
        </Link>

        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isMoreActive || isMoreMenuOpen ? "text-indigo-600 font-bold" : "text-slate-500"
          }`}
        >
          <NavigationIcon name="more" active={isMoreActive || isMoreMenuOpen} />
          More
        </button>
      </nav>

      {/* ---------------- MOBILE "MORE" POPUP DRAWER ---------------- */}
      {isMoreMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">More Navigation</h3>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <Link
                href="/expired"
                onClick={() => setIsMoreMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-3">
                  <NavigationIcon name="expired" active={pathname === "/expired"} />
                  Expired
                </div>
                {expiredCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {expiredCount}
                  </span>
                )}
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsMoreMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-3">
                  <NavigationIcon name="settings" active={pathname === "/settings"} />
                  Settings
                </div>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  AO
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">Alex Owner</p>
                  <p className="text-[10px] text-slate-500">Business owner</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-semibold text-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}