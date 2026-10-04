import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import UnterhaltsRechner from "./UnterhaltsRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { formatEUR } from "@/lib/taxCalculator";
import {
  DT_2026, DT_STAND, DT_QUELLE, KINDERGELD_2026, SELBSTBEHALT, EIGENBEDARF_VOLLJAEHRIGE,
  BEDARF_STUDENT_AUSWAERTS, ALTERSSTUFEN, zahlbetrag, berechneUnterhalt,
} from "@/lib/unterhalt";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/unterhaltsrechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Unterhaltsrechner 2026: Düsseldorfer Tabelle & Zahlbetrag";
const DESCRIPTION =
  "Kindesunterhalt 2026 berechnen: Düsseldorfer Tabelle mit Zahlbetrag nach Kindergeld, Selbstbehalt 1.450 €, Bedarfskontrolle und Mangelfall – auch aus Brutto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "unterhaltsrechner",
    "unterhaltsrechner 2026",
    "düsseldorfer tabelle 2026",
    "kindesunterhalt rechner",
    "kindesunterhalt berechnen",
    "unterhaltsrechner düsseldorfer tabelle",
    "selbstbehalt 2026",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const ALTER_BEISPIEL = [3, 8, 14, 18];

export default function Page() {
  const bsp = berechneUnterhalt({ einkommen: 2800, alter: [4, 9], erwerbstaetig: true, bedarfskontrolle: true });

  const faqs = [
    {
      q: "Wie viel Kindesunterhalt muss ich 2026 zahlen?",
      a: `Das hängt vom bereinigten Nettoeinkommen und vom Alter des Kindes ab. Der Mindestunterhalt (Gruppe 1) beträgt 2026 laut Düsseldorfer Tabelle ${DT_2026[0].bedarf[0]} € (0–5 Jahre), ${DT_2026[0].bedarf[1]} € (6–11) und ${DT_2026[0].bedarf[2]} € (12–17). Davon wird das halbe Kindergeld (${formatEUR(KINDERGELD_2026 / 2)}) abgezogen — zu zahlen sind also mindestens ${formatEUR(zahlbetrag(DT_2026[0], 3))}, ${formatEUR(zahlbetrag(DT_2026[0], 8))} bzw. ${formatEUR(zahlbetrag(DT_2026[0], 14))}. Beispiel: Bei ${formatEUR(2800)} netto und zwei Kindern (4 und 9 Jahre) sind es ${formatEUR(bsp.summe)} im Monat (Gruppe ${bsp.gruppe}).`,
    },
    {
      q: "Wie hoch ist der Selbstbehalt 2026?",
      a: `Gegenüber minderjährigen Kindern ${formatEUR(SELBSTBEHALT.erwerbstaetig)} für Erwerbstätige und ${formatEUR(SELBSTBEHALT.nichtErwerbstaetig)} für Nichterwerbstätige; darin sind bis ${SELBSTBEHALT.warmmiete} € Warmmiete enthalten. Gegenüber volljährigen Kindern, die nicht privilegiert sind, gilt der angemessene Eigenbedarf von mindestens ${formatEUR(EIGENBEDARF_VOLLJAEHRIGE)}.`,
    },
    {
      q: "Welches Einkommen zählt für den Unterhalt?",
      a: "Das bereinigte Nettoeinkommen: Bruttoeinkommen abzüglich Steuern und Sozialabgaben, dann abzüglich konkreter berufsbedingter Aufwendungen (etwa Fahrtkosten) und anerkannter Schulden. Eine Pauschale von 5 % gewähren die Leitlinien der Oberlandesgerichte in NRW 2026 in der Regel nur bei fiktivem Einkommen — sonst müssen die Kosten konkret belegt werden. Ein 13. Gehalt oder Weihnachtsgeld wird auf das Jahr verteilt mitgezählt.",
    },
    {
      q: "Was ist der Bedarfskontrollbetrag?",
      a: "Ein Betrag, der dem Unterhaltspflichtigen nach Abzug des Kindesunterhalts mindestens bleiben soll, damit das Einkommen ausgewogen verteilt wird. Wird er unterschritten, kann der Tabellenbetrag einer niedrigeren Gruppe angesetzt werden, deren Bedarfskontrollbetrag eingehalten ist (Anm. A III der Tabelle). Er ist nicht dasselbe wie der Selbstbehalt.",
    },
    {
      q: "Was passiert, wenn das Einkommen nicht reicht (Mangelfall)?",
      a: `Dann wird der Betrag oberhalb des Selbstbehalts auf alle minderjährigen Kinder im Verhältnis ihrer Zahlbeträge verteilt. Beispiel der Düsseldorfer Tabelle: 1.750 € Einkommen, drei Kinder — es stehen 300 € zur Verfügung, die Kinder erhalten 107,60 €, 105,02 € und 87,38 €. Den Rest kann der betreuende Elternteil beim Jugendamt als Unterhaltsvorschuss beantragen.`,
    },
    {
      q: "Wie viel Unterhalt bekommen volljährige Kinder?",
      a: `Volljährige Kinder werden nach der 4. Altersstufe eingestuft, und das volle Kindergeld (${KINDERGELD_2026} €) wird abgezogen. Weil dann beide Eltern anteilig nach ihrem Einkommen haften, rechnet dieser Rechner nur minderjährige Kinder. Studierende mit eigener Wohnung haben in der Regel einen Bedarf von ${BEDARF_STUDENT_AUSWAERTS} € im Monat.`,
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Unterhaltsrechner 2026"
        url={URL}
        breadcrumbLabel="Unterhaltsrechner"
        description="Kostenloser Rechner für den Kindesunterhalt 2026 nach der Düsseldorfer Tabelle: Einkommensgruppe, Zahlbetrag nach Kindergeldanrechnung, Bedarfskontrollbetrag, Selbstbehalt und Mangelfallberechnung — wahlweise aus dem Bruttogehalt."
        faqs={faqs}
      />
      <UnterhaltsRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Düsseldorfer Tabelle 2026: Bedarf und Zahlbetrag
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Bereinigtes Nettoeinkommen des Barunterhaltspflichtigen in Euro pro Monat. Je Altersstufe oben der Bedarf,
          darunter der Zahlbetrag nach Abzug des Kindergeldanteils ({formatEUR(KINDERGELD_2026 / 2)} bei Minderjährigen,{" "}
          {formatEUR(KINDERGELD_2026)} ab 18). Stand: {DT_STAND}.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-4">Gruppe · Netto</th>
                {ALTERSSTUFEN.map((a) => <th key={a} className="py-3 px-4 text-right">{a}</th>)}
                <th className="py-3 px-4 text-right">%</th>
                <th className="py-3 px-4 text-right">Bedarfskontrolle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm">
              {DT_2026.map((g) => (
                <tr key={g.nr}>
                  <td className="py-2.5 px-4 font-semibold whitespace-nowrap">
                    {g.nr}. {g.nr === 1 ? `bis ${g.bis.toLocaleString("de-DE")}` : `${g.von.toLocaleString("de-DE")}–${g.bis.toLocaleString("de-DE")}`}
                  </td>
                  {ALTER_BEISPIEL.map((a, i) => (
                    <td key={i} className="py-2.5 px-4 text-right font-mono whitespace-nowrap">
                      {g.bedarf[i].toLocaleString("de-DE")}
                      <span className="block text-xs text-emerald-700">{zahlbetrag(g, a).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</span>
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right font-mono">{g.prozent}</td>
                  <td className="py-2.5 px-4 text-right font-mono">{g.nr === 1 ? "1.200 / 1.450" : g.bkb.toLocaleString("de-DE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle:{" "}
          <a href={DT_QUELLE} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">Oberlandesgericht Düsseldorf, Düsseldorfer Tabelle Stand 01.01.2026</a>{" "}
          mit Anhang „Tabelle Zahlbeträge“. Die Tabelle ist eine Richtlinie ohne Gesetzeskraft und geht von zwei
          Unterhaltsberechtigten aus. Die Tabelle 2027 erscheint voraussichtlich im Dezember.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">So rechnet der Unterhaltsrechner</h2>
          <p>
            <strong className="text-[#16181D]">1. Einkommen bereinigen:</strong> Netto minus konkrete berufsbedingte Kosten
            und anerkannte Schulden. Wer nur sein Brutto kennt, lässt das Netto mit dem{" "}
            <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner</Link> 2026
            ermitteln — inklusive Steuerklasse.
          </p>
          <p>
            <strong className="text-[#16181D]">2. Gruppe und Altersstufe:</strong> Das Einkommen bestimmt die Gruppe (1 bis
            15), das Alter des Kindes die Spalte. Der Unterhalt der höheren Altersstufe gilt ab dem Monat, in dem das Kind
            6, 12 oder 18 wird.
          </p>
          <p>
            <strong className="text-[#16181D]">3. Kindergeld abziehen:</strong> Bei minderjährigen Kindern die Hälfte
            ({formatEUR(KINDERGELD_2026 / 2)}), weil der betreuende Elternteil den Rest über die Betreuung leistet.
          </p>
          <p>
            <strong className="text-[#16181D]">4. Kontrolle:</strong> Bleibt nach dem Unterhalt weniger als der
            Bedarfskontrollbetrag, wird herabgestuft; reicht es nicht einmal für den Mindestunterhalt aller Kinder über dem
            Selbstbehalt, gilt die Mangelfallverteilung.
          </p>
          <p>
            Nicht abgebildet sind Ehegattenunterhalt, Wechselmodell und der Unterhalt volljähriger Kinder — dort hängt viel
            vom Einzelfall ab. Mehr Netto durch eine andere Steuerklasse nach der Trennung prüft der{" "}
            <Link href="/steuerklassenwechsel-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassenwechsel-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Kindesunterhalt</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
