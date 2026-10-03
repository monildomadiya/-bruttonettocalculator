import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import KrankengeldRechner from "./KrankengeldRechner";
import { KRANKENGELD_FAQS } from "./krankengeldData";
import CalculatorSchema from "@/components/CalculatorSchema";
import ToolContent from "@/components/ToolContent";
import Section from "@/components/ui/Section";
import { TOOL_CONTENT } from "@/data/tool-content";
import { calculateNetto } from "@/lib/taxCalculator";
import { krankengeldTag, krankengeldNachJobende2027Tag } from "@/lib/krankengeld";
import { pageImageUrl } from "@/lib/pageImage";

const URL = "https://bruttonettocalculator.com/krankengeld-rechner";
const PAGE_TITLE = "Krankengeld-Rechner 2026/2027 — Höhe des Krankengeldes";
const PAGE_DESCRIPTION =
  "Krankengeld 2026/2027 berechnen: 70 % vom Brutto, max. 90 % vom Netto, nach Sozialabgaben. Plus: Was sich ab 2027 ändert (60 % nach Jobende, Teilrente).";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "krankengeld rechner",
    "krankengeld rechner 2027",
    "krankengeld 2027",
    "krankengeld änderung 2027",
    "krankengeld reform 2027",
    "krankengeld höhe berechnen",
    "krankengeld netto rechner",
    "wie viel krankengeld",
    "krankengeld berechnen",
    "höhe krankengeld",
    "krankengeld 70 prozent rechner",
    "krankengeld brutto netto",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/krankengeld-rechner")],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

// Ohne "€" in den Zellen (steht im Kopf): passt so bei 375 px ohne Querscrollen.
const zahl = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Beispiel: Beschäftigung endet während der AU — heute vs. ab 1.1.2027 (ohne Kind, Steuerklasse I).
const BEISPIELE = [2500, 3500, 5000].map((brutto) => {
  const netto = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).nettoMonat;
  const heute = krankengeldTag(brutto, netto, true).nettoKg * 30;
  const ab2027 = krankengeldNachJobende2027Tag(netto, false, true).nettoKg * 30;
  return { brutto, heute, ab2027, diff: ab2027 - heute };
});

const AENDERUNGEN = [
  {
    datum: "1. Januar 2027",
    text: "Endet das Arbeitsverhältnis während der Krankschreibung, beträgt das Krankengeld ab dem Folgetag 60 % des Nettoarbeitsentgelts, mit Kind 67 % (§ 47 Abs. 2a SGB V).",
    jetzt: true,
  },
  {
    datum: "1. Januar 2027",
    text: "Auch eine Teilrente wegen Alters von mehr als zwei Dritteln der Vollrente schließt das Krankengeld aus (§ 50 SGB V).",
    jetzt: true,
  },
  {
    datum: "1. Januar 2027",
    text: "Die Krankenkasse kann eine Frist von vier Wochen setzen, um einen Antrag auf Reha-Leistungen zu stellen (§ 51 SGB V).",
    jetzt: true,
  },
  {
    datum: "1. Januar 2028",
    text: "Teilarbeitsunfähigkeit: Ärzte können 25, 50 oder 75 % feststellen; mit Zustimmung des Arbeitgebers arbeiten Versicherte dann teilweise und erhalten anteiliges Krankengeld.",
    jetzt: false,
  },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Krankengeld-Rechner 2026/2027" url={URL}
        breadcrumbLabel="Krankengeld-Rechner"
        description="Kostenloser Krankengeld-Rechner — Höhe des Krankengeldes (70 % brutto, max. 90 % netto) nach Sozialabgaben berechnen, mit den Änderungen ab 2027."
        faqs={KRANKENGELD_FAQS} />
      <KrankengeldRechner />

      <div className="max-w-6xl mx-auto px-5 pt-6">
        <Section
          id="krankengeld-2027"
          variant="muted"
          eyebrow="Ab 2027"
          eyebrowIcon={CalendarClock}
          title="Krankengeld 2027: Was sich ändert"
          prose
        >
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-5">
            <p className="text-[#16181D]">
              <strong>Höhe und Dauer bleiben:</strong> weiter 70 % des Bruttos, höchstens 90 % des Nettos, für längstens
              78 Wochen in drei Jahren. Die Änderungen stehen im GKV-Beitragssatzstabilisierungsgesetz vom 24. Juli 2026
              (BGBl. 2026 I Nr. 228) und betreffen einzelne Fälle.
            </p>
          </div>

          <ul className="space-y-2">
            {AENDERUNGEN.map((a) => (
              <li key={a.text} className="flex gap-3">
                {a.jetzt ? (
                  <CheckCircle2 size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Clock size={20} className="text-black/35 flex-shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span>
                  <strong className="text-[#16181D]">Ab {a.datum}:</strong> {a.text}
                </span>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
              Beispiel: Job endet während der Krankschreibung
            </h3>
            <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-base">
                <thead>
                  <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-normal sm:tracking-wider text-black/70">
                    <th className="py-3 px-1.5 sm:px-4">Brutto</th>
                    <th className="py-3 px-1.5 sm:px-4 text-right">Heute</th>
                    <th className="py-3 px-1.5 sm:px-4 text-right">2027</th>
                    <th className="py-3 px-1.5 sm:px-4 text-right">Diff.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {BEISPIELE.map((b) => (
                    <tr key={b.brutto}>
                      <td className="py-3 px-1.5 sm:px-4 font-mono font-bold text-[#16181D] whitespace-nowrap">{zahl(b.brutto)}</td>
                      <td className="py-3 px-1.5 sm:px-4 text-right font-mono whitespace-nowrap">{zahl(b.heute)}</td>
                      <td className="py-3 px-1.5 sm:px-4 text-right font-mono font-bold text-[#16181D] whitespace-nowrap">{zahl(b.ab2027)}</td>
                      <td className="py-3 px-1.5 sm:px-4 text-right font-mono text-[#E60A1C] whitespace-nowrap">{zahl(b.diff)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black/50 mt-2">
              Alle Beträge in Euro. Netto-Krankengeld pro Monat (30 Tage) nach Ende der Beschäftigung, Steuerklasse I, ohne Kind,
              ohne Kirchensteuer. „Heute“: 70 % des Bruttos, höchstens 90 % des Nettos; „Ab 2027“: 60 % des Nettos.
              Mit Kind sind es ab 2027 67 % des Nettos.
            </p>
          </div>
        </Section>
      </div>

      <ToolContent config={TOOL_CONTENT["/krankengeld-rechner"]} />
    </>
  );
}
