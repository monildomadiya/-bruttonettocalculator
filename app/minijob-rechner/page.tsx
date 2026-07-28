import type { Metadata } from "next";
import MinijobRechner from "./MinijobRechner";

export const metadata: Metadata = {
  title: "Minijob-Rechner 2026 — Verdienstgrenze 603 € berechnen",
  description:
    "Minijob-Rechner 2026: Verdienstgrenze 603 € pro Monat, Rentenversicherungs-Eigenanteil 3,6 % und Netto-Verdienst berechnen. Kostenlos & aktuell für 2026/2027.",
  keywords: [
    "Minijob Rechner",
    "Minijob Rechner 2026",
    "Minijob Grenze 2026",
    "Minijob 603 Euro",
    "geringfügige Beschäftigung Rechner",
    "Minijob Rentenversicherung",
    "Minijob netto",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/minijob-rechner" },
  openGraph: {
    title: "Minijob-Rechner 2026 — Verdienstgrenze 603 € berechnen",
    description: "Verdienstgrenze 603 €, Rentenversicherungs-Eigenanteil und Netto-Verdienst im Minijob berechnen.",
    url: "https://bruttonettocalculator.com/minijob-rechner",
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
      name: "Wie hoch ist die Minijob-Grenze 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Minijob-Grenze liegt seit dem 1. Januar 2026 bei 603 € monatlich und steigt zum 1. Januar 2027 auf 633 €.",
      },
    },
    {
      "@type": "Question",
      name: "Muss ich als Minijobber Rentenversicherungsbeiträge zahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minijobber sind grundsätzlich rentenversicherungspflichtig und zahlen einen Eigenanteil von 3,6 % ihres Verdienstes, können sich aber davon befreien lassen.",
      },
    },
  ],
};

export default function MinijobRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MinijobRechner />
    </>
  );
}
