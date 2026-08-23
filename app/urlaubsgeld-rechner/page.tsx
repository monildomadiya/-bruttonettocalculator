import type { Metadata } from "next";
import UrlaubsgeldRechner from "./UrlaubsgeldRechner";
import UrlaubsgeldContent from "./UrlaubsgeldContent";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Urlaubsgeld-Rechner 2026: Urlaubsgeld netto berechnen",
  description:
    "Urlaubsgeld-Rechner 2026: Berechnen Sie, wie viel vom Urlaubsgeld nach Steuern und Sozialabgaben netto bleibt — wahlweise zusammen mit dem Weihnachtsgeld.",
  keywords: [
    "Urlaubsgeld Rechner",
    "Rechner Urlaubsgeld",
    "Urlaubsgeld Rechner netto",
    "Urlaubsgeld netto berechnen",
    "Urlaubs und Weihnachtsgeld Rechner",
    "Urlaubsgeld versteuern",
    "Wie viel Urlaubsgeld bleibt netto",
    "Urlaubsgeld Steuer 2026",
    "Urlaubsgeld Sozialabgaben",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/urlaubsgeld-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Urlaubsgeld-Rechner 2026 — Urlaubsgeld netto berechnen",
    description:
      "Wie viel bleibt vom Urlaubsgeld netto? Inklusive kombinierter Berechnung mit dem Weihnachtsgeld.",
    url: "https://bruttonettocalculator.com/urlaubsgeld-rechner",
    locale: "de_DE",
    type: "website",
  },
};

/** Muss inhaltlich mit den FAQ-Fragen in UrlaubsgeldRechner.tsx übereinstimmen. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie wird Urlaubsgeld versteuert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Urlaubsgeld ist steuerlich ein „sonstiger Bezug“. Es wird dem voraussichtlichen Jahresarbeitslohn hinzugerechnet; die Lohnsteuer darauf ist die Differenz zwischen der Jahreslohnsteuer mit und ohne Urlaubsgeld. Dadurch greift auf die Sonderzahlung der Grenzsteuersatz.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel Urlaubsgeld bleibt netto übrig?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Je nach Steuerklasse und Höhe des laufenden Gehalts bleiben meist zwischen 50 % und 65 % netto übrig. Bei mittlerem Einkommen in Steuerklasse I liegt die Gesamtbelastung häufig bei 40–48 %.",
      },
    },
    {
      "@type": "Question",
      name: "Fallen auf Urlaubsgeld Sozialabgaben an?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, aber nur soweit die Beitragsbemessungsgrenze im Jahr noch nicht ausgeschöpft ist. 2026 liegt sie bei 69.750 € für Kranken- und Pflegeversicherung und bei 101.400 € für Renten- und Arbeitslosenversicherung.",
      },
    },
    {
      "@type": "Question",
      name: "Besteht ein gesetzlicher Anspruch auf Urlaubsgeld?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nein. Urlaubsgeld ist freiwillig. Ein Anspruch entsteht nur aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung oder betrieblicher Übung. Davon zu unterscheiden ist das Urlaubsentgelt — die gesetzlich garantierte Lohnfortzahlung während des Urlaubs nach § 11 BUrlG.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Urlaubsgeld und Urlaubsentgelt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Urlaubsentgelt ist das normale Gehalt, das während des Urlaubs weitergezahlt wird, und wird wie laufender Lohn versteuert. Urlaubsgeld ist eine zusätzliche freiwillige Sonderzahlung und wird als sonstiger Bezug versteuert.",
      },
    },
    {
      "@type": "Question",
      name: "Wie werden Urlaubsgeld und Weihnachtsgeld zusammen berechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beide sind sonstige Bezüge und werden im selben Kalenderjahr zusammengerechnet. Für die Sozialabgaben teilen sie sich denselben Spielraum bis zur Beitragsbemessungsgrenze; steuerlich erhöhen sie gemeinsam das Jahreseinkommen und damit den Grenzsteuersatz.",
      },
    },
    {
      "@type": "Question",
      name: "Wann wird Urlaubsgeld ausgezahlt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Meist mit der Mai-, Juni- oder Juli-Abrechnung, also vor der Haupturlaubszeit. Der genaue Termin ergibt sich aus dem Arbeits- oder Tarifvertrag; die steuerliche Behandlung ändert sich durch den Auszahlungsmonat nicht.",
      },
    },
  ],
};

export default function UrlaubsgeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UrlaubsgeldRechner content={<UrlaubsgeldContent />} />
      <RelatedCalculators
        links={[
          { href: "/weihnachtsgeld-rechner", label: "Weihnachtsgeld-Rechner", desc: "Netto vom Weihnachtsgeld" },
          { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner", desc: "Bonus & Sonderzahlungen" },
          { href: "/abfindungsrechner", label: "Abfindungsrechner", desc: "Fünftelregelung" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
