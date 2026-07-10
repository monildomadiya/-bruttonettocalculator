"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function SiteFooter() {
  const pathname = usePathname();

  // Hide footer on all admin pages
  if (pathname?.startsWith("/admin-secure") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="no-print pb-12 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-[#090909] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        
        {/* Subtle red accent glow line at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#E60A1C]/70 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-24 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />

        {/* Footer grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info (Spans 4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group" aria-label="BruttoNettoCalculator Startseite">
              <Image
                src="/BRUTTO-NETTO-LOGO.svg"
                alt="BruttoNetto Calculator Logo"
                width={220}
                height={52}
                className="h-8 sm:h-10 w-auto opacity-90 transition-opacity group-hover:opacity-100"
              />
            </Link>
            <p className="leading-relaxed text-white/60 text-sm font-normal pr-4">
              Der präzise Gehaltsrechner für Deutschland nach § 32a EStG. Berechnen Sie Ihr Nettogehalt in Sekundenschnelle — kostenlos, ohne Registrierung und DSGVO-konform.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs font-mono text-white/40">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E60A1C]" />
              <span>Stand: Juli 2026 · § 32a EStG</span>
            </div>
          </div>

          {/* Col 2: Rechner (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-6">
              RECHNER
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-white/60 font-medium">
              <li><Link href="/"                          className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Brutto Netto Rechner 2026</Link></li>
              <li><Link href="/brutto-netto-rechner-2027" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Rechner 2027 (Vorschau)</Link></li>
              <li><Link href="/blog"                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Blog</Link></li>
              <li><Link href="/rechner/brutto-zu-netto"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Brutto zu Netto</Link></li>
              <li><Link href="/rechner/netto-zu-brutto"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Netto zu Brutto</Link></li>
              <li><Link href="/firmenwagenrechner"        className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Firmenwagenrechner</Link></li>
              <li><Link href="/rentenrechner"              className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Rentenrechner</Link></li>
              <li><Link href="/arbeitslosengeld-rechner"  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Arbeitslosengeld-Rechner</Link></li>
              <li><Link href="/mindestlohn"                className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Mindestlohn Rechner</Link></li>
              <li><Link href="/pfaendungstabelle"          className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Pfändungstabelle</Link></li>
              <li><Link href="/lexikon"                   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Steuer-Lexikon</Link></li>
              <li><Link href="/faq"                       className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">FAQ & Hilfe</Link></li>
            </ul>
          </div>

          {/* Col 2b: Weitere Rechner (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-6">
              WEITERE RECHNER
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-white/60 font-medium">
              <li><Link href="/minijob-rechner"           className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Minijob-Rechner</Link></li>
              <li><Link href="/elterngeld-rechner"        className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Elterngeld-Rechner</Link></li>
              <li><Link href="/abfindungsrechner"         className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Abfindungsrechner</Link></li>
              <li><Link href="/bonus-steuerrechner"       className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Bonus-Steuerrechner</Link></li>
              <li><Link href="/stundenlohn-rechner"       className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Stundenlohn-Rechner</Link></li>
              <li><Link href="/steuerklassen"             className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Steuerklassen</Link></li>
            </ul>
          </div>

          {/* Col 3: Rechtliches (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-6">
              RECHTLICHES
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base text-white/60 font-medium">
              <li><Link href="/impressum"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Datenschutz</Link></li>
              <li><Link href="/kontakt"     className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Kontakt</Link></li>
              <li><Link href="/ueber-uns"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Über uns</Link></li>
            </ul>
          </div>

          {/* Col 4: Partner & Newsletter (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-4">
                PARTNER & KI-TOOLS
              </p>
              <a
                href="https://promptking.in"
                target="_blank"
                rel="noopener"
                className="group block p-4 rounded-2xl bg-gradient-to-br from-[#161616] to-[#0C0C0C] border border-white/15 hover:border-[#E60A1C]/60 transition-all shadow-md hover:shadow-[0_0_25px_rgba(230,10,28,0.25)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-white group-hover:text-[#E60A1C] transition-colors flex items-center gap-2">
                    PromptKing.in <span className="w-1.5 h-1.5 rounded-full bg-[#E60A1C] animate-pulse" />
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-[#E60A1C] group-hover:text-white group-hover:border-transparent transition-all font-mono">
                    ↗
                  </span>
                </div>
                <p className="text-xs text-white/50 font-medium">Die Nr. 1 Plattform für KI-Prompts & Workflows</p>
              </a>
            </div>

            {/* Newsletter Box (Exact match to PromptKing style!) */}
            <div>
              <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-3">
                NEWSLETTER
              </p>
              <p className="text-xs text-white/60 mb-3 font-medium">
                Amtliche Steuer-Updates direkt ins Postfach.
              </p>
              <div className="flex items-center bg-[#141414] border border-white/15 rounded-full p-1 pl-4 focus-within:border-[#E60A1C] transition-all shadow-inner">
                <input
                  type="email"
                  placeholder="E-Mail eingeben..."
                  className="bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 outline-none w-full pr-2 font-medium"
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
        <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/50 font-medium">
          <div>
            © {new Date().getFullYear()} BruttoNettoCalculator.com. Alle Rechte vorbehalten. · Keine Steuerberatung.
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span>Amtliche Steuerwerte 2026 aktiv</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
