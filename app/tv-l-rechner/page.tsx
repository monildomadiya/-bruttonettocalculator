import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import TvlRechner from "./TvlRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { JSZ_TARIFE } from "@/data/jahressonderzahlung";
import { TVL_2026, TVL_GUELTIG_AB, TVL_GUELTIG_BIS, TVL_QUELLE, TVL_EINIGUNG_URL, TVL_NAECHSTE_STUFEN } from "@/data/tvl";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/tv-l-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "TV-L Rechner 2026: Entgelttabelle mit Netto";
const DESCRIPTION =
  "TV-L-Rechner 2026: Brutto und Netto nach Entgeltgruppe und Stufe, amtliche Tabelle ab 1.4.2026, Jahressonderzahlung und Erhöhung um 2,0 % ab März 2027.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["tv-l rechner", "tv-l rechner 2026", "tvl rechner", "tv-l entgelttabelle 2026", "tv-l netto", "tv-l rechner 2027", "tv-l tabelle"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const netto = (b: number) =>
  calculateNetto({ bruttoMonat: b, jahr: 2026, steuerklasse: 1, verheiratet: false, kinderlosUeber23: false, kirche: false }).nettoMonat;

const tvlStaffel = JSZ_TARIFE.find((t) => t.key === "tvl")!.staffel;

export default function Page() {
  const e9b3 = TVL_2026.find((g) => g.slug === "e9b")!.stufen[2]!;
  const e13s1 = TVL_2026.find((g) => g.slug === "e13")!.stufen[0]!;

  const faqs = [
    {
      q: "Wie viel verdient man im TV-L 2026?",
      a: `Laut Entgelttabelle ab ${TVL_GUELTIG_AB} zwischen ${formatEUR(TVL_2026.find((g) => g.slug === "e1")!.stufen[1]!)} (E 1, Stufe 2) und ${formatEUR(TVL_2026.find((g) => g.slug === "e15ue")!.stufen[4]!)} (E 15Ü, Stufe 5) brutto im Monat. Beispiel E 9b Stufe 3: ${formatEUR(e9b3)} brutto, in Steuerklasse I rund ${formatEUR(netto(e9b3))} netto. Einstieg mit Master (E 13 Stufe 1): ${formatEUR(e13s1)} brutto, rund ${formatEUR(netto(e13s1))} netto.`,
    },
    {
      q: "Wann steigen die Gehälter im TV-L?",
      a: `Nach der Tarifeinigung vom 14. Februar 2026 stiegen die Tabellenentgelte zum 1. April 2026 um 2,8 %, mindestens um 100 € im Monat. Es folgen +${TVL_NAECHSTE_STUFEN[0].prozent.toLocaleString("de-DE")} % ab ${TVL_NAECHSTE_STUFEN[0].ab} und +${TVL_NAECHSTE_STUFEN[1].prozent.toLocaleString("de-DE")} % ab ${TVL_NAECHSTE_STUFEN[1].ab}. Die aktuelle Tabelle gilt bis ${TVL_GUELTIG_BIS}.`,
    },
    {
      q: "Wie hoch ist die Jahressonderzahlung im TV-L?",
      a: `${tvlStaffel.map((s) => `${s.prozent.toLocaleString("de-DE")} % (${s.label.replace("Entgeltgruppen ", "E ")})`).join(", ")} des Durchschnittsentgelts Juli bis September, ausgezahlt mit dem Novembergehalt. Die Sätze gelten seit 2022 bundesweit einheitlich; die Einigung 2026 hat sie nicht geändert.`,
    },
    {
      q: "Für wen gilt der TV-L?",
      a: "Für Tarifbeschäftigte der Bundesländer — etwa an Landesbehörden, Universitäten, Unikliniken und in vielen Ländern an Schulen (angestellte Lehrkräfte). Hessen hat mit dem TV-H einen eigenen Tarifvertrag. Für Beschäftigte von Bund und Kommunen gilt der TVöD, für Beamte die Besoldung.",
    },
    {
      q: "Wie lange dauert es bis zur nächsten Stufe?",
      a: "In der Regel ein Jahr in Stufe 1, zwei Jahre in Stufe 2, drei Jahre in Stufe 3, vier Jahre in Stufe 4 und fünf Jahre in Stufe 5 (§ 16 TV-L). Bei Einstellung mit einschlägiger Berufserfahrung kann direkt eine höhere Stufe zugeordnet werden.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="TV-L-Rechner 2026"
        url={URL}
        breadcrumbLabel="TV-L-Rechner"
        description="Kostenloser TV-L-Rechner: Brutto und Netto nach der amtlichen Entgelttabelle TV-L ab 01.04.2026, mit Teilzeit, Steuerklasse, Jahressonderzahlung und der Erhöhung zum 01.03.2027."
        faqs={faqs}
      />
      <TvlRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          TV-L Entgelttabelle 2026 mit Netto
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Monatsbrutto ab {TVL_GUELTIG_AB}, darunter das Netto in Steuerklasse I (ohne Kirchensteuer, mit Kindern,
          Ø-Zusatzbeitrag 2,9 %), Vollzeit.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-4">Gruppe</th>
                {[1, 2, 3, 4, 5, 6].map((s) => <th key={s} className="py-3 px-4 text-right">Stufe {s}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm">
              {TVL_2026.map((g) => (
                <tr key={g.slug}>
                  <td className="py-2.5 px-4 font-semibold whitespace-nowrap">{g.label}</td>
                  {g.stufen.map((v, i) => (
                    <td key={i} className="py-2.5 px-4 text-right font-mono whitespace-nowrap">
                      {v == null ? "—" : (
                        <>
                          {v.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                          <span className="block text-xs text-emerald-700">{netto(v).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle:{" "}
          <a href={TVL_QUELLE.url} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{TVL_QUELLE.titel}</a>
          ; Erhöhungsschritte laut{" "}
          <a href={TVL_EINIGUNG_URL} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">Tarifeinigung der Länder vom 14.02.2026</a>.
          Nicht enthalten: E 13Ü mit den Stufen 4a/4b sowie die Pflege- und S-Tabellen.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">TV-L, TVöD oder Beamte?</h2>
          <p>
            Der TV-L gilt bei den Ländern, der TVöD bei Bund und Kommunen — mit eigenen Tabellen und eigenen
            Sonderzahlungen. Im Vergleich zum{" "}
            <Link href="/tvoed-rechner" className="text-[#E60A1C] font-semibold hover:underline">TVöD-Rechner</Link> fällt
            vor allem die Jahressonderzahlung in den oberen Gruppen niedriger aus (E 14–15: 32,53 % gegenüber 85 % bei
            den Kommunen). Was davon im November netto ankommt, zeigt der{" "}
            <Link href="/jahressonderzahlung-rechner" className="text-[#E60A1C] font-semibold hover:underline">Jahressonderzahlung-Rechner</Link>.
          </p>
          <p>
            Wer verbeamtet ist, zahlt keine Sozialabgaben und bekommt Besoldung statt Tabellenentgelt — das Netto rechnet
            der{" "}
            <Link href="/brutto-netto-rechner-beamte" className="text-[#E60A1C] font-semibold hover:underline">Beamten-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum TV-L</h2>
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
