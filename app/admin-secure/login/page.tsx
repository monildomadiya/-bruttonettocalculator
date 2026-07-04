"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

/* ── Exact PromptKing Emblem SVG ──────────────────────────────────────── */
function PromptKingEmblem({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true" className="mx-auto select-none">
      {/* Circular Rotating-style Text Path */}
      <defs>
        <path
          id="textCircle"
          d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
        />
      </defs>

      {/* Outer Circular Text */}
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

      {/* Center Geometric King Crown & Face */}
      <g transform="translate(44, 44) scale(0.45)">
        {/* Crown Points */}
        <path
          d="M10 35 L28 10 L45 30 L80 5 L115 30 L132 10 L150 35 L140 55 L20 55 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Crown Jewels / Details */}
        <circle cx="28" cy="18" r="4" fill="#0c0c0c" />
        <circle cx="80" cy="15" r="5" fill="#0c0c0c" />
        <circle cx="132" cy="18" r="4" fill="#0c0c0c" />
        <path d="M25 45 L135 45" stroke="#0c0c0c" strokeWidth="4" />

        {/* Geometric King Face / Beard Lines */}
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

export default function AdminLoginPage() {
  const router = useRouter();
  
  // 10-digit PIN state
  const [pin, setPin] = useState<string[]>(Array(10).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto focus first PIN input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  async function authenticate(pinCode: string) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: pinCode }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin-secure");
        router.refresh();
      } else {
        setError("Invalid Code");
        setTimeout(() => {
          setPin(Array(10).fill(""));
          inputRefs.current[0]?.focus();
        }, 700);
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  // Handle PIN input change
  function handlePinChange(index: number, value: string) {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    // Move to next box if digit entered
    if (digit && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all 10 digits are filled
    const fullPin = newPin.join("");
    if (fullPin.length === 10 && newPin.every((val) => val !== "")) {
      authenticate(fullPin);
    }
  }

  // Handle keyboard events (Backspace, Arrows)
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

  // Handle Paste event for full 10-digit PIN
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

  return (
    <main className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 select-none">
      
      {/* Exact Match Card Box */}
      <div className="w-full max-w-[430px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[38px] p-10 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,1)] relative flex flex-col items-center">
        
        {/* PromptKing Circular Emblem */}
        <div className="mb-7">
          <PromptKingEmblem size={135} />
        </div>
        
        {/* Title */}
        <h1 className="font-display font-bold text-[28px] sm:text-[30px] tracking-tight text-white mb-2 text-center">
          Admin Portal
        </h1>
        
        {/* Subtitle */}
        <p className="text-[#666666] text-sm font-medium tracking-normal mb-9 text-center">
          Authenticated Access Only
        </p>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 flex items-center gap-2 text-xs text-white/60 font-semibold animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span>Authenticating...</span>
          </div>
        )}

        {/* 10-Digit PIN Grid (2 rows x 5 columns) */}
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
              disabled={loading}
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
