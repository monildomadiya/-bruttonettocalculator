"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2, LogOut, ShieldCheck, AlertCircle, Sparkles, Database, Globe, Layers, User, ExternalLink, Activity } from "lucide-react";

/* ── Exact PromptKing Emblem SVG ──────────────────────────────────────── */
function PromptKingEmblem({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true" className="mx-auto select-none">
      <defs>
        <path
          id="textCircle"
          d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
        />
      </defs>

      <text
        fill="#FFFFFF"
        fontSize="12.5"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="3"
      >
        <textPath href="#textCircle" startOffset="0%" textAnchor="middle" fill="#ffffff">
          PROMPT KING • PROMPT KING • PROMPT KING •
        </textPath>
      </text>

      <g transform="translate(44, 44) scale(0.45)">
        <path
          d="M10 35 L28 10 L45 30 L80 5 L115 30 L132 10 L150 35 L140 55 L20 55 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="18" r="4" fill="#0c0c0c" />
        <circle cx="80" cy="15" r="5" fill="#0c0c0c" />
        <circle cx="132" cy="18" r="4" fill="#0c0c0c" />
        <path d="M25 45 L135 45" stroke="#0c0c0c" strokeWidth="4" />

        <path
          d="M35 58 L125 58 L140 120 L80 155 L20 120 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M80 58 L80 155" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M35 58 L80 110 L125 58" fill="none" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M45 85 L80 135 L115 85" fill="none" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M25 105 L80 155 L135 105" fill="none" stroke="#FFFFFF" strokeWidth="4" />
      </g>
    </svg>
  );
}

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
        setAuthorized(false);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  // Focus first PIN box when rendered
  useEffect(() => {
    if (!loading && !authorized) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [loading, authorized]);

  async function authenticate(pinCode: string) {
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: pinCode }),
      });
      const data = await res.json();

      if (data.success) {
        setAuthorized(true);
        router.refresh();
      } else {
        setLoginError("Invalid Code");
        setTimeout(() => {
          setPin(Array(10).fill(""));
          inputRefs.current[0]?.focus();
        }, 700);
      }
    } catch (err) {
      setLoginError("Connection error");
    } finally {
      setLoginLoading(false);
    }
  }

  function handlePinChange(index: number, value: string) {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    if (digit && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullPin = newPin.join("");
    if (fullPin.length === 10 && newPin.every((val) => val !== "")) {
      authenticate(fullPin);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 9) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      const fullPin = pin.join("");
      if (fullPin.length === 10) {
        authenticate(fullPin);
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 10);
    if (!pastedData) return;

    const newPin = Array(10).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    if (pastedData.length === 10) {
      inputRefs.current[9]?.focus();
      authenticate(pastedData);
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

  // Render PromptKing Login Screen directly on /admin-secure when unauthorized!
  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 select-none">
        <div className="w-full max-w-[430px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[38px] p-10 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,1)] relative flex flex-col items-center">
          
          <div className="mb-7">
            <PromptKingEmblem size={135} />
          </div>
          
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] tracking-tight text-white mb-2 text-center">
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
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#E60A1C]/30 selection:text-white">
      {/* Executive SaaS Top Navigation Header */}
      <header className="bg-[#0b0b0b]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Brand Logo & System Status */}
          <div className="flex items-center gap-4">
            <a href="/admin-secure" className="flex items-center gap-3.5 group">
              <Image
                src="/BRUTTO-NETTO-LOGO.svg"
                alt="BruttoNetto Calculator Logo"
                width={190}
                height={45}
                className="h-7 sm:h-8 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
                priority
              />
              <div className="hidden sm:block border-l border-white/15 pl-3">
                <div className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E44] to-[#ff7e8a]">ADMIN PRO</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-black uppercase text-white/90">2026</span>
                </div>
                <div className="text-[10px] text-white/50 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span>MySQL Ready</span>
                </div>
              </div>
            </a>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#121212] p-1.5 rounded-full border border-white/10 text-xs font-bold shadow-inner">
            <a href="/admin-secure" className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${!pathname.includes("/new") && !pathname.includes("/edit") ? "bg-gradient-to-r from-[#E60A1C] to-[#FF2436] text-white shadow-md" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <Layers size={14} className={!pathname.includes("/new") && !pathname.includes("/edit") ? "text-white" : "text-[#FF2E44]"} />
              <span>Beiträge & Dashboard</span>
            </a>
            <a href="/admin-secure/articles/new" className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${pathname.includes("/new") ? "bg-gradient-to-r from-[#E60A1C] to-[#FF2436] text-white shadow-md" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <Sparkles size={14} className={pathname.includes("/new") ? "text-white" : "text-amber-400"} />
              <span>+ Neuer Artikel</span>
            </a>
            <a href="/" target="_blank" className="px-4 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <Globe size={14} className="text-blue-400" />
              <span>Live Webseite ↗</span>
            </a>
          </div>

          {/* Right Executive Actions & User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-white/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <User size={13} className="text-amber-300" />
              <span>Superuser Admin</span>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Sicher abmelden"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
