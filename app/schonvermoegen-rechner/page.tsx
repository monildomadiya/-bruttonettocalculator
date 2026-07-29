import type { Metadata } from "next";
import SchonvermoegenRechner from "./SchonvermoegenRechner";

export const metadata: Metadata = {
  title: "Schonvermögen-Rechner 2026 — Bürgergeld Vermögensfreibetrag",
  description:
    "Schonvermögen-Rechner 2026: anrechnungsfreies Vermögen beim Bürgergeld berechnen — Karenzzeit 40.000 € + 15.000 €/Person und die altersgestaffelte Neuregelung ab 1. Juli 2026. Kostenlos.",
  keywords: [
    "schonvermögen rechner",
    "bürgergeld vermögen 2026",
    "schonvermögen bürgergeld",
    "vermögensfreibetrag bürgergeld",
    "karenzzeit vermögen 40000",
    "bürgergeld freibetrag vermögen",
    "schonvermögen 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/schonvermoegen-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Schonvermögen-Rechner 2026 — Bürgergeld Vermögensfreibetrag",
    description:
      "Anrechnungsfreies Vermögen beim Bürgergeld berechnen — Karenzzeit-Regeln und Neuregelung ab 1. Juli 2026.",
    url: "https://bruttonettocalculator.com/schonvermoegen-rechner",
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
      name: "Wie viel Schonvermögen gilt beim Bürgergeld 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In der Karenzzeit (erstes Bezugsjahr, laufende Fälle) bleiben 40.000 € für die antragstellende Person plus 15.000 € für jede weitere Person der Bedarfsgemeinschaft anrechnungsfrei. Nach der Karenzzeit gelten 15.000 € pro Person.",
      },
    },
    {
      "@type": "Question",
      name: "Was ändert sich beim Schonvermögen ab dem 1. Juli 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mit der neuen Grundsicherung entfällt für Neuanträge ab dem 1. Juli 2026 die Karenzzeit für Geldvermögen. Stattdessen gelten altersgestaffelte Freibeträge je Person: bis 30 Jahre 5.000 €, bis 40 Jahre 10.000 €, bis 50 Jahre 12.500 € und über 50 Jahre 20.000 €.",
      },
    },
    {
      "@type": "Question",
      name: "Zählt das selbstgenutzte Eigenheim zum Vermögen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ein angemessenes selbstgenutztes Haus oder eine Eigentumswohnung sowie ein angemessenes Auto und Vermögen zur Altersvorsorge bleiben grundsätzlich unangetastet und zählen nicht zum verwertbaren Vermögen.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Schonvermögen-Rechner", item: "https://bruttonettocalculator.com/schonvermoegen-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Schonvermögen-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/schonvermoegen-rechner",
  description:
    "Kostenloser Schonvermögen-Rechner — anrechnungsfreies Vermögen beim Bürgergeld nach Karenzzeit-Regeln und Neuregelung ab 1. Juli 2026 berechnen.",
};

export default function SchonvermoegenRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SchonvermoegenRechner />
    </>
  );
}
