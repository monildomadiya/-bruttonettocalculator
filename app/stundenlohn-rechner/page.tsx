import type { Metadata } from "next";
import StundenlohnRechner from "./StundenlohnRechner";
import StundenlohnContent from "./StundenlohnContent";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Stundenlohn berechnen: Stundenlohn-Rechner 2026",
  description:
    "Stundenlohn berechnen — in beide Richtungen: Stundenlohn in Monatsgehalt umrechnen oder Stundengehalt aus dem Gehalt ermitteln. Inkl. Netto-Stundenlohn 2026.",
  keywords: [
    "Stundenlohn berechnen",
    "Stundenlohn Rechner",
    "Stundengehalt berechnen",
    "Stundenlohn brutto netto rechner",
    "Netto Stundenlohn Rechner",
    "Stundenlohn in Monatslohn umrechnen",
    "Monatslohn in Stundenlohn umrechnen",
    "Stundenlohn aus Gehalt berechnen",
    "Gehalt pro Stunde berechnen",
    "Bruttolohn aus Stundenlohn berechnen",
    "Lohnrechner Stundenlohn",
    "Brutto Stundenlohn",
    "Netto Stundenlohn 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/stundenlohn-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Stundenlohn berechnen — Stundenlohn-Rechner 2026",
    description: "Stundenlohn in Monatsgehalt umrechnen oder Stundengehalt aus dem Gehalt berechnen — inkl. Netto pro Stunde.",
    url: "https://bruttonettocalculator.com/stundenlohn-rechner",
    locale: "de_DE",
    type: "website",
  },
};

/** Muss inhaltlich mit den FAQ-Fragen in StundenlohnRechner.tsx übereinstimmen. */
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
    {
      "@type": "Question",
      name: "Wie berechne ich meinen Stundenlohn aus dem Gehalt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stundenlohn = Monatsgehalt × 12 ÷ (Wochenstunden × 52). Bei 3.500 € Brutto und einer 40-Stunden-Woche sind das 3.500 × 12 ÷ 2.080 = 20,19 € pro Stunde.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist mein Netto-Stundenlohn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Netto-Stundenlohn ergibt sich, indem Sie Ihr monatliches Nettogehalt durch die monatlichen Arbeitsstunden teilen. Er liegt je nach Steuerklasse und Abzügen meist 25–35 % unter dem Brutto-Stundenlohn.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Stundenlohn und Stundengehalt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Begriffe meinen dasselbe: den Betrag, den Sie pro geleisteter Arbeitsstunde verdienen. „Stundenlohn“ ist im gewerblichen Bereich üblich, „Stundengehalt“ wird häufiger verwendet, wenn ein festes Monatsgehalt auf die Stunde heruntergerechnet wird.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viele Arbeitsstunden hat ein Monat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rechnerisch hat ein Monat bei einer 40-Stunden-Woche rund 173,33 Stunden (40 × 52 ÷ 12). Bei 38,5 Stunden sind es 166,83, bei 35 Stunden 151,67 und bei 30 Stunden 130 Stunden.",
      },
    },
    {
      "@type": "Question",
      name: "Ändert sich mein Netto-Stundenlohn mit der Stundenzahl?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Netto-Stundenlohn kann bei mehr Wochenstunden leicht sinken, da ein höheres Monatsgehalt in eine höhere Steuerprogression rutschen kann. Bei geringen Stundenzahlen bleibt er wegen des Grundfreibetrags oft nahezu konstant zum Brutto-Stundenlohn.",
      },
    },
  ],
};

export default function StundenlohnRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StundenlohnRechner content={<StundenlohnContent />} />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
          { href: "/mindestlohn", label: "Mindestlohn-Rechner", desc: "13,90 € (2026) / 14,60 € (2027)" },
          { href: "/teilzeitrechner", label: "Teilzeitrechner", desc: "Netto bei reduzierter Stundenzahl" },
          { href: "/minijob-rechner", label: "Minijob-Rechner", desc: "Verdienstgrenze & Stunden" },
        ]}
      />
    </>
  );
}
