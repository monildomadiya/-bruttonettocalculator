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

const trustItems = [
  { label: "Amtliche Formel § 32a EStG",      icon: Shield },
  { label: "SV-Rechengrößen 2026 (amtlich)",  icon: CheckCircle2 },
  { label: "Alle 6 Steuerklassen",            icon: CheckCircle2 },
  { label: "Keine Registrierung",             icon: Lock },
  { label: "DSGVO-konform",                   icon: Shield },
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
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="BruttoNettoCalculator Startseite">
              <LogoMark size={34} />
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Brutto<span className="text-gradient-accent">Netto</span>
                <span className="hidden sm:inline">Calculator</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Hauptnavigation">
              {nav.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="nav-link flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-white/85 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon size={16} className="text-[#E60A1C]" />
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/rechner/brutto-zu-netto"
                className="ml-4 flex items-center gap-2 text-base font-bold px-6 py-2.5 rounded-full text-white no-print transition-all hover:opacity-90 shadow-lg"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 15px rgba(230,10,28,0.40)" }}
              >
                Berechnen <ArrowRight size={16} />
              </Link>
            </nav>

            {/* Mobile menu */}
            <MobileMenu />
          </div>
        </header>

        <main>{children}</main>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="mt-24 no-print bg-black text-white">

          {/* Trust bar */}
          <div className="border-b border-white/10">
            <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm text-white/70 font-mono font-medium">
              {trustItems.map(({ label, icon: Icon }) => (
                <span key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-accent flex-shrink-0" style={{ color: "#E60A1C" }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Footer grid */}
          <div className="max-w-6xl mx-auto px-5 py-14 grid sm:grid-cols-4 gap-10 text-base text-white/75">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LogoMark size={32} />
                <p className="font-display text-white font-bold text-lg">BruttoNettoCalculator.com</p>
              </div>
              <p className="leading-relaxed text-white/60 text-sm font-normal">
                Kostenloser Gehaltsrechner für Deutschland nach § 32a EStG. Alle Angaben ohne Gewähr — keine Steuerberatung.
              </p>
              <p className="mt-4 text-sm text-white/40 font-mono">Stand: Juli 2026</p>
            </div>

            <div>
              <p className="font-bold text-white mb-4 text-lg">Rechner</p>
              <ul className="space-y-3 text-base text-white/70">
                <li><Link href="/"                          className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Brutto Netto Rechner 2026</Link></li>
                <li><Link href="/brutto-netto-rechner-2027" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Rechner 2027 (Vorschau)</Link></li>
                <li><Link href="/rechner/brutto-zu-netto"   className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Brutto zu Netto</Link></li>
                <li><Link href="/rechner/netto-zu-brutto"   className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Netto zu Brutto</Link></li>
                <li><Link href="/lexikon"                   className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Steuer-Lexikon</Link></li>
                <li><Link href="/faq"                       className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />FAQ</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-4 text-lg">Rechtliches</p>
              <ul className="space-y-3 text-base text-white/70">
                <li><Link href="/impressum"   className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Datenschutz</Link></li>
                <li><Link href="/kontakt"     className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Kontakt</Link></li>
                <li><Link href="/ueber-uns"   className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-[#E60A1C]" />Über uns</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-4 text-lg">Partner & KI-Tools</p>
              <ul className="space-y-3 text-base text-white/70">
                <li>
                  <a href="https://promptking.in" target="_blank" rel="noopener" className="hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight size={14} className="text-[#E60A1C]" />PromptKing (KI Prompts)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 py-6 text-center text-sm text-white/50 font-medium">
            © {new Date().getFullYear()} BruttoNettoCalculator.com · Alle Angaben ohne Gewähr
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
