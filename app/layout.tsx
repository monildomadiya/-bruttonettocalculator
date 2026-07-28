import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, Calculator, BookOpen, HelpCircle, ArrowRight, Shield, Lock, Calendar, Newspaper } from "lucide-react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RelatedToolsAuto from "@/components/RelatedToolsAuto";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import AdsProvider from "@/components/AdsProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://bruttonettocalculator.com"),
  title: {
    default: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner kostenlos",
    // No forced brand suffix: the domain "BruttoNettoCalculator.com" is 25 chars
    // and pushed every rendered <title> past Google's ~60-char limit, cutting off
    // the tail keywords. Each page now owns its full, self-contained title.
    template: "%s",
  },
  description:
    "Kostenloser Brutto Netto Rechner 2026/2027 — Nettogehalt sofort berechnen: Lohnsteuer, Soli, alle 6 Steuerklassen, Firmenwagenrechner, Rentenrechner & Mindestlohn 2027. BKK Zusatzbeitrag 2026 bereits eingerechnet. Pfändungstabelle 2026 abrufbar.",
  // Google has ignored the meta keywords tag since 2009; kept to a short,
  // honest handful only (no keyword stuffing). Ranking comes from on-page
  // content, not this tag.
  keywords: [
    "brutto netto rechner",
    "brutto netto rechner 2026",
    "gehaltsrechner",
    "netto brutto rechner",
    "steuerklassen",
    "lohnsteuer berechnen",
    "nettogehalt berechnen",
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
    title: "Brutto Netto Rechner 2026/2027 | Gehaltsrechner Deutschland kostenlos",
    description:
      "Nettogehalt sofort berechnen — Lohnsteuer, Soli, alle 6 Steuerklassen, BKK/TK Zusatzbeitrag 2026, Mindestlohn 2027, Firmenwagenrechner & Pfändungstabelle 2026.",
    url: "https://bruttonettocalculator.com",
    siteName: "BruttoNettoCalculator.com",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "https://bruttonettocalculator.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brutto Netto Rechner 2026/2027 — Gehaltsrechner Deutschland kostenlos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutto Netto Rechner 2026/2027 — kostenlos & aktuell",
    description:
      "Nettogehalt berechnen — Lohnsteuer, Soli, alle Steuerklassen, Mindestlohn 2027, BKK Zusatzbeitrag 2026, Firmenwagenrechner & Düsseldorfer Tabelle.",
    creator: "@bruttonetto_de",
    site: "@bruttonetto_de",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
  alternates: {
    canonical: "https://bruttonettocalculator.com",
    languages: { "de-DE": "https://bruttonettocalculator.com" },
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=7", type: "image/png" },
      { url: "/favicon.ico?v=7", type: "image/x-icon" },
    ],
    shortcut: ["/favicon.png?v=7"],
    apple: [
      { url: "/favicon.png?v=7", type: "image/png" },
    ],
  },
  other: {
    "geo.region": "DE",
    "geo.placename": "Deutschland",
    "DC.language": "de",
    "google-adsense-account": "ca-pub-5005860402493815",
  },
};

/* ── Structured data ──────────────────────────────────────────────── */
const ORG_ID = "https://bruttonettocalculator.com/#organization";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://bruttonettocalculator.com/#website",
  name: "BruttoNettoCalculator.com",
  url: "https://bruttonettocalculator.com",
  description: "Kostenloser Brutto-Netto-Rechner für Deutschland",
  inLanguage: "de-DE",
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bruttonettocalculator.com/?brutto={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// NOTE: A global SoftwareApplication schema with a hard-coded aggregateRating
// (4.8 / 1250) used to live here. It was removed because (a) the site has no
// genuine, visible user reviews — the rating was fabricated — and (b) the
// `browserRequirements` value plus the site-wide duplication triggered dozens of
// structured-data errors in Semrush. The site-wide graph is now limited to the
// legitimate WebSite + Organization entities below; individual pages emit their
// own WebPage / Article / FAQPage / BreadcrumbList schema.

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "BruttoNettoCalculator.com",
  url: "https://bruttonettocalculator.com",
  description:
    "Kostenloser Online-Gehaltsrechner für Deutschland — Brutto-Netto, Steuerklassen und Sozialabgaben nach § 32a EStG.",
  logo: {
    "@type": "ImageObject",
    url: "https://bruttonettocalculator.com/BRUTTO-NETTO-LOGO.svg",
    caption: "BruttoNettoCalculator.com Logo",
  },
  image: "https://bruttonettocalculator.com/og-image.png",
  areaServed: { "@type": "Country", name: "Deutschland" },
  knowsAbout: [
    "Brutto-Netto-Berechnung",
    "Lohnsteuer",
    "Einkommensteuer § 32a EStG",
    "Steuerklassen",
    "Sozialversicherung Deutschland",
    "Mindestlohn",
    "Pfändungstabelle",
  ],
  sameAs: ["https://twitter.com/bruttonetto_de"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-body bg-[#F4F5F7] text-[#16181D] antialiased">
       <AdsProvider>

        {/* ── Sticky glass header (conditional) ───────────────────────── */}
        <SiteHeader />

        <main>{children}</main>

        {/* ── Auto "Ähnliche Rechner" internal-linking block (per-page) ── */}
        <RelatedToolsAuto />

        {/* ── Ultra-Luxury Fintech Footer (conditional) ───────────────── */}
        <SiteFooter />

        {/* ── Global JSON-LD (WebSite + Organization only) ────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

        {/* ── Google Analytics 4 (GA4) ────────────────────────────────── */}
        <GoogleAnalytics />

        {/* ── Google AdSense ──────────────────────────────────────────── */}
        <GoogleAdSense />
       </AdsProvider>
      </body>
    </html>
  );
}
