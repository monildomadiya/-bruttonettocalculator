import type { Metadata } from "next";
import EinkommensteuerRechner from "./EinkommensteuerRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Einkommensteuer-Rechner 2026 — Steuer nach § 32a EStG berechnen",
  description:
    "Einkommensteuer-Rechner 2026: Einkommensteuer, Soli & Kirchensteuer aus dem zu versteuernden Einkommen berechnen. Kostenloser Steuerrechner mit Grund- & Splittingtarif, Grenz- und Durchschnittssteuersatz.",
  keywords: [
    "einkommensteuer rechner",
    "einkommensteuer berechnen",
    "steuerrechner",
    "steuerrechner 2026",
    "steuerrechner 2025",
    "steuer rechner",
    "einkommensteuer 2026",
    "einkommensteuertarif 2026",
    "grenzsteuersatz berechnen",
    "splittingtarif rechner",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/einkommensteuer-rechner" },
  openGraph: {
    title: "Einkommensteuer-Rechner 2026 — Steuer nach § 32a EStG",
    description:
      "Einkommensteuer, Soli & Kirchensteuer berechnen — Grund- & Splittingtarif, Grenz- und Durchschnittssteuersatz. Kostenloser Steuerrechner 2026.",
    url: "https://bruttonettocalculator.com/einkommensteuer-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie wird die Einkommensteuer 2026 berechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Einkommensteuer wird auf das zu versteuernde Einkommen nach dem Tarif § 32a EStG angewendet. Bis 12.348 € (Grundfreibetrag 2026) fällt keine Steuer an, danach steigt der Satz progressiv von 14 % bis zum Spitzensteuersatz 42 % (ab 69.879 €) und 45 % Reichensteuer (ab 277.826 €).",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Grund- und Splittingtarif?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Grundtarif gilt für Ledige (Einzelveranlagung). Beim Splittingtarif für Ehepaare wird das gemeinsame zvE halbiert, die Steuer berechnet und verdoppelt — das senkt die Steuerlast bei ungleichen Einkommen.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Einkommensteuer-Rechner", item: "https://bruttonettocalculator.com/einkommensteuer-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Einkommensteuer-Rechner 2026",
  url: "https://bruttonettocalculator.com/einkommensteuer-rechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  description: "Kostenloser Einkommensteuer-Rechner nach § 32a EStG 2026 — mit Grund- und Splittingtarif, Soli und Kirchensteuer.",
};

export default function EinkommensteuerRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EinkommensteuerRechner />
      <AdUnit placement="content" />
    </>
  );
}
