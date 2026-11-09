"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_CHANGED_EVENT, AUTH_STORAGE_KEY } from "@/components/auth/AuthGuard";

const LOGO_SRC = "/upload/bg_logo.png";
const BG_SRC = "/upload/login_bg.jpg";
const LOGIN_EMAIL = "owner@email.com";
const LOGIN_PASSWORD = "owner123";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(LOGIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));

    if (auth?.loggedIn === true) {
      router.replace("/dashboard");
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();

if (!email.trim() || !password.trim()) {
  setError("Email and password are required.");
  return;
}

localStorage.setItem(
  AUTH_STORAGE_KEY,
  JSON.stringify({
    email: email.trim(),
    loggedIn: true,
  })
);

    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-inter" >
      {/* Left Side: Brand Showcase & Stats (Hidden on small screens, flex on large) */}
      <div className="hidden lg:flex relative lg:w-1/2 min-h-screen p-8 lg:p-12 flex-col justify-between overflow-hidden bg-slate-900 text-white">
        
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <Image
            src={BG_SRC}
            alt="Dashboard Background"
            fill
            priority
            className="object-cover object-center blur-[1px] opacity-100 "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        {/* Top Header / Logo */}
        <div className="relative z-10">
          <div className="relative w-40 h-40">
            <Image
              src={LOGO_SRC}
              alt="NigerToday TV Logo"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* Center Content & Metric Cards */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Know who to call today.
          </h1>
          
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 opacity-90">
            Track every customer subscription, see who is expiring, and send renewal reminders in one place.
          </p>

          <div className="flex flex-col gap-3 w-58 max-w-xs">
            <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-lg">
              <span className="text-emerald-600 font-extrabold text-xl w-6 text-center">24</span>
              <span className="text-xs font-semibold text-slate-800 tracking-tight">customers active</span>
            </div>

            <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-lg">
              <span className="text-amber-500 font-extrabold text-xl w-6 text-center">4</span>
              <span className="text-xs font-semibold text-slate-800 tracking-tight">expiring this month</span>
            </div>

            <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-lg">
              <span className="text-rose-600 font-extrabold text-xl w-6 text-center">2</span>
              <span className="text-xs font-semibold text-slate-800 tracking-tight">expired — follow up</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-[11px] text-slate-300 font-normal opacity-80">
          Private owner dashboard · Works on phone and computer
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-screen">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo visible ONLY on small screens */}
          <div className="lg:hidden relative w-24 h-24 mb-2">
            <Image
              src={LOGO_SRC}
              alt="NigerToday TV Logo"
              fill
              className="object-contain object-left"
            />
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Log in to manage your customers.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email or username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 text-sm transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm tracking-wide"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}