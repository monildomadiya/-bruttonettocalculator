"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, ShieldCheck, AlertCircle, Sparkles, Database, Globe, Layers, User, ExternalLink, Activity } from "lucide-react";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // PIN Login State
  const [pin, setPin] = useState<string[]>(Array(10).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Auth check failed:", err);
      }
      setAuthorized(false);
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Focus first PIN box when rendered
  useEffect(() => {
    if (!loading && !authorized) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [loading, authorized]);

  function handlePinChange(index: number, value: string) {
    if (value && !/^\d+$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setLoginError(null);

    if (value && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 9) {
      authenticate(newPin);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function authenticate(pinArray: string[]) {
    const fullPin = pinArray.join("");
    if (fullPin.length !== 10) return;

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: fullPin, pin: fullPin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthorized(true);
        router.refresh();
      } else {
        setLoginError("Invalid Admin PIN");
        setPin(Array(10).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setLoginError("Connection Error");
    } finally {
      setLoginLoading(false);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10).split("");
    if (pastedData.length === 0) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    if (pastedData.length === 10) {
      authenticate(newPin);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" });
      setAuthorized(false);
      setPin(Array(10).fill(""));
      router.push("/admin-secure");
      router.refresh();
    } catch (err) {
      setAuthorized(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-white/40" />
      </div>
    );
  }

  // Render Login Screen directly on /admin-secure when unauthorized!
  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 select-none">
        <div className="w-full max-w-[430px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[38px] p-10 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,1)] relative flex flex-col items-center">
          
          <div className="mb-8">
            <Image
              src="/BRUTTO-NETTO-LOGO.svg"
              alt="BruttoNetto Calculator Logo"
              width={220}
              height={55}
              className="h-10 sm:h-12 w-auto mx-auto drop-shadow-[0_0_20px_rgba(230,10,28,0.5)] transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          
          <h1 className="font-display font-bold text-[24px] sm:text-[26px] tracking-tight text-white mb-2 text-center">
            Admin Portal
          </h1>
          
          <p className="text-[#666666] text-sm font-medium tracking-normal mb-9 text-center">
            Authenticated Access Only
          </p>

          {loginError && (
            <div className="mb-6 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          {loginLoading && (
            <div className="mb-6 flex items-center gap-2 text-xs text-white/60 font-semibold animate-pulse">
              <Loader2 size={16} className="animate-spin" />
              <span>Authenticating...</span>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2.5 sm:gap-3 w-full justify-center max-w-[340px]" onPaste={handlePaste}>
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={loginLoading}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-13 sm:w-[54px] sm:h-[60px] bg-[#141414] border border-[#222222] rounded-[16px] text-center text-xl sm:text-2xl font-mono font-bold text-white focus:border-white/35 focus:bg-[#1a1a1a] outline-none transition-all duration-150 disabled:opacity-40"
              />
            ))}
          </div>

        </div>
      </main>
    );
  }

  // Render Admin Dashboard when authorized!
  return <>{children}</>;
}
