import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Calculator, BookOpen, HelpCircle, ArrowRight, Shield, Lock, Calendar, Newspaper } from "lucide-react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RelatedToolsAuto from "@/components/RelatedToolsAuto";
import SupportStory from "@/components/SupportStory";
import StoriesBar from "@/components/StoriesBar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import SiteWideAd from "@/components/SiteWideAd";
import ConsentMode from "@/components/ConsentMode";
import AdGuard from "@/components/AdGuard";
import { AD_CLIENT } from "@/lib/adsConfig";
import { postalAddressSchema } from "@/lib/company";
import { fontVariables } from "@/lib/fonts";

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
    // `creator`/`site` verwiesen auf @bruttonetto_de — ein Konto, das es nicht
    // gibt. Ein twitter:site-Tag auf ein totes Handle bringt keine Attribution,
    // sondern nur eine widerlegbare Angabe. Wieder eintragen, sobald ein echtes
    // Profil existiert.
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
    "google-adsense-account": AD_CLIENT,
  },
};

/**
 * Every page re-renders at most hourly so the story tray (<StoriesBar>) picks up
 * new and expired stories. Uploads and deletions in /admin/stories refresh all
 * pages immediately via revalidatePath, so this is only the expiry fallback.
 * Must be a literal — Next reads segment config statically.
 */
export const revalidate = 3600;

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
  email: "info@bruttonettocalculator.com",
  // Nur gesetzt, wenn in lib/company.ts echte Anbieterdaten hinterlegt sind.
  ...(postalAddressSchema() ? { address: postalAddressSchema() } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "info@bruttonettocalculator.com",
    url: "https://bruttonettocalculator.com/kontakt",
    availableLanguage: ["de", "en", "pl"],
  },
  // Von Google für redaktionelle Angebote ausdrücklich ausgewertete Signale:
  // Wer steht dahinter, nach welchen Regeln wird publiziert, wie meldet man
  // Fehler. Alle drei zeigen auf echte, existierende Seiten.
  publishingPrinciples: "https://bruttonettocalculator.com/ueber-uns",
  ownershipFundingInfo: "https://bruttonettocalculator.com/impressum",
  actionableFeedbackPolicy: "https://bruttonettocalculator.com/kontakt",
  // `sameAs` verweist auf Profile, die dieselbe Entität belegen. Der Eintrag
  // enthielt bis 08/2026 https://twitter.com/bruttonetto_de — ein Konto, das
  // es nicht gibt (404). Google ruft sameAs-Ziele ab; ein toter Link ist damit
  // keine Bestätigung, sondern eine widerlegbare Behauptung — dieselbe Klasse
  // Fehler wie der frühere erfundene Prüfer und die erfundene aggregateRating.
  // Wieder aufnehmen, sobald echte Profile existieren, dann aber nur solche,
  // die die Domain im Profiltext verlinken (sonst fehlt die Gegenbestätigung).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* `suppressHydrationWarning` because <AdGuard> stamps `data-ads-off` on this
       element before React hydrates — the standard pattern for a pre-hydration
       inline script that has to mark the document root. Scoped to <html>'s own
       attributes; it does not silence anything in the subtree. */
    <html lang="de" className={fontVariables} suppressHydrationWarning>
      <body className="font-body bg-[#F4F5F7] text-[#16181D] antialiased">
        {/*
          ── Ad serving: first thing in <body> ───────────────────────────────

          The AdSense loader starts while the browser is still parsing the
          document (~0.1 s). It used to be injected by a client component that
          first hydrated, then fetched /api/settings/ads, which hit MySQL. On
          production that pushed the ad script to ~3.0 s and the Funding-Choices
          consent prompt to ~3.8 s on desktop — far worse on mobile — so short
          calculator sessions regularly ended before a single ad, or the consent
          prompt, was ever requested.

          Deliberately not next/script: `beforeInteractive` renders into <html>,
          which is invalid markup for a script and made React throw away the
          server HTML and re-render the whole document on hydration.

          Two things changed here on 2026-09-11, after AdSense placed an ad
          serving limit on the account for invalid traffic:

          1. The loader is no longer a static tag. React hoists <script async
             src> into <head>, which put it *ahead* of any inline guard in
             <body> — so admin pages and the publisher's own test loads were
             requesting ads before anything could stop them. <AdGuard> now owns
             the decision and injects the script itself.

          2. `data-ad-frequency-hint` is set from `AD_FREQUENCY_HINT` rather than
             hard-coded here. It used to read "30s" — which, contrary to the
             comment that accompanied it, is not "denser than default" but the
             densest value the attribute accepts: Google's default is 120s and
             30s is the floor. Combined with four manual units per page, that is
             what took the site from "under-monetised" to an ad serving limit in
             about a week. Recovery mode now sends 240s. See lib/adsConfig.ts for
             what this attribute can and cannot control — most of Auto Ads
             placement is an AdSense UI setting, not a page attribute.
        */}
        {/* Consent Mode v2 defaults — must precede every Google tag. */}
        <ConsentMode />

        {/* Warms DNS + TLS to the ad host so the guard-injected loader starts
            almost as fast as a static tag would have. React hoists this into
            <head>; a preconnect costs nothing on pages that never load ads. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        {/* The AdSense loader is injected by <AdGuard>, not written here.
            A static <script async src> is hoisted into <head> by React and would
            therefore run *before* any inline guard in <body> — see AdGuard for
            the measurement. Pages that may not serve ads now make no request to
            Google at all. */}
        <AdGuard />

        {/* ── Sticky glass header (conditional) ───────────────────────── */}
        <SiteHeader />

        {/* ── Instagram-style story rings (renders nothing without stories) ── */}
        <StoriesBar />

        <main>{children}</main>

        {/* ── End-of-content ad (site-wide, one guaranteed slot per page) ─ */}
        <SiteWideAd />

        {/* ── Auto "Ähnliche Rechner" internal-linking block (per-page) ── */}
        <RelatedToolsAuto />

        {/* ── "Support this site" closing section (honest, no persona) ── */}
        <SupportStory />

        {/* ── End-of-session unit, below the related tools ──────────────
             Currently renders nothing: `afterRelated` is suppressed while
             AD_DENSITY is "recovery" (see lib/adsConfig.ts). Left wired up so
             restoring it is a one-line change in one file. */}
        <SiteWideAd slot="afterRelated" />

        {/* ── Ultra-Luxury Fintech Footer (conditional) ───────────────── */}
        <SiteFooter />

        {/* ── Global JSON-LD (WebSite + Organization only) ────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

        {/* ── Google Analytics 4 (GA4) ────────────────────────────────── */}
        <GoogleAnalytics />

        {/* ── Google AdSense ──────────────────────────────────────────── */}
        <GoogleAdSense />
      </body>
    </html>
  );
}
