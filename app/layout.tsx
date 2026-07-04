import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, Calculator, BookOpen, HelpCircle, ArrowRight, Shield, Lock, Calendar } from "lucide-react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";

export const metadata: Metadata = {
  metadataBase: new URL("https://bruttonettocalculator.com"),
  title: {
    default: "Brutto Netto Rechner 2026 | Gehaltsrechner Deutschland",
    template: "%s | BruttoNettoCalculator.com",
  },
  description:
    "Kostenloser Brutto Netto Rechner für 2026: Berechnen Sie Ihr Nettogehalt aus dem Bruttogehalt — inkl. Lohnsteuer, Soli, Kranken-, Renten-, Pflege- und Arbeitslosenversicherung. Alle 6 Steuerklassen.",
  keywords: [
    "brutto netto rechner",
    "gehaltsrechner",
    "netto rechner 2026",
    "lohnrechner deutschland",
    "steuerrechner",
    "brutto zu netto",
    "nettogehalt berechnen",
    "einkommensteuer rechner",
  ],
  authors:   [{ name: "BruttoNettoCalculator.com" }],
  creator:   "BruttoNettoCalculator.com",
  publisher: "BruttoNettoCalculator.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Brutto Netto Rechner 2026 | Gehaltsrechner Deutschland",
    description:
      "Berechnen Sie in Sekunden Ihr Nettogehalt — aktuell für 2026, alle Steuerklassen, Sozialabgaben, Lohnsteuer & Soli.",
    url: "https://bruttonettocalculator.com",
    siteName: "BruttoNettoCalculator.com",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutto Netto Rechner 2026 — kostenlos & aktuell",
    description:
      "Sofort Nettogehalt berechnen — Lohnsteuer, Soli, Sozialabgaben, alle Steuerklassen.",
    creator: "@bruttonetto_de",
  },
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/" },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  other: {
    "geo.region": "DE",
    "geo.placename": "Deutschland",
    "DC.language": "de",
  },
};

/* ── Structured data ──────────────────────────────────────────────── */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BruttoNettoCalculator.com",
  url: "https://bruttonettocalculator.com",
  description: "Kostenloser Brutto-Netto-Rechner für Deutschland",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bruttonettocalculator.com/?brutto={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Brutto Netto Rechner 2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Online-Gehaltsrechner: Netto aus Brutto berechnen — § 32a EStG 2026, alle Steuerklassen, Sozialabgaben.",
  url: "https://bruttonettocalculator.com",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BruttoNettoCalculator.com",
  url: "https://bruttonettocalculator.com",
  description: "Kostenloser Online-Gehaltsrechner für Deutschland",
};

const nav = [
  { href: "/",                          label: "Rechner",       icon: Calculator },
  { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar },
  { href: "/lexikon",                   label: "Lexikon",       icon: BookOpen },
  { href: "/faq",                       label: "FAQ",           icon: HelpCircle },
];


/* ── Logo mark ────────────────────────────────────────────────────── */
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-body bg-black text-white antialiased">

        {/* ── Sticky glass header ─────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.9)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-28 sm:h-32 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group" aria-label="BruttoNettoCalculator Startseite">
              <LogoMark size={48} />
              <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Brutto<span className="text-gradient-accent">Netto</span>
                <span className="hidden sm:inline">Calculator</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-3" aria-label="Hauptnavigation">
              {nav.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="nav-link flex items-center gap-3 px-6 py-4 rounded-2xl text-xl font-bold text-white/90 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon size={22} className="text-[#E60A1C]" />
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/rechner/brutto-zu-netto"
                className="ml-6 flex items-center gap-3 text-xl font-black px-9 py-4 rounded-full text-white no-print transition-all hover:opacity-90 hover:scale-105 shadow-2xl"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 10px 30px rgba(230,10,28,0.55)" }}
              >
                Berechnen <ArrowRight size={22} />
              </Link>
            </nav>

            {/* Mobile menu */}
            <MobileMenu />
          </div>
        </header>

        <main>{children}</main>

        {/* ── Ultra-Luxury Fintech Footer ────────────────────────────── */}
        <footer className="mt-20 no-print pb-12 px-3 sm:px-6">
          <div className="max-w-6xl mx-auto bg-[#090909] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]">
            
            {/* Subtle red accent glow line at the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#E60A1C]/70 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-24 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />

            {/* Footer grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-white/10">
              
              {/* Col 1: Brand Info (Spans 4 cols on lg) */}
              <div className="lg:col-span-4 space-y-5">
                <div className="flex items-center gap-3">
                  <LogoMark size={36} />
                  <span className="font-display font-black text-xl text-white tracking-tight">
                    Brutto<span className="text-gradient-accent">Netto</span>Calculator<span className="text-[#E60A1C]">.</span>
                  </span>
                </div>
                <p className="leading-relaxed text-white/60 text-sm font-normal pr-4">
                  Der präzise Gehaltsrechner für Deutschland nach § 32a EStG. Berechnen Sie Ihr Nettogehalt in Sekundenschnelle — kostenlos, ohne Registrierung und DSGVO-konform.
                </p>
                <div className="pt-1 flex items-center gap-3 text-xs font-mono text-white/40">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#E60A1C]" />
                  <span>Stand: Juli 2026 · § 32a EStG</span>
                </div>
              </div>

              {/* Col 2: Rechner (Spans 3 cols on lg) */}
              <div className="lg:col-span-3">
                <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white mb-6">
                  RECHNER
                </p>
                <ul className="space-y-3.5 text-sm sm:text-base text-white/60 font-medium">
                  <li><Link href="/"                          className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Brutto Netto Rechner 2026</Link></li>
                  <li><Link href="/brutto-netto-rechner-2027" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Rechner 2027 (Vorschau)</Link></li>
                  <li><Link href="/rechner/brutto-zu-netto"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Brutto zu Netto</Link></li>
                  <li><Link href="/rechner/netto-zu-brutto"   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Netto zu Brutto</Link></li>
                  <li><Link href="/lexikon"                   className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Steuer-Lexikon</Link></li>
                  <li><Link href="/faq"                       className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">FAQ & Hilfe</Link></li>
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

              {/* Col 4: Partner & Newsletter (Spans 3 cols on lg) */}
              <div className="lg:col-span-3 space-y-6">
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

        {/* ── Global JSON-LD ──────────────────────────────────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

        {/* ── Google Analytics 4 (GA4) ────────────────────────────────── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FY0K5KT32H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FY0K5KT32H', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
