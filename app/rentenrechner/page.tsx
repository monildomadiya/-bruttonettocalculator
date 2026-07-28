import type { Metadata } from "next";
import Rentenrechner from "./Rentenrechner";

export const metadata: Metadata = {
  title: "Rentenrechner 2026 — Brutto Netto Rente berechnen",
  description:
    "Rentenrechner 2026: Berechnen Sie Ihren Rentenversicherungsbeitrag vom Bruttogehalt und schätzen Sie Ihre spätere gesetzliche Rente auf Basis des Entgeltpunkte-Systems. Kostenlos.",
  keywords: [
    "Rentenrechner",
    "Rentenrechner brutto netto",
    "brutto netto rentenrechner",
    "brutto netto rechner rente",
    "gesetzliche Rente berechnen",
    "Rentenversicherungsbeitrag berechnen",
    "Entgeltpunkte Rente",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/rentenrechner" },
  openGraph: {
    title: "Rentenrechner 2026 — Brutto Netto Rente berechnen",
    description: "Rentenversicherungsbeitrag berechnen und gesetzliche Rente auf Basis des Entgeltpunkte-Systems schätzen.",
    url: "https://bruttonettocalculator.com/rentenrechner",
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
      name: "Wie viel zahle ich in die gesetzliche Rentenversicherung ein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Rentenversicherungsbeitrag beträgt 18,6 % Ihres Bruttogehalts, je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen — Sie zahlen also 9,3 % aus Ihrem Bruttogehalt.",
      },
    },
    {
      "@type": "Question",
      name: "Wie wird meine spätere gesetzliche Rente berechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ihre Rente basiert auf Entgeltpunkten: Bruttojahresgehalt geteilt durch das Durchschnittsentgelt aller Versicherten ergibt die jährlichen Entgeltpunkte. Die Summe über das Erwerbsleben mal dem aktuellen Rentenwert ergibt die monatliche Bruttorente.",
      },
    },
  ],
};

export default function RentenrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Rentenrechner />
    </>
  );
}
