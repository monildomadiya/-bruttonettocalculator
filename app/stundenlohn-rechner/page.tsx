import type { Metadata } from "next";
import StundenlohnRechner from "./StundenlohnRechner";

export const metadata: Metadata = {
  title: "Stundenlohn-Rechner 2026 — Netto-Stundenlohn berechnen",
  description:
    "Stundenlohn-Rechner 2026: Stundenlohn in Monatsgehalt umrechnen und Netto-Stundenlohn nach Steuern & Sozialabgaben berechnen. Alle Steuerklassen, kostenlos.",
  keywords: [
    "Stundenlohn Rechner",
    "Netto Stundenlohn Rechner",
    "Stundenlohn in Monatslohn umrechnen",
    "Stundenlohn berechnen",
    "Brutto Stundenlohn",
    "Netto Stundenlohn 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/stundenlohn-rechner" },
  openGraph: {
    title: "Stundenlohn-Rechner 2026 — Netto-Stundenlohn berechnen",
    description: "Stundenlohn in Monatsgehalt umrechnen und Netto-Stundenlohn berechnen.",
    url: "https://bruttonettocalculator.com/stundenlohn-rechner",
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
      name: "Wie rechne ich Stundenlohn in Monatsgehalt um?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Monatsbrutto = Stundenlohn × Wochenstunden × 52 ÷ 12. Bei einer 40-Stunden-Woche entspricht das rund 173,33 Stunden pro Monat.",
      },
    },
  ],
};

export default function StundenlohnRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StundenlohnRechner />
    </>
  );
}
