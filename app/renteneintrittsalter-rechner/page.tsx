import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import RenteneintrittRechner from "./RenteneintrittRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { rentenarten, formatAlter } from "@/lib/renteneintritt";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/renteneintrittsalter-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Renteneintrittsalter Rechner: Wann kann ich in Rente gehen?";
const DESCRIPTION =
  "Renteneintrittsalter berechnen: Regelaltersgrenze, Rente mit 63 (bis 14,4 % Abschlag), nach 45 Jahren und für Schwerbehinderte — Rentenbeginn nach SGB VI.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "renteneintrittsalter rechner",
    "renteneintrittsalter berechnen",
    "wann kann ich in rente gehen",
    "regelaltersgrenze rechner",
    "rente mit 63 rechner",
    "renteneintritt rechner",
    "rentenbeginn berechnen",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const JAHRGAENGE = [1958, 1959, 1960, 1961, 1962, 1963, 1964];

/** Tabellenwerte je Jahrgang — Geburtstag Mitte des Jahres, für die Alter irrelevant. */
const zeilen = JAHRGAENGE.map((jg) => {
  const a = rentenarten(new Date(jg, 6, 15));
  const by = (k: string) => a.find((x) => x.key === k)!;
  return { jg, regel: by("regel"), lj: by("langjaehrig"), blj: by("besondersLangjaehrig"), sb: by("schwerbehindert") };
});

export default function Page() {
  const z1964 = zeilen.find((z) => z.jg === 1964)!;

  const faqs = [
    {
      q: "Wann kann ich in Rente gehen?",
      a: "Ohne Abschlag mit Erreichen der Regelaltersgrenze: Für alle ab 1964 Geborenen liegt sie bei 67 Jahren, für die Jahrgänge 1958 bis 1963 zwischen 66 und 66 Jahren und 10 Monaten. Früher geht es mit 35 Versicherungsjahren ab 63 (mit Abschlag), mit 45 Jahren ab 65 ohne Abschlag und mit Schwerbehinderung ab 65 bzw. mit Abschlag ab 62 (Jahrgang 1964 und jünger).",
    },
    {
      q: "Gibt es die Rente mit 63 noch?",
      a: `Ja, aber nicht mehr abschlagsfrei. Als Rente für langjährig Versicherte (35 Jahre Wartezeit) kann sie weiterhin ab 63 beginnen, kostet dann aber 0,3 % je Monat vor der Regelaltersgrenze — für Jahrgang 1964 und jünger ${z1964.lj.abschlagPct.toLocaleString("de-DE")} % dauerhaft. Abschlagsfrei vorzeitig geht es nur mit 45 Jahren Wartezeit — ab Jahrgang 1964 mit 65.`,
    },
    {
      q: "Wie hoch ist der Abschlag bei vorzeitiger Rente?",
      a: "0,3 % für jeden Monat, den die Rente vor der abschlagsfreien Altersgrenze beginnt (§ 77 SGB VI). Der Abschlag gilt lebenslang, auch für eine spätere Witwen- oder Witwerrente. Wer umgekehrt nach der Regelaltersgrenze weiterarbeitet und die Rente aufschiebt, bekommt 0,5 % Zuschlag je Monat — 6 % pro Jahr.",
    },
    {
      q: "Wann beginnt die Rente genau?",
      a: "Am Ersten des Monats, der auf den Monat folgt, in dem Sie das maßgebliche Alter erreichen (§ 99 SGB VI). Ein Lebensjahr ist am Tag vor dem Geburtstag vollendet. Wer am 1. eines Monats geboren ist, bekommt die Rente deshalb schon ab dem Geburtstagsmonat — wer am 2. geboren ist, einen Monat später. Die Rente muss spätestens drei Monate danach beantragt werden, sonst beginnt sie erst mit dem Antragsmonat.",
    },
    {
      q: "Was zählt zu den 35 und 45 Jahren Wartezeit?",
      a: "Für die 35 Jahre zählen alle rentenrechtlichen Zeiten — Beitragszeiten, Kindererziehung, Pflege, Krankheit, Arbeitslosigkeit und Ausbildung. Für die 45 Jahre zählen Pflichtbeiträge aus Beschäftigung, Berücksichtigungszeiten (Kindererziehung bis zum 10. Lebensjahr, Pflege), Krankengeld und Arbeitslosengeld I — dieses aber nicht in den letzten zwei Jahren vor Rentenbeginn, außer bei Insolvenz des Arbeitgebers (§ 51 Abs. 3a SGB VI). Zeiten mit Bürgergeld zählen nicht. Den genauen Stand zeigt Ihr Versicherungsverlauf bei der Deutschen Rentenversicherung.",
    },
    {
      q: "Darf ich neben einer vorgezogenen Rente hinzuverdienen?",
      a: "Ja, unbegrenzt. Seit dem 1. Januar 2023 gibt es für Altersrenten keine Hinzuverdienstgrenze mehr — auch nicht vor Erreichen der Regelaltersgrenze. Der Lohn ist aber steuer- und sozialversicherungspflichtig, und der Abschlag auf die Rente bleibt bestehen.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Renteneintrittsalter-Rechner"
        url={URL}
        breadcrumbLabel="Renteneintrittsalter-Rechner"
        description="Kostenloser Rechner für Renteneintrittsalter und Rentenbeginn nach dem SGB VI: Regelaltersrente, Rente für langjährig und besonders langjährig Versicherte sowie für schwerbehinderte Menschen, mit Abschlag in Prozent."
        faqs={faqs}
      />
      <RenteneintrittRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Renteneintrittsalter nach Jahrgang
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Altersgrenzen ohne Abschlag; in Klammern der frühestmögliche Beginn mit Abschlag. Quelle: §§ 35–38 und
          235–236b SGB VI.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-4">Jahrgang</th>
                <th className="py-3.5 px-4 text-[#16181D] font-bold">Regelaltersgrenze</th>
                <th className="py-3.5 px-4">35 Jahre Wartezeit</th>
                <th className="py-3.5 px-4">45 Jahre Wartezeit</th>
                <th className="py-3.5 px-4">Schwerbehindert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm">
              {zeilen.map((z) => (
                <tr key={z.jg}>
                  <td className="py-3 px-4 font-mono font-semibold">{z.jg === 1964 ? "ab 1964" : z.jg}</td>
                  <td className="py-3 px-4 font-bold">{formatAlter(z.regel.alterAbschlagsfrei)}</td>
                  <td className="py-3 px-4">ab 63 mit {z.lj.abschlagPct.toLocaleString("de-DE")} % Abschlag</td>
                  <td className="py-3 px-4">{formatAlter(z.blj.alterAbschlagsfrei)}</td>
                  <td className="py-3 px-4">
                    {formatAlter(z.sb.alterAbschlagsfrei)}
                    <span className="text-black/55"> ({formatAlter(z.sb.alterFruehestens!)}, {z.sb.abschlagPct.toLocaleString("de-DE")} %)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Abschlag bei „35 Jahre Wartezeit“ für einen Rentenbeginn genau mit 63. Gesetzestexte:{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_6/__235.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 235</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_6/__236.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 236</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_6/__236a.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 236a</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_6/__236b.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 236b</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_6/__77.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 77 SGB VI</a>.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Die vier Altersrenten im Überblick</h2>
          <p>
            <strong className="text-[#16181D]">Regelaltersrente:</strong> 5 Jahre Versicherungszeit genügen. Sie beginnt mit
            der Regelaltersgrenze — 67 Jahre ab Jahrgang 1964.
          </p>
          <p>
            <strong className="text-[#16181D]">Langjährig Versicherte (35 Jahre):</strong> abschlagsfrei ebenfalls erst mit der
            Regelaltersgrenze, aber vorzeitig ab 63 — mit 0,3 % Abschlag je Monat, ab Jahrgang 1964 also{" "}
            {z1964.lj.abschlagPct.toLocaleString("de-DE")} %.
          </p>
          <p>
            <strong className="text-[#16181D]">Besonders langjährig Versicherte (45 Jahre):</strong> die einzige vorgezogene
            Rente ohne Abschlag, ab Jahrgang 1964 mit 65. Ein früherer Beginn ist hier nicht möglich.
          </p>
          <p>
            <strong className="text-[#16181D]">Schwerbehinderte Menschen (GdB ab 50, 35 Jahre):</strong> abschlagsfrei ab 65,
            vorzeitig ab 62 mit bis zu {z1964.sb.abschlagPct.toLocaleString("de-DE")} % Abschlag (Jahrgang 1964 und jünger).
          </p>
          <p>
            Wie viel Rente Sie bekommen, schätzt der{" "}
            <Link href="/rentenrechner" className="text-[#E60A1C] font-semibold hover:underline">Rentenrechner</Link>; was davon nach
            Steuern und Krankenversicherung bleibt, der{" "}
            <Link href="/rente-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Rente-Brutto-Netto-Rechner</Link>.
            Eine geförderte private Ergänzung ab 2027 rechnet der{" "}
            <Link href="/altersvorsorgedepot-rechner" className="text-[#E60A1C] font-semibold hover:underline">Altersvorsorgedepot-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Renteneintritt</h2>
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
