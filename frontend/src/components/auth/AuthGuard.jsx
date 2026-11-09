"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";



export const AUTH_STORAGE_KEY = "nigertoday_auth";
export const AUTH_CHANGED_EVENT = "nigertoday-auth-changed";

function subscribeToAuthChanges(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGED_EVENT, callback);
  };
}

function getAuthSnapshot() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    return auth?.loggedIn === true;
  } catch {
    return false;
  }
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