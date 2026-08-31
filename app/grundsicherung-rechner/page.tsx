import type { Metadata } from "next";
import GrundsicherungRechner from "./GrundsicherungRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

export const metadata: Metadata = {
  title: "Grundsicherung-Rechner 2026 — Anspruch im Alter berechnen",
  description:
    "Grundsicherung-Rechner 2026: Anspruch im Alter & bei Erwerbsminderung berechnen — Regelbedarf 563 €, plus Unterkunftskosten, minus Einkommen.",
  keywords: [
    "grundsicherung rechner",
    "grundsicherung im alter berechnen",
    "grundsicherung 2026",
    "regelbedarf 2026",
    "grundsicherung anspruch",
    "sozialhilfe rechner",
    "grundsicherung erwerbsminderung",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/grundsicherung-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Grundsicherung-Rechner 2026 — Anspruch im Alter berechnen",
    description:
      "Möglichen Anspruch auf Grundsicherung im Alter & bei Erwerbsminderung berechnen — Regelbedarf 563 €, Unterkunft, minus Einkommen.",
    url: "https://bruttonettocalculator.com/grundsicherung-rechner",
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
      name: "Wie hoch ist die Grundsicherung 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Regelbedarf für Alleinstehende (Regelbedarfsstufe 1) liegt 2026 bei 563 € im Monat — unverändert gegenüber 2025 wegen der gesetzlichen Nullrunde. Für Paare gelten je Partner 506 € (Stufe 2). Hinzu kommen die angemessenen Kosten für Unterkunft und Heizung.",
      },
    },
    {
      "@type": "Question",
      name: "Wie wird mein Einkommen auf die Grundsicherung angerechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eigenes Einkommen — etwa eine gesetzliche Rente — wird grundsätzlich auf den Bedarf angerechnet und mindert den Anspruch. Für bestimmte Einkünfte gibt es Freibeträge. Der mögliche Anspruch ist der Gesamtbedarf (Regelbedarf plus Unterkunft) abzüglich des anrechenbaren Einkommens.",
      },
    },
    {
      "@type": "Question",
      name: "Wer hat Anspruch auf Grundsicherung im Alter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anspruch haben Personen ab der Regelaltersgrenze sowie dauerhaft voll Erwerbsgeminderte ab 18 Jahren, deren Einkommen und Vermögen nicht zur Deckung des Lebensunterhalts ausreichen. Erwerbsfähige Personen erhalten stattdessen Bürgergeld.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Grundsicherung-Rechner", item: "https://bruttonettocalculator.com/grundsicherung-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Grundsicherung-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/grundsicherung-rechner",
  description:
    "Kostenloser Grundsicherung-Rechner — möglichen Anspruch auf Grundsicherung im Alter und bei Erwerbsminderung 2026 berechnen.",
};

export default function GrundsicherungRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GrundsicherungRechner />
      <ToolContent config={TOOL_CONTENT["/grundsicherung-rechner"]} />
    </>
  );
}
