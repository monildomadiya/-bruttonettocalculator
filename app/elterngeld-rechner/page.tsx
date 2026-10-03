import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import ElterngeldRechner from "./ElterngeldRechner";
import { ELTERNGELD_FAQS, ELTERNGELD_REFORM_STAND } from "./elterngeldData";
import ToolContent from "@/components/ToolContent";
import Section from "@/components/ui/Section";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";

const PAGE_TITLE = "Elterngeld-Rechner 2026/2027 – Basis & Plus, Reform 2027";
const PAGE_DESCRIPTION =
  "Elterngeld-Rechner 2026/2027: Basiselterngeld (65–100 % des Nettos) und ElterngeldPlus berechnen, 300 bis 1.800 € — plus Stand der geplanten Elterngeld-Reform.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Elterngeld Rechner",
    "Elterngeld Rechner 2026",
    "Elterngeld Rechner 2027",
    "Elterngeld 2027",
    "Elterngeld 2027 Kürzung",
    "Elterngeld Reform 2027",
    "Elterngeld berechnen",
    "ElterngeldPlus Rechner",
    "Basiselterngeld",
    "wie viel Elterngeld bekomme ich",
    "Elterngeld Höchstbetrag",
    "Elterngeld Einkommensgrenze",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/elterngeld-rechner" },
  openGraph: {
    images: [pageImageUrl("/elterngeld-rechner")],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://bruttonettocalculator.com/elterngeld-rechner",
    locale: "de_DE",
    type: "website",
  },
};

// Aus denselben Fragen wie im Rechner — Schema und sichtbare FAQ laufen nicht auseinander.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ELTERNGELD_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const VERGLEICH = [
  ["Bezugsdauer", "bis 14 Monate (12 + 2 Partner­monate)", "höchstens 12 Monate, je 3 pro Elternteil reserviert"],
  ["Mindestbetrag", "300 €", "330 €"],
  ["Höchstbetrag", "1.800 €", "1.900 €"],
  ["Einkommens­grenze", "175.000 € zvE", "unverändert"],
  ["Gilt für", "alle Geburten heute", "Geburten ab 1. November 2027"],
];

export default function ElterngeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ElterngeldRechner />

      <div className="max-w-6xl mx-auto px-5 pt-6">
        <Section
          id="elterngeld-2027"
          variant="muted"
          eyebrow="Reform 2027"
          eyebrowIcon={CalendarClock}
          title="Elterngeld 2027: Was geplant ist — und was gilt"
          prose
        >
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-5">
            <p className="text-[#16181D]">
              <strong>Stand {ELTERNGELD_REFORM_STAND}: nicht beschlossen.</strong> Der Rechner oben rechnet nach dem
              geltenden Recht. Das gilt auch 2027 für alle Kinder, die vor dem 1. November 2027 geboren werden.
            </p>
          </div>
          <p>
            Im Juli 2026 hat das Bundesfamilienministerium einen Referentenentwurf vorgelegt. Er kürzt das
            Basiselterngeld für Geburten ab dem 1. November 2027 von 14 auf höchstens 12 Monate und hebt dafür
            Mindest- und Höchstbetrag leicht an. Nach Kritik über den Sommer hat Familienministerin Karin Prien am
            30. September angekündigt, die Sparmaßnahmen noch einmal zu prüfen. Auch ein Festhalten an 14 Monaten ist
            möglich. Kabinett, Bundestag und Bundesrat stehen aus.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-base">
              <thead>
                <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                  <th className="py-3 px-2 sm:px-4"> </th>
                  <th className="py-3 px-2 sm:px-4">Gilt heute</th>
                  <th className="py-3 px-2 sm:px-4">Entwurf Juli 2026*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {VERGLEICH.map(([k, heute, entwurf]) => (
                  <tr key={k}>
                    <td className="py-3 px-2 sm:px-4 font-semibold text-[#16181D]">{k}</td>
                    <td className="py-3 px-2 sm:px-4">{heute}</td>
                    <td className="py-3 px-2 sm:px-4">{entwurf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50">
            * Referentenentwurf, nicht beschlossen und erneut in Prüfung. Die Einkommensgrenze von 175.000 € gilt seit
            Geburten ab dem 1. April 2025. Sobald die Bundesregierung entscheidet, wird dieser Abschnitt aktualisiert.
          </p>
        </Section>
      </div>

      <ToolContent config={TOOL_CONTENT["/elterngeld-rechner"]} />
    </>
  );
}
