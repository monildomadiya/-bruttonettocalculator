"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Calculator, Calendar, BookOpen, HelpCircle, Newspaper } from "lucide-react";

const nav = [
  { href: "/",                          label: "Rechner",       icon: Calculator },
  { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar },
  { href: "/blog",                      label: "Blog",          icon: Newspaper },
  { href: "/lexikon",                   label: "Lexikon",       icon: BookOpen },
  { href: "/faq",                       label: "FAQ",           icon: HelpCircle },
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
        className={`mobile-menu absolute right-0 top-14 sm:top-16 w-64 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] bg-[#121212]/95 backdrop-blur-2xl border border-white/20 overflow-hidden z-50 ${
          open ? "open" : "closed"
        }`}
      >
        <div className="p-3">
          {nav.map((n) => {
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
          <div className="h-px bg-white/10 my-2" />
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
  );
}
