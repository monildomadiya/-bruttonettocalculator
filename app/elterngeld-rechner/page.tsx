import type { Metadata } from "next";
import ElterngeldRechner from "./ElterngeldRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Elterngeld-Rechner 2026 — Basiselterngeld & ElterngeldPlus",
  description:
    "Elterngeld-Rechner 2026: Berechnen Sie Ihr Basiselterngeld (65–100 % des Nettoeinkommens) und ElterngeldPlus. Mindestbetrag 300 €, Höchstbetrag 1.800 €. Kostenlos.",
  keywords: [
    "Elterngeld Rechner",
    "Elterngeld Rechner 2026",
    "Elterngeld berechnen",
    "ElterngeldPlus Rechner",
    "Basiselterngeld",
    "wie viel Elterngeld bekomme ich",
    "Elterngeld Höchstbetrag",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/elterngeld-rechner" },
  openGraph: {
    title: "Elterngeld-Rechner 2026 — Basiselterngeld & ElterngeldPlus",
    description: "Basiselterngeld (65–100 % des Nettoeinkommens) und ElterngeldPlus berechnen.",
    url: "https://bruttonettocalculator.com/elterngeld-rechner",
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
      name: "Wie hoch ist das Elterngeld 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Basiselterngeld beträgt 65–100 % des durchschnittlichen Nettoeinkommens der letzten 12 Monate vor der Geburt, mindestens 300 € und höchstens 1.800 € im Monat.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es eine Einkommensgrenze für Elterngeld?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Seit 2024 besteht kein Anspruch mehr, wenn das zu versteuernde Einkommen beider Elternteile 175.000 € übersteigt.",
      },
    },
  ],
};

export default function ElterngeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ElterngeldRechner />
      <AdUnit placement="content" />
    </>
  );
}
