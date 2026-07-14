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
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Hide header on all admin pages
  const isAdmin = pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin");

  // Track scroll for glass intensity change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="sticky top-0 z-40 w-full px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pointer-events-none">
      <header
        className="pointer-events-auto max-w-6xl mx-auto transition-all duration-500"
        style={{
          borderRadius: "15px",
          background: scrolled
            ? "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(241,243,245,0.68) 50%, rgba(255,255,255,0.72) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(245,246,248,0.76) 50%, rgba(255,255,255,0.80) 100%)",
          backdropFilter: scrolled ? "blur(28px) saturate(2)" : "blur(20px) saturate(1.7)",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(2)" : "blur(20px) saturate(1.7)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: scrolled
            ? "inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 40px rgba(16,24,40,0.10), 0 2px 6px rgba(16,24,40,0.04), 0 0 0 1px rgba(0,0,0,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 24px rgba(16,24,40,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
          transform: scrolled ? "scale(0.985)" : "scale(1)",
        }}
      >

        <div className="px-4 sm:px-5 md:px-6 h-[64px] sm:h-[68px] md:h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0" aria-label="BruttoNettoCalculator Startseite">
            <Image
              src="/BRUTTO-NETTO-LOGO.svg"
              alt="BruttoNetto Calculator Logo"
              width={280}
              height={65}
              className="h-[34px] sm:h-[40px] md:h-[46px] w-auto transition-transform duration-300 group-hover:scale-[1.03]"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Hauptnavigation" ref={ref}>
            {/* Rechner mega-menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="group flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm lg:text-base font-semibold transition-all duration-300 whitespace-nowrap"
                style={{
                  color: menuOpen ? "#16181D" : "rgba(0,0,0,0.78)",
                  background: menuOpen
                    ? "rgba(255,255,255,0.65)"
                    : "transparent",
                  boxShadow: menuOpen
                    ? "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(16,24,40,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
                    : "none",
                  backdropFilter: menuOpen ? "blur(12px)" : "none",
                }}
              >
                <span className="transition-colors duration-200 group-hover:text-[#16181D]">Rechner</span>
                <ChevronDown size={15} className={`text-[#E60A1C] transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega-menu panel — glassmorphism dropdown */}
              {menuOpen && (
                <div
                  className="mega-menu-panel absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(90vw,760px)] z-50 overflow-hidden origin-top"
                  role="menu"
                  style={{
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(245,246,248,0.96) 100%)",
                    backdropFilter: "blur(40px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(40px) saturate(1.8)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 20px 60px rgba(16,24,40,0.16), 0 4px 12px rgba(16,24,40,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
                  }}
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
                                  className="group flex items-start gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200"
                                  style={{}}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 6px rgba(16,24,40,0.05)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.boxShadow = "none";
                                  }}
                                >
                                  <Icon size={15} className="text-black/50 group-hover:text-[#E60A1C] mt-0.5 flex-shrink-0 transition-colors" />
                                  <span>
                                    <span className="block text-sm font-semibold text-black/90 group-hover:text-[#16181D] transition-colors leading-tight">
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span className="block text-[11px] text-black/55 leading-tight mt-0.5">
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
                  className="group flex items-center gap-2 px-4 py-2 rounded-2xl text-sm lg:text-base font-semibold transition-all duration-300 whitespace-nowrap"
                  style={{
                    color: "rgba(0,0,0,0.78)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#16181D";
                    e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(16,24,40,0.06), 0 0 0 1px rgba(0,0,0,0.04)";
                    e.currentTarget.style.backdropFilter = "blur(12px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(0,0,0,0.78)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backdropFilter = "none";
                  }}
                >
                  <Icon size={16} className="text-[#E60A1C] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </header>
    </div>
  );
}
