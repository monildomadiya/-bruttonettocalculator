import type { Metadata } from "next";
import ArbeitslosengeldRechner from "./ArbeitslosengeldRechner";
import ArbeitslosengeldContent from "./ArbeitslosengeldContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "ALG-1-Rechner 2026: Arbeitslosengeld berechnen",
  description:
    "Berechnen Sie Ihr voraussichtliches Arbeitslosengeld 2026. Mit Leistungssatz, Bemessungsentgelt, Anspruchsdauer und verständlichen Beispielen.",
  keywords: [
    "ALG 1 Rechner 2026",
    "arbeitslosengeldrechner 2026",
    "arbeitslosengeld brutto netto",
    "ALG 1 berechnen",
    "arbeitslosengeld rechner",
    "arbeitslosengeld höhe",
    "leistungsentgelt bemessungsentgelt",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/arbeitslosengeld-rechner" },
  openGraph: {
    title: "ALG-1-Rechner 2026: Arbeitslosengeld berechnen",
    description: "Voraussichtliches Arbeitslosengeld I 2026 mit Leistungssatz, Bemessungsentgelt und Beispielen.",
    url: "https://bruttonettocalculator.com/arbeitslosengeld-rechner",
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
      name: "Wie viel Arbeitslosengeld (ALG I) bekomme ich?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Arbeitslosengeld I beträgt 60 % Ihres pauschalierten Leistungsentgelts, bzw. 67 % mit mindestens einem Kind. Grundlage ist das Bemessungsentgelt (Brutto der letzten 12 Monate, gedeckelt auf die Beitragsbemessungsgrenze) abzüglich einer 20-%-Sozialpauschale und der fiktiven Lohnsteuer.",
      },
    },
    {
      "@type": "Question",
      name: "Wie lange bekomme ich Arbeitslosengeld?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Bezugsdauer liegt je nach Alter und Beschäftigungsdauer zwischen 6 und 24 Monaten.",
      },
    },
  ],
};

export default function ArbeitslosengeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArbeitslosengeldRechner content={<ArbeitslosengeldContent />} />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Nettogehalt als Basis für die Schätzung" },
          { href: "/steuerklassen", label: "Steuerklassen", desc: "Einfluss auf das Leistungsentgelt" },
          { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeberrechner", desc: "Lohnkosten & SV-Beiträge" },
          { href: "/kurzarbeitergeld-rechner", label: "Kurzarbeitergeld-Rechner", desc: "KUG bei Kurzarbeit" },
        ]}
      />
      <AdUnit placement="content" />
    </>
  );
}
