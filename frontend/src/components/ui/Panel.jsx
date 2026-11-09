export default function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {children}
    </div>
  );
}
