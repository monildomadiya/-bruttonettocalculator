"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Calculator, Calendar, BookOpen, HelpCircle } from "lucide-react";

const nav = [
  { href: "/",                          label: "Rechner",       icon: Calculator },
  { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar },
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
        className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Dropdown panel */}
      <div
        id="mobile-menu-panel"
        role="menu"
        className={`mobile-menu absolute right-0 top-20 w-72 rounded-3xl shadow-2xl bg-[#111111] border border-white/15 overflow-hidden ${
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
