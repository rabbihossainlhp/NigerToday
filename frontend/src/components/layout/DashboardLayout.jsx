import { Suspense } from "react";
import Sidebar from "./Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
        {children}
      </div>
    </AuthGuard>
  );
}

function SidebarFallback() {
  return <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-100/70" />;
}
