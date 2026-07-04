"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Calendar, BookOpen, HelpCircle, Newspaper } from "lucide-react";
import MobileMenu from "./MobileMenu";

const nav = [
  { href: "/",                          label: "Rechner",       icon: Calculator },
  { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar },
  { href: "/blog",                      label: "Blog",          icon: Newspaper },
  { href: "/lexikon",                   label: "Lexikon",       icon: BookOpen },
  { href: "/faq",                       label: "FAQ",           icon: HelpCircle },
];

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      <path
        d="M7 16h6M13 16l4-5M13 16l4 5M19 11h6M19 21h6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E60A1C" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide header on all admin pages
  if (pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-6xl mx-auto px-5 h-16 sm:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0" aria-label="BruttoNettoCalculator Startseite">
          <LogoMark size={34} />
          <span className="font-display font-extrabold text-[19px] sm:text-2xl text-white tracking-tight">
            Brutto<span className="text-gradient-accent">Netto</span>
            <span className="hidden sm:inline">Calculator</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Hauptnavigation">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm lg:text-base font-semibold text-white/85 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
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
