import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, Calculator, BookOpen, HelpCircle, ArrowRight, Shield, Lock, Calendar, Newspaper } from "lucide-react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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
  { href: "/blog",                      label: "Blog",          icon: Newspaper },
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

        {/* ── Sticky glass header (conditional) ───────────────────────── */}
        <SiteHeader />

        <main>{children}</main>

        {/* ── Ultra-Luxury Fintech Footer (conditional) ───────────────── */}
        <SiteFooter />

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
