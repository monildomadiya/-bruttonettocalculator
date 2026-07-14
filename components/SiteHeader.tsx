"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, HelpCircle, Newspaper, ChevronDown } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { calculatorGroups } from "@/lib/navigation";

const directLinks = [
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/lexikon", label: "Lexikon", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Hide header on all admin pages
  const isAdmin = pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Close the dropdown whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (isAdmin) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-6xl mx-auto px-5 h-[72px] sm:h-[84px] md:h-[92px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center group flex-shrink-0" aria-label="BruttoNettoCalculator Startseite">
          <Image
            src="/BRUTTO-NETTO-LOGO.svg"
            alt="BruttoNetto Calculator Logo"
            width={280}
            height={65}
            className="h-[38px] sm:h-[45px] md:h-[50px] w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Hauptnavigation" ref={ref}>
          {/* Rechner mega-menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className="nav-link flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm lg:text-base font-semibold text-black/85 hover:text-[#16181D] hover:bg-black/[0.05] transition-all whitespace-nowrap"
            >
              <span>Rechner</span>
              <ChevronDown size={15} className={`text-[#E60A1C] transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mega-menu panel — only mounted in the DOM while open, avoiding any opacity/transition edge cases */}
            {menuOpen && (
              <div
                className="mega-menu-panel absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(90vw,760px)] z-50 rounded-3xl bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.10)] overflow-hidden origin-top"
                role="menu"
              >
                <div className="grid grid-cols-3 gap-6 p-6">
                  {calculatorGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#E60A1C] font-bold mb-3">
                        {group.label}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                role="menuitem"
                                className="group flex items-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/[0.07] transition-colors"
                              >
                                <Icon size={15} className="text-black/40 group-hover:text-[#E60A1C] mt-0.5 flex-shrink-0 transition-colors" />
                                <span>
                                  <span className="block text-sm font-semibold text-black/85 group-hover:text-[#16181D] transition-colors leading-tight">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="block text-[11px] text-black/40 leading-tight mt-0.5">
                                      {item.description}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {directLinks.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm lg:text-base font-semibold text-black/85 hover:text-[#16181D] hover:bg-black/[0.05] transition-all whitespace-nowrap"
              >
                <Icon size={16} className="text-[#E60A1C] flex-shrink-0" />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
