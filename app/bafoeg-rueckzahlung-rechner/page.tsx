import type { Metadata } from "next";
import BafoegRueckzahlungRechner from "./BafoegRueckzahlungRechner";

export const metadata: Metadata = {
  title: "BAföG-Rückzahlung-Rechner 2026 — Raten & Dauer berechnen",
  description:
    "BAföG-Rückzahlung-Rechner 2026: Raten, monatliche Rate (130 €) und Dauer berechnen. Höchstbetrag 10.010 €, Nachlass bei vorzeitiger Rückzahlung.",
  keywords: [
    "bafög rückzahlung rechner",
    "bafög zurückzahlen",
    "bafög rückzahlung 2026",
    "bafög raten berechnen",
    "bafög 10010 euro",
    "bafög nachlass",
    "bafög darlehen rückzahlung",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bafoeg-rueckzahlung-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "BAföG-Rückzahlung-Rechner 2026 — Raten & Dauer berechnen",
    description:
      "Anzahl der Raten, monatliche Rate und Rückzahlungsdauer für Ihr BAföG-Darlehen berechnen. Höchstbetrag 10.010 €.",
    url: "https://bruttonettocalculator.com/bafoeg-rueckzahlung-rechner",
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
      name: "Wie viel BAföG muss ich zurückzahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Studierende erhalten ihr BAföG zur Hälfte als Zuschuss und zur Hälfte als zinsloses Staatsdarlehen. Wer erstmals ab August 2019 gefördert wurde, zahlt maximal 77 Raten zu je 130 € zurück — also höchstens 10.010 €. Alles darüber wird erlassen.",
      },
    },
    {
      "@type": "Question",
      name: "Wann beginnt die BAföG-Rückzahlung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Rückzahlung startet 5 Jahre nach dem Ende der Förderungshöchstdauer. Das Bundesverwaltungsamt schickt rechtzeitig einen Rückzahlungsbescheid. Gezahlt wird vierteljährlich (3 × 130 € = 390 € pro Quartal).",
      },
    },
    {
      "@type": "Question",
      name: "Lohnt sich die vorzeitige BAföG-Rückzahlung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, bei einer Ablösung auf einen Schlag gewährt das Bundesverwaltungsamt einen Nachlass. Bei der Höchstschuld von 10.010 € werden bei sofortiger Volltilgung 21,5 % erlassen — man zahlt dann nur 7.857,85 €. Der genaue Nachlass hängt vom Ablösebetrag ab (§ 18b BAföG).",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "BAföG-Rückzahlung-Rechner", item: "https://bruttonettocalculator.com/bafoeg-rueckzahlung-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "BAföG-Rückzahlung-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/bafoeg-rueckzahlung-rechner",
  description:
    "Kostenloser BAföG-Rückzahlung-Rechner — Anzahl der Raten, monatliche Rate und Rückzahlungsdauer für das BAföG-Darlehen berechnen (Höchstbetrag 10.010 €).",
};

export default function BafoegRueckzahlungRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BafoegRueckzahlungRechner />
    </>
  );
}
