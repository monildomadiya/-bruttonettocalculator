"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, ShieldCheck, Lock } from "lucide-react";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/admin");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAuthorized(true);
            setLoading(false);
            return;
          }
        }
        router.replace("/admin-secure/login");
      } catch (err) {
        router.replace("/admin-secure/login");
      }
    }
    checkAuth();
  }, [router, pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" });
      router.replace("/admin-secure/login");
      router.refresh();
    } catch (err) {
      router.replace("/admin-secure/login");
    }
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#060606] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#FF2E44] mb-4 shadow-[0_0_20px_rgba(230,10,28,0.3)]">
          <Lock size={28} className="animate-pulse" />
        </div>
        <h3 className="font-display font-black text-xl text-white mb-2">🔒 Geschützter Admin-Bereich</h3>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Loader2 size={16} className="animate-spin text-[#E60A1C]" />
          <span>Authentifizierung wird überprüft...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col">
      {/* Security Top Bar */}
      <div className="bg-[#0e0e0e] border-b border-white/15 py-3 px-4 sm:px-8 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-white/80 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Admin Center — Logged in as darshan / admin</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-extrabold uppercase tracking-wider transition-all"
          >
            <LogOut size={13} />
            <span>Abmelden (Logout)</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
