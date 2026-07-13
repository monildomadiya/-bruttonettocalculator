import type { Metadata } from "next";
import BonusSteuerrechner from "./BonusSteuerrechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Bonus-Steuerrechner 2026 — Weihnachtsgeld & Urlaubsgeld versteuern",
  description:
    "Bonus-Steuerrechner 2026: Berechnen Sie, wie viel von Ihrem Weihnachtsgeld, Urlaubsgeld oder Bonus nach Steuern und Sozialabgaben netto übrig bleibt. Kostenlos & sofort.",
  keywords: [
    "Bonus Steuerrechner",
    "Weihnachtsgeld Rechner",
    "Weihnachtsgeld versteuern",
    "Urlaubsgeld Rechner",
    "Urlaubsgeld versteuern",
    "Weihnachtsgeld netto",
    "Sonderzahlung versteuern",
    "13. Monatsgehalt Steuer",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bonus-steuerrechner" },
  openGraph: {
    title: "Bonus-Steuerrechner 2026 — Weihnachtsgeld & Urlaubsgeld versteuern",
    description: "Berechnen Sie, wie viel von Ihrem Weihnachtsgeld, Urlaubsgeld oder Bonus netto übrig bleibt.",
    url: "https://bruttonettocalculator.com/bonus-steuerrechner",
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
      name: "Wie wird Weihnachtsgeld oder Urlaubsgeld versteuert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Weihnachtsgeld und Urlaubsgeld zählen als sonstige Bezüge und werden dem Jahresgehalt hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert.",
      },
    },
    {
      "@type": "Question",
      name: "Fallen auf Weihnachtsgeld auch Sozialabgaben an?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, Weihnachts- und Urlaubsgeld sind normal sozialversicherungspflichtig, sofern die jeweilige Beitragsbemessungsgrenze noch nicht erreicht ist.",
      },
    },
  ],
};

export default function BonusSteuerrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BonusSteuerrechner />
      <AdUnit placement="content" />
    </>
  );
}
