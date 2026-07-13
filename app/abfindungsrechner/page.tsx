import type { Metadata } from "next";
import AbfindungsRechner from "./AbfindungsRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Abfindungsrechner 2026 — Fünftelregelung berechnen",
  description:
    "Abfindungsrechner 2026: Steuerlast auf Ihre Abfindung nach der Fünftelregelung (§ 34 EStG) berechnen. Sozialversicherungsfrei — nur Lohnsteuer, Soli & Kirchensteuer. Kostenlos.",
  keywords: [
    "Abfindungsrechner",
    "Abfindungsrechner 2026",
    "Abfindung Steuer berechnen",
    "Fünftelregelung Rechner",
    "Fünftelregelung Abfindung",
    "Abfindung versteuern",
    "Abfindung netto",
    "§ 34 EStG Abfindung",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/abfindungsrechner" },
  openGraph: {
    title: "Abfindungsrechner 2026 — Fünftelregelung berechnen",
    description: "Steuerlast auf Ihre Abfindung nach der Fünftelregelung (§ 34 EStG) berechnen — sozialversicherungsfrei.",
    url: "https://bruttonettocalculator.com/abfindungsrechner",
    locale: "de_DE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie wird eine Abfindung versteuert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Abfindungen werden nach der Fünftelregelung (§ 34 Abs. 1 EStG) versteuert: Ein Fünftel der Abfindung wird fiktiv zum zu versteuernden Einkommen addiert, die Steuerdifferenz wird mit 5 multipliziert.",
      },
    },
    {
      "@type": "Question",
      name: "Muss ich auf die Abfindung Sozialversicherungsbeiträge zahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nein, Abfindungen sind sozialversicherungsfrei. Es fällt lediglich Lohnsteuer zzgl. Solidaritätszuschlag und ggf. Kirchensteuer an.",
      },
    },
  ],
};

export default function AbfindungsrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AbfindungsRechner />
      <AdUnit placement="content" />
    </>
  );
}
