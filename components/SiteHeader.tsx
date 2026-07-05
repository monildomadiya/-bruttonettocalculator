"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calculator, Calendar, BookOpen, HelpCircle, Newspaper, LayoutList } from "lucide-react";
import MobileMenu from "./MobileMenu";

const nav = [
  { href: "/",                          label: "Rechner",       icon: Calculator },
  { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar },
  { href: "/blog",                      label: "Blog",          icon: Newspaper },
  { href: "/lexikon",                   label: "Lexikon",       icon: BookOpen },
  { href: "/faq",                       label: "FAQ",           icon: HelpCircle },
  { href: "/steuerklassen",             label: "Steuerklassen", icon: LayoutList },
];

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide header on all admin pages
  if (pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
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
