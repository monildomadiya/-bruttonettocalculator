"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, BookOpen, HelpCircle, Newspaper } from "lucide-react";
import { calculatorGroups } from "@/lib/navigation";

const directLinks = [
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/lexikon", label: "Lexikon", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="md:hidden relative" ref={ref}>
      {/* Hamburger button */}
      <button
        id="mobile-menu-btn"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white shadow-sm hover:bg-white/20 active:scale-95 transition-all"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Dropdown panel */}
      <div
        id="mobile-menu-panel"
        role="menu"
        className={`mobile-menu absolute right-0 top-14 sm:top-16 w-[86vw] max-w-sm rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] bg-[#121212]/[98%] backdrop-blur-2xl border border-white/20 overflow-hidden z-50 ${
          open ? "open" : "closed"
        }`}
      >
        <div className="max-h-[75vh] overflow-y-auto p-3">
          {calculatorGroups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#E60A1C]/80 font-bold">
                {group.label}
              </p>
              {group.items.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon size={16} className="text-[#E60A1C] flex-shrink-0" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="h-px bg-white/10 my-2" />

          {directLinks.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
              >
                <Icon size={16} className="text-[#E60A1C]" />
                {n.label}
              </Link>
            );
          })}

          <div className="p-1 pt-2">
            <Link
              href="/rechner/brutto-zu-netto"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 15px rgba(230,10,28,0.40)" }}
            >
              Jetzt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
