"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

export const inputClass =
  "w-full rounded-xl border border-[#E4E7EB] bg-white px-3.5 py-3 text-[15px] text-[#16181D] outline-none transition placeholder:text-black/35 focus:border-[#E60A1C] focus:ring-2 focus:ring-[#E60A1C]/15 disabled:bg-[#F4F5F7] disabled:text-black/50 sm:py-2.5 sm:text-sm";

export function Field({
  label,
  htmlFor,
  aside,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  aside?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-black/60"
      >
        <span>{label}</span>
        {aside && <span className="normal-case tracking-normal">{aside}</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-black/45">{hint}</p>}
    </div>
  );
}

export function Counter({ n, max, min = 0, ideal }: { n: number; max: number; min?: number; ideal?: number }) {
  const bad = n > max || (min > 0 && n > 0 && n < min);
  const warn = ideal !== undefined && n > ideal;
  return <span className={bad ? "text-[#B5081A]" : warn ? "text-amber-600" : "text-black/40"}>{n}/{max}</span>;
}

export function Button({
  variant = "primary",
  busy,
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "soft" | "danger"; busy?: boolean }) {
  const styles = {
    primary: "bg-[#E60A1C] text-white hover:bg-[#B5081A] shadow-sm shadow-[#E60A1C]/20",
    ghost: "text-black/65 hover:bg-black/[0.05] hover:text-[#16181D]",
    soft: "bg-white text-[#16181D] border border-black/10 hover:border-black/25",
    danger: "text-[#B5081A] hover:bg-[#E60A1C]/10",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      disabled={busy || props.disabled}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:opacity-60 sm:min-h-[40px] ${styles} ${className}`}
    >
      {busy && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

/**
 * Editor container: full screen on phones (like a native app screen), a side
 * panel on larger screens. Body scroll is locked while open; Esc closes.
 */
export function Sheet({
  title,
  onClose,
  footer,
  wide,
  children,
}: {
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 hidden bg-black/40 backdrop-blur-sm sm:block" onClick={onClose} />
      <div
        className={`relative flex h-full w-full flex-col bg-[#F4F5F7] shadow-2xl sm:rounded-l-3xl ${
          wide ? "sm:max-w-5xl" : "sm:max-w-xl"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-black/[0.06] bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:rounded-tl-3xl sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
          >
            <X size={22} />
          </button>
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-bold text-[#16181D]">{title}</h2>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">{children}</div>
        {footer && (
          <footer className="border-t border-black/[0.06] bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-bl-3xl sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Toasts ─────────────────────────── */

type Toast = { id: number; kind: "ok" | "error"; text: string };
const ToastContext = createContext<(kind: Toast["kind"], text: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = ++next.current;
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3500);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4 lg:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl bg-[#16181D] px-4 py-3 text-sm text-white shadow-xl"
          >
            {t.kind === "ok" ? (
              <CheckCircle2 size={18} className="mt-px flex-shrink-0 text-emerald-400" />
            ) : (
              <XCircle size={18} className="mt-px flex-shrink-0 text-[#FF5A66]" />
            )}
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
