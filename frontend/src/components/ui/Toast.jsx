"use client";
import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  // Auto dismiss after 4 seconds
  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border bg-white max-w-sm ${
        isError ? "border-rose-200 bg-rose-50/30" : "border-emerald-200 bg-white"
      }`}>
        {/* Icon */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
          isError ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          {isError ? "✕" : "✓"}
        </div>

        {/* Message body */}
        <div className="flex-1 pr-2">
          <p className={`text-xs font-bold ${isError ? "text-rose-900" : "text-slate-900"}`}>
            {toast.title}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
          ✕
        </button>
      </div>
    </div>
  );
}