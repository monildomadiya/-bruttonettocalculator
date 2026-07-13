"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  const pathname = usePathname();

  // Hide footer on all admin pages
  if (pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="no-print pb-12 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(16,24,40,0.12)]">
        
        {/* Subtle red accent glow line at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#E60A1C]/70 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-24 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />

        {/* Footer grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-8 gap-y-10 sm:gap-x-10 sm:gap-y-12 pb-12 border-b border-black/[0.08]">

          {/* Brand Info (full width until lg, then 4/12) */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group" aria-label="BruttoNettoCalculator Startseite">
              <Image
                src="/BRUTTO-NETTO-LOGO.svg"
                alt="BruttoNetto Calculator Logo"
                width={220}
                height={52}
                className="h-8 sm:h-10 w-auto opacity-90 transition-opacity group-hover:opacity-100"
              />
            </Link>
            <p className="leading-relaxed text-black/60 text-sm font-normal max-w-sm">
              Der präzise Gehaltsrechner für Deutschland nach § 32a EStG. Berechnen Sie Ihr Nettogehalt in Sekundenschnelle — kostenlos, ohne Registrierung und DSGVO-konform.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs font-mono text-black/40">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E60A1C]" />
              <span>Stand: Juli 2026 · § 32a EStG</span>
            </div>
          </div>

          {/* Rechner (core, high-traffic) */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-[#16181D] mb-6">
              RECHNER
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-black/60 font-medium">
              <li><Link href="/"                          className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Brutto Netto Rechner</Link></li>
              <li><Link href="/rechner/brutto-zu-netto"   className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Brutto zu Netto</Link></li>
              <li><Link href="/rechner/netto-zu-brutto"   className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Netto zu Brutto</Link></li>
              <li><Link href="/mindestlohn"                className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Mindestlohn Rechner</Link></li>
              <li><Link href="/minijob-rechner"            className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Minijob-Rechner</Link></li>
              <li><Link href="/steuerklassen"             className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Steuerklassen</Link></li>
            </ul>
          </div>

          {/* Tools & Wissen (secondary calculators + knowledge resources) */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-[#16181D] mb-6">
              TOOLS & WISSEN
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-black/60 font-medium">
              <li><Link href="/firmenwagenrechner"        className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Firmenwagenrechner</Link></li>
              <li><Link href="/rentenrechner"              className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Rentenrechner</Link></li>
              <li><Link href="/elterngeld-rechner"        className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Elterngeld-Rechner</Link></li>
              <li><Link href="/pfaendungstabelle"          className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Pfändungstabelle</Link></li>
              <li><Link href="/lexikon"                   className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Steuer-Lexikon</Link></li>
              <li><Link href="/faq"                       className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">FAQ & Hilfe</Link></li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-[#16181D] mb-6">
              RECHTLICHES
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-black/60 font-medium">
              <li><Link href="/impressum"   className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Datenschutz</Link></li>
              <li><Link href="/kontakt"     className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Kontakt</Link></li>
              <li><Link href="/ueber-uns"   className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Über uns</Link></li>
              <li><Link href="/blog"        className="hover:text-[#16181D] hover:translate-x-1 inline-block transition-all duration-200">Blog</Link></li>
            </ul>
          </div>

          {/* Partner & Newsletter */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <div>
              <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-[#16181D] mb-4">
                PARTNER & KI-TOOLS
              </p>
              <a
                href="https://promptking.in"
                target="_blank"
                rel="noopener"
                className="group block p-4 rounded-2xl bg-gradient-to-br from-[#F1F3F5] to-[#FFFFFF] border border-black/[0.10] hover:border-[#E60A1C]/60 transition-all shadow-md hover:shadow-[0_0_25px_rgba(230,10,28,0.25)]"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="min-w-0 font-display font-bold text-[#16181D] group-hover:text-[#E60A1C] transition-colors flex items-center gap-2">
                    <span className="truncate">PromptKing.in</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E60A1C] animate-pulse flex-shrink-0" />
                  </span>
                  <span className="w-7 h-7 rounded-full bg-black/[0.04] border border-black/[0.08] flex items-center justify-center text-black/70 group-hover:bg-[#E60A1C] group-hover:text-white group-hover:border-transparent transition-all flex-shrink-0">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
                <p className="text-xs text-black/50 font-medium">Die Nr. 1 Plattform für KI-Prompts & Workflows</p>
              </a>
            </div>

            {/* Newsletter Box (Exact match to PromptKing style!) */}
            <div>
              <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-[#16181D] mb-3">
                NEWSLETTER
              </p>
              <p className="text-xs text-black/60 mb-3 font-medium">
                Amtliche Steuer-Updates direkt ins Postfach.
              </p>
              <div className="flex items-center bg-[#F1F3F5] border border-black/[0.10] rounded-full p-1 pl-4 focus-within:border-[#E60A1C] transition-all shadow-inner">
                <input
                  type="email"
                  placeholder="E-Mail eingeben..."
                  className="bg-transparent text-xs sm:text-sm text-[#16181D] placeholder:text-black/40 outline-none w-full pr-2 font-medium"
                  readOnly
                />
                <button
                  type="button"
                  title="Anmelden"
                  aria-label="Für Newsletter anmelden"
                  className="w-9 h-9 rounded-full bg-[#E60A1C] hover:bg-[#FF2436] flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_rgba(230,10,28,0.5)] transition-all"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-black/50 font-medium">
          <div>
            © {new Date().getFullYear()} BruttoNettoCalculator.com. Alle Rechte vorbehalten. · Keine Steuerberatung.
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/30 text-emerald-600 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span>Amtliche Steuerwerte 2026 aktiv</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
