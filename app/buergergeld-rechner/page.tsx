import type { Metadata } from "next";
import BuergergeldRechner from "./BuergergeldRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { GRUNDSICHERUNGSGELD_FAQS } from "@/lib/grundsicherungsgeld";

export const metadata: Metadata = {
  title: "Bürgergeld-Rechner 2026: jetzt Grundsicherungsgeld berechnen",
  description:
    "Bürgergeld heißt seit 1. Juli 2026 Grundsicherungsgeld. Anspruch berechnen: Regelsatz 563 €, Wohnkosten, Einkommen mit Freibeträgen, neue Vermögensgrenzen nach Alter.",
  keywords: [
    "bürgergeld rechner",
    "bürgergeld-rechner",
    "bürgergeldrechner",
    "bürgergeld 2026",
    "bürgergeld regelsatz 2026",
    "bürgergeld anspruch berechnen",
    "bürgergeld höhe",
    "grundsicherung rechner",
    "sgb ii rechner",
    "grundsicherungsgeld rechner",
    "grundsicherungsgeld 2026",
    "grundsicherungsgeld 2027",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/buergergeld-rechner" },
  openGraph: {
    images: [pageImageUrl("/buergergeld-rechner")],
    title: "Bürgergeld-Rechner 2026: jetzt Grundsicherungsgeld berechnen",
    description:
      "Bürgergeld-Anspruch 2026 berechnen: Regelsatz 563 €, Kosten der Unterkunft und angerechnetes Einkommen inkl. Freibeträgen. Kostenlos & aktuell.",
    url: "https://bruttonettocalculator.com/buergergeld-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GRUNDSICHERUNGSGELD_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Bürgergeld-Rechner", item: "https://bruttonettocalculator.com/buergergeld-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Bürgergeld-Rechner 2026",
  url: "https://bruttonettocalculator.com/buergergeld-rechner",
  description: "Kostenloser Bürgergeld-Rechner 2026 — Anspruch aus Regelsatz, KdU und angerechnetem Einkommen berechnen (SGB II).",
};

export default function BuergergeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BuergergeldRechner />
      <ToolContent config={TOOL_CONTENT["/buergergeld-rechner"]} />
    </>
  );
}
