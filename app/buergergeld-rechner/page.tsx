import type { Metadata } from "next";
import BuergergeldRechner from "./BuergergeldRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Bürgergeld-Rechner 2026 — Anspruch & Regelsatz 563 € berechnen",
  description:
    "Bürgergeld-Rechner 2026: Berechnen Sie Ihren Anspruch aus Regelsatz (563 €), Kosten für Unterkunft & Heizung und angerechnetem Einkommen inkl. Freibeträgen. Kostenlos für Ihre Bedarfsgemeinschaft.",
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
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/buergergeld-rechner" },
  openGraph: {
    title: "Bürgergeld-Rechner 2026 — Anspruch & Regelsatz berechnen",
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
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie hoch ist der Bürgergeld-Regelsatz 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Regelsatz für eine alleinstehende Person liegt 2026 bei 563 € im Monat (Nullrunde, wie 2025). Für Partner gelten je 506 €, für Kinder je nach Alter 357 €, 390 € oder 471 €. Hinzu kommen die angemessenen Kosten für Unterkunft und Heizung.",
      },
    },
    {
      "@type": "Question",
      name: "Wird Einkommen auf das Bürgergeld angerechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, aber mit Freibeträgen: Die ersten 100 € bleiben komplett frei, von 100–520 € 20 %, von 520–1.000 € 30 % und darüber 10 %. Nur der verbleibende Teil mindert den Bürgergeld-Anspruch.",
      },
    },
  ],
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
  "@type": "WebApplication",
  name: "Bürgergeld-Rechner 2026",
  url: "https://bruttonettocalculator.com/buergergeld-rechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: "Kostenloser Bürgergeld-Rechner 2026 — Anspruch aus Regelsatz, KdU und angerechnetem Einkommen berechnen (SGB II).",
};

export default function BuergergeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BuergergeldRechner />
      <AdUnit placement="content" />
    </>
  );
}
