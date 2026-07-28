import type { Metadata } from "next";
import ImmobilienkreditRechner from "./ImmobilienkreditRechner";

export const metadata: Metadata = {
  title: "Immobilienkredit-Rechner 2026 — Wie viel Haus kann ich mir leisten?",
  description:
    "Immobilienkredit- & Baufinanzierungsrechner 2026: Wie viel Haus kann ich mir leisten? Aus Nettoeinkommen, Eigenkapital, Zins & Tilgung den möglichen Kaufpreis, das Darlehen und die monatliche Rate berechnen. Kostenlos.",
  keywords: [
    "immobilienkredit rechner",
    "baufinanzierungsrechner",
    "wie viel haus kann ich mir leisten",
    "hauskredit rechner",
    "baufinanzierung rechner 2026",
    "kreditrate immobilie berechnen",
    "wie viel kredit bekomme ich",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/immobilienkredit-rechner" },
  openGraph: {
    title: "Immobilienkredit-Rechner 2026 — Wie viel Haus kann ich mir leisten?",
    description:
      "Aus Nettoeinkommen & Eigenkapital den möglichen Kaufpreis, das Darlehen und die monatliche Rate berechnen. Kostenloser Baufinanzierungsrechner.",
    url: "https://bruttonettocalculator.com/immobilienkredit-rechner",
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
      name: "Wie viel Haus kann ich mir mit meinem Gehalt leisten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Als Faustregel sollte die monatliche Kreditrate höchstens rund 35 % des Haushalts-Nettoeinkommens betragen. Aus Rate, Eigenkapital, Sollzins und anfänglicher Tilgung ergeben sich das maximale Darlehen und der mögliche Kaufpreis.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch sind die Kaufnebenkosten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zum Kaufpreis kommen Grunderwerbsteuer (3,5–6,5 % je Bundesland), Notar und Grundbuch (ca. 1,5–2 %) sowie ggf. Maklercourtage (ca. 3,57 %) — zusammen meist 10–15 % des Kaufpreises.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel Eigenkapital brauche ich für eine Baufinanzierung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Empfohlen werden mindestens die Kaufnebenkosten (rund 10–15 %) plus idealerweise 10–20 % des Kaufpreises. Mehr Eigenkapital senkt Darlehen, Zins und Rate.",
      },
    },
    {
      "@type": "Question",
      name: "Was bedeutet anfängliche Tilgung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die anfängliche Tilgung ist der Anteil des Darlehens, den Sie im ersten Jahr zusätzlich zu den Zinsen zurückzahlen. Empfohlen werden mindestens 2 %, besser 3 % — je höher, desto schneller sind Sie schuldenfrei.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Immobilienkredit-Rechner", item: "https://bruttonettocalculator.com/immobilienkredit-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Immobilienkredit-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/immobilienkredit-rechner",
  description:
    "Kostenloser Immobilienkredit- und Baufinanzierungsrechner — möglichen Kaufpreis, Darlehen und Monatsrate aus Nettoeinkommen und Eigenkapital berechnen (2026).",
};

export default function ImmobilienkreditRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ImmobilienkreditRechner />
    </>
  );
}
