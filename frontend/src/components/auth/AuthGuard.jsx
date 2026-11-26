"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_CHANGED_EVENT,
  AUTH_STORAGE_KEY,
  getAuth,
} from "@/services/apiClient";

export { AUTH_CHANGED_EVENT, AUTH_STORAGE_KEY };

function subscribeToAuthChanges(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGED_EVENT, callback);
  };
}

function getAuthSnapshot() {
  return Boolean(getAuth()?.accessToken);
}

export default function AuthGuard({ children }) {
  const router = useRouter();

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    () => false
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return children;
}