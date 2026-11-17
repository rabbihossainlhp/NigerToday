import Link from "next/link";

const variants = {
  primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
  brand: "bg-[#5b45e0] text-white shadow-sm hover:bg-[#4a36c4]",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  soft: "border border-[#e0e0fa] bg-[#f0f0fc] text-[#5b45e0] hover:bg-[#e0e0fa]",
  reminder: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
  "danger-secondary":
    "border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
  filter: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
  "filter-active": "bg-indigo-600 text-white shadow-sm",
};

const sizes = {
  sm: "gap-1.5 rounded-xl px-3 py-1.5 text-xs",
  md: "gap-2 rounded-xl px-4 py-2.5 text-sm",
  lg: "gap-2 rounded-2xl px-4 py-3.5 text-sm",
  pill: "gap-1 rounded-full px-4 py-2 text-xs",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const classes = `inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return <Link href={href} className={classes} {...props} />;
  }

  return <button type={type} className={classes} {...props} />;
}
