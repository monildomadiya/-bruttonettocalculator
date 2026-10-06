import type { Metadata } from "next";
import ArbeitslosengeldRechner from "./ArbeitslosengeldRechner";
import ArbeitslosengeldContent from "./ArbeitslosengeldContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import SupportButton from "@/components/SupportButton";
import { pageImageUrl } from "@/lib/pageImage";

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
    "wann wird arbeitslosengeld überwiesen",
    "abfindung arbeitslosengeld angerechnet",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/arbeitslosengeld-rechner" },
  openGraph: {
    images: [pageImageUrl("/arbeitslosengeld-rechner")],
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
    {
      "@type": "Question",
      name: "Wann überweist die Arbeitsagentur das Arbeitslosengeld?",
      acceptedAnswer: { "@type": "Answer", text: "Arbeitslosengeld wird monatlich nachträglich gezahlt (§ 337 Abs. 2 SGB III): Das Geld für einen Monat überweist die Agentur für Arbeit zum Monatsende, auf dem Konto ist es meist am letzten Bankarbeitstag des Monats oder in den ersten Tagen des Folgemonats. Die erste Zahlung kommt erst, wenn der Antrag bewilligt ist; Zeiten davor werden nachgezahlt. Ruht der Anspruch, etwa wegen einer Sperrzeit, beginnt die Zahlung entsprechend später." },
    },
    {
      "@type": "Question",
      name: "Wird eine Abfindung auf das Arbeitslosengeld angerechnet?",
      acceptedAnswer: { "@type": "Answer", text: "Nein, die Abfindung selbst kürzt das Arbeitslosengeld nicht und erhöht auch nicht das Bemessungsentgelt. Endet das Arbeitsverhältnis aber vor Ablauf der ordentlichen Kündigungsfrist, ruht der Anspruch für eine gewisse Zeit (§ 158 SGB III), und wer ohne wichtigen Grund einen Aufhebungsvertrag unterschreibt, riskiert eine Sperrzeit von bis zu zwölf Wochen (§ 159 SGB III). Was von der Abfindung netto bleibt, zeigt der Abfindungsrechner." },
    },
  ],
};

export default function ArbeitslosengeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArbeitslosengeldRechner content={<ArbeitslosengeldContent />} />
      {/* Coffee section before the curated related block: that block keeps it
          apart from the end-of-content ad (see components/SupportStory.tsx). */}
      <SupportButton variant="story" lang="de" placement="page_inline" />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Nettogehalt als Basis für die Schätzung" },
          { href: "/steuerklassen", label: "Steuerklassen", desc: "Einfluss auf das Leistungsentgelt" },
          { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeberrechner", desc: "Lohnkosten & SV-Beiträge" },
          { href: "/kurzarbeitergeld-rechner", label: "Kurzarbeitergeld-Rechner", desc: "KUG bei Kurzarbeit" },
        ]}
      />
      <ToolContent config={TOOL_CONTENT["/arbeitslosengeld-rechner"]} />
    </>
  );
}
