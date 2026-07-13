import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, Calculator, BookOpen, HelpCircle, ArrowRight, Shield, Lock, Calendar, Newspaper } from "lucide-react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import AdsProvider from "@/components/AdsProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://bruttonettocalculator.com"),
  title: {
    default: "Brutto Netto Rechner 2026/2027 | Gehaltsrechner Deutschland kostenlos",
    template: "%s | BruttoNettoCalculator.com",
  },
  description:
    "Kostenloser Brutto Netto Rechner 2026/2027 — Nettogehalt sofort berechnen: Lohnsteuer, Soli, alle 6 Steuerklassen, Firmenwagenrechner, Rentenrechner & Mindestlohn 2027. BKK Zusatzbeitrag 2026 bereits eingerechnet. Pfändungstabelle 2026 abrufbar.",
  keywords: [
    "brutto netto rechner",
    "brutto netto rechner 2026",
    "brutto netto rechner 2027",
    "gehaltsrechner 2026",
    "gehaltsrechner deutschland",
    "lohnrechner 2027",
    "netto brutto rechner 2027",
    "brutto zu netto rechner",
    "brutto in netto umrechnen",
    "netto in brutto umrechnen",
    "netto zu brutto rechner",
    "brutto netto rechner nrw",
    "brutto netto rechner rlp",
    "brutto netto rechner hessen",
    "brutto netto rechner spiegel",
    "brutto netto rechner handelsblatt",
    "brutto netto rechner ak",
    "kalkulator brutto netto niemcy",
    "brutto netto rechner luxemburg",
    "steuerklassen",
    "steuerklasse 1",
    "steuerklassenwechsel",
    "pfändungstabelle 2026",
    "bkk zusatzbeitrag 2026",
    "hkk zusatzbeitrag 2026",
    "tk zusatzbeitrag 2026",
    "mindestlohn 2027",
    "kinderfreibetrag",
    "düsseldorfer tabelle",
    "düsseldorfer tabelle 2026",
    "firmenwagenrechner",
    "gehaltsrechner mit auto",
    "brutto netto rechner firmenwagen",
    "brutto netto rechner mit firmenwagen",
    "rentenrechner",
    "rentenrechner brutto netto",
    "brutto netto rentenrechner",
    "brutto netto rechner rente",
    "wohngeldrechner",
    "arbeitslosengeld rechner",
    "minijob rechner",
    "minijob grenze 2026",
    "elterngeld rechner",
    "elterngeld rechner 2026",
    "abfindungsrechner",
    "fünftelregelung rechner",
    "bonus steuerrechner",
    "weihnachtsgeld rechner",
    "urlaubsgeld versteuern",
    "stundenlohn rechner",
    "netto stundenlohn rechner",
    "durchschnittsgehalt deutschland",
    "4200 brutto in netto steuerklasse 1",
    "4000 brutto in netto steuerklasse 1",
    "3800 brutto in netto steuerklasse 1",
    "3600 brutto in netto steuerklasse 1",
    "3200 brutto in netto steuerklasse 1",
    "60000 brutto in netto",
    "4000 brutto in netto",
    "3200 brutto in netto",
    "4500 brutto in netto steuerklasse 1",
    "2800 brutto in netto",
    "2800 brutto in netto steuerklasse 1",
    "brutto netto mwst",
    "was ist brutto was ist netto",
    "was ist brutto und netto",
    "nettogehalt berechnen",
    "lohnsteuer berechnen",
    "einkommensteuer rechner",
    "steuerrechner",
    "netto rechner 2026",
    "lohnrechner deutschland",
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

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Brutto Netto Rechner 2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: "de-DE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Online-Gehaltsrechner: Netto aus Brutto berechnen — § 32a EStG 2026, alle Steuerklassen, Sozialabgaben.",
  url: "https://bruttonettocalculator.com",
  featureList: [
    "Brutto-Netto-Berechnung 2026 & 2027",
    "Alle 6 Steuerklassen",
    "Lohnsteuer, Solidaritätszuschlag & Kirchensteuer",
    "Sozialabgaben inkl. BKK/TK/HKK-Zusatzbeitrag 2026",
    "Firmenwagen-, Renten-, Minijob- & Elterngeldrechner",
    "Mindestlohn 2027 & Pfändungstabelle 2026",
  ],
  publisher: { "@id": ORG_ID },
};

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

        {/* ── Ultra-Luxury Fintech Footer (conditional) ───────────────── */}
        <SiteFooter />

        {/* ── Global JSON-LD ──────────────────────────────────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
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
