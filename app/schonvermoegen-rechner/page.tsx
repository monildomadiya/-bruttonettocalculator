import type { Metadata } from "next";
import SchonvermoegenRechner from "./SchonvermoegenRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";

export const metadata: Metadata = {
  title: "Schonvermögen-Rechner 2026: Grundsicherungsgeld & Bürgergeld",
  description:
    "Schonvermögen seit 1. Juli 2026: 5.000 bis 20.000 € je Person nach Alter (§ 12 SGB II). Rechner für Grundsicherungsgeld (früher Bürgergeld), auch mit alter Karenzzeit-Regel.",
  keywords: [
    "schonvermögen rechner",
    "bürgergeld vermögen 2026",
    "schonvermögen bürgergeld",
    "vermögensfreibetrag bürgergeld",
    "karenzzeit vermögen 40000",
    "grundsicherungsgeld vermögen",
    "schonvermögen grundsicherung 2026",
    "bürgergeld freibetrag vermögen",
    "schonvermögen 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/schonvermoegen-rechner" },
  openGraph: {
    images: [pageImageUrl("/schonvermoegen-rechner")],
    title: "Schonvermögen-Rechner 2026: Grundsicherungsgeld & Bürgergeld",
    description:
      "Anrechnungsfreies Vermögen beim Grundsicherungsgeld berechnen — altersgestaffelt seit 1. Juli 2026.",
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
      name: "Wie viel Schonvermögen gilt beim Grundsicherungsgeld (früher Bürgergeld)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Seit dem 1. Juli 2026 hängt es vom Alter ab: Je Person bleiben 5.000 € anrechnungsfrei, ab dem 30. Geburtstag 10.000 €, ab dem 40. Geburtstag 12.500 € und ab dem 50. Geburtstag 20.000 € (§ 12 SGB II). Die alte Karenzzeit mit 40.000 € für die antragstellende Person und 15.000 € je weiterer Person gilt nur noch in Bewilligungszeiträumen, die vor dem 1. Juli 2026 begonnen haben.",
      },
    },
    {
      "@type": "Question",
      name: "Was ändert sich beim Schonvermögen ab dem 1. Juli 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mit der neuen Grundsicherung entfällt für Neuanträge ab dem 1. Juli 2026 die Karenzzeit für Geldvermögen. Stattdessen gelten altersgestaffelte Freibeträge je Person: unter 30 Jahren 5.000 €, ab 30 Jahren 10.000 €, ab 40 Jahren 12.500 € und ab 50 Jahren 20.000 € (§ 12 SGB II).",
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
      <ToolContent config={TOOL_CONTENT["/schonvermoegen-rechner"]} />
    </>
  );
}
