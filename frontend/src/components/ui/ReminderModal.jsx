import { useState } from "react";
import { X, MessageCircle, Copy } from "lucide-react";

export default function ReminderModal({ customer, onClose, onConfirm }) {
  const [template, setTemplate] = useState(customer?.daysLeft ? `${customer.daysLeft} days left` : "Expired");
  const [message, setMessage] = useState(() => createMessage(customer, template));

  if (!customer) return null;

  function selectTemplate(option) {
    setTemplate(option);
    setMessage(createMessage(customer, option));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[600px] rounded-3xl bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f0fc] text-[#5b45e0]">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send reminder</h2>
              <p className="text-sm text-slate-500">{customer.name} · {customer.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Quick Template */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-700">Quick template</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["7 days left", "3 days left", "1 day left", "Expired"].map((option) => (
              <button
                key={option}
                onClick={() => selectTemplate(option)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  template === option
                    ? "border-[#5b45e0] bg-[#5b45e0] text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-slate-700">Message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-3 h-32 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-600 outline-none focus:border-[#5b45e0] focus:ring-1 focus:ring-[#5b45e0]"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(message);
              onConfirm(message);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#5b45e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4a36c4] transition-colors"
          >
            <Copy size={16} /> Copy message
          </button>
        </div>
      </div>
    </div>
  );
}

function createMessage(customer, template) {
  if (!customer) return "";
  const firstName = customer.name.split(" ")[0];
  return `Hi ${firstName}, your TV subscription expires on ${customer.expires} (${template}). Please renew to keep your service running. Thank you!`;
}