import { useState } from "react";
import { X, RefreshCw, Check } from "lucide-react";

export default function RenewalModal({ customer, onClose, onConfirm }) {
  const [months, setMonths] = useState(3);

  if (!customer) return null;

  const expiry = new Date(customer.expiryDate || customer.expires);
  expiry.setMonth(expiry.getMonth() + months);
  const newExpiry = expiry.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[600px] rounded-3xl bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f0fc] text-[#5b45e0]">
              <RefreshCw size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Renew subscription</h2>
              <p className="text-sm text-slate-500">{customer.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Current Expiry */}
        <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-50/80 p-5 border border-slate-100">
          <div>
            <p className="text-sm text-slate-500 mb-1">Current expiry</p>
            <p className="font-bold text-slate-900">{customer.expires}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            {customer.daysLeft || 3} days left
          </span>
        </div>

        {/* Duration Selection */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Renewal duration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[3, 6, 12].map((option) => (
              <button
                key={option}
                onClick={() => setMonths(option)}
                className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  months === option
                    ? "border-[#5b45e0] bg-[#f0f0fc] text-[#5b45e0]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    months === option ? "border-[#5b45e0]" : "border-slate-300"
                  }`}
                >
                  {months === option && <span className="h-2 w-2 rounded-full bg-[#5b45e0]"></span>}
                </span>
                {option} months
              </button>
            ))}
          </div>
        </div>

        {/* New Expiry Preview */}
        <div className="mt-6 rounded-2xl bg-[#f0f0fc] p-5">
          <p className="text-sm font-semibold text-[#5b45e0] mb-1">New expiration date</p>
          <p className="text-3xl font-black text-[#5b45e0]">{newExpiry}</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Payment happens outside this app. Confirming only updates the customer record.
        </p>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(months)}
            className="flex items-center gap-2 rounded-xl bg-[#5b45e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4a36c4] transition-colors"
          >
            <Check size={16} /> Confirm renewal
          </button>
        </div>
      </div>
    </div>
  );
}