import Image from "next/image"


export default function StatCard({ icon, iconSrc, iconClassName, label, value, valueClassName, description }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

        {(iconSrc || icon) && (
          <span className={`rounded-md p-1.5 ${iconClassName}`}>
            {iconSrc? 
            <Image src={iconSrc} alt="" width={20} height={20}/>  
            :
            icon
          }
          </span>
        )}
        {label}
      </div>
      <div>
        <p className={`text-3xl font-extrabold ${valueClassName}`}>{value}</p>
        <p className="mt-1 text-[11px] text-slate-400">{description}</p>
      </div>
    </div>
  );
}
