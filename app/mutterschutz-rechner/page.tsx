import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import MutterschutzRechner from "./MutterschutzRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { schutzfristen, mutterschaftsgeld, MUTTERSCHAFTSGELD_MAX_TAG, MUTTERSCHAFTSGELD_BAS_MAX } from "@/lib/mutterschutz";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/mutterschutz-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Mutterschutz-Rechner 2026: Fristen & Mutterschaftsgeld";
const DESCRIPTION =
  "Mutterschutz berechnen: Beginn 6 Wochen vor dem Termin, Ende 8 oder 12 Wochen danach, Mutterschaftsgeld der Krankenkasse (13 €/Tag) und Arbeitgeberzuschuss.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["mutterschutz rechner", "mutterschaftsgeld rechner", "mutterschutz berechnen", "mutterschutz beginn", "mutterschutz frühgeburt", "arbeitgeberzuschuss mutterschaftsgeld"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

/** Beispiel mit festem Termin, damit die statische Seite stabil bleibt. */
const BEISPIEL_ET = new Date(2027, 4, 15);
const GEHAELTER = [2000, 2500, 3000, 3500, 4000, 5000];

export default function Page() {
  const f = schutzfristen(BEISPIEL_ET, false);
  const d = (x: Date) => x.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const zeilen = GEHAELTER.map((b) => {
    const n = calculateNetto({ bruttoMonat: b, jahr: 2026, steuerklasse: 4, verheiratet: true, kinderlosUeber23: false, kirche: false }).nettoMonat;
    return { b, n, g: mutterschaftsgeld({ nettoMonat: n, fristen: f, gesetzlichVersichert: true }) };
  });

  const faqs = [
    {
      q: "Wann beginnt der Mutterschutz?",
      a: `Sechs Wochen vor dem errechneten Entbindungstermin laut ärztlichem Zeugnis oder Hebamme (§ 3 Abs. 1 MuSchG). Beispiel: Termin ${d(BEISPIEL_ET)} — Mutterschutz ab ${d(f.beginn)}. In dieser Zeit dürfen Sie nur arbeiten, wenn Sie es ausdrücklich wollen; die Erklärung können Sie jederzeit widerrufen.`,
    },
    {
      q: "Wie lange dauert der Mutterschutz nach der Geburt?",
      a: "Acht Wochen, bei Früh- und Mehrlingsgeburten zwölf Wochen. Ebenfalls zwölf Wochen auf Antrag, wenn innerhalb der ersten acht Wochen eine Behinderung des Kindes ärztlich festgestellt wird. Kommt das Kind vor dem Termin, verlängert sich die Frist nach der Geburt um die Tage, die vorher gefehlt haben — insgesamt gehen also keine Tage verloren.",
    },
    {
      q: "Wie viel Mutterschaftsgeld bekomme ich?",
      a: `Gesetzlich Versicherte bekommen von der Krankenkasse ihr kalendertägliches Netto der letzten drei abgerechneten Monate, höchstens ${MUTTERSCHAFTSGELD_MAX_TAG} € pro Tag. Den Rest bis zum vollen Netto zahlt der Arbeitgeber als Zuschuss (§ 20 MuSchG). Beispiel: ${formatEUR(zeilen[2].b)} brutto (Klasse IV) — ${formatEUR(zeilen[2].g.krankenkasse)} von der Kasse plus ${formatEUR(zeilen[2].g.arbeitgeber)} vom Arbeitgeber für ${f.tageGesamt} Tage.`,
    },
    {
      q: "Was bekommen privat Versicherte?",
      a: `Privat oder familienversicherte Frauen erhalten Mutterschaftsgeld vom Bundesamt für Soziale Sicherung — insgesamt höchstens ${MUTTERSCHAFTSGELD_BAS_MAX} € (§ 19 Abs. 2 MuSchG). Der Arbeitgeberzuschuss wird trotzdem nur in Höhe des Betrags über ${MUTTERSCHAFTSGELD_MAX_TAG} € pro Tag gezahlt, sodass eine Lücke bleibt. Wer privat ein Krankentagegeld versichert hat, bekommt es für die Schutzfristen und den Entbindungstag (§ 192 Abs. 5 VVG), soweit kein anderer angemessener Ersatz zusteht.`,
    },
    {
      q: "Muss ich Mutterschaftsgeld versteuern?",
      a: "Nein. Mutterschaftsgeld und Arbeitgeberzuschuss sind steuerfrei (§ 3 Nr. 1 Buchst. d EStG) und sozialabgabenfrei. Sie unterliegen aber dem Progressionsvorbehalt (§ 32b EStG): Sie erhöhen den Steuersatz auf das übrige Einkommen des Jahres, was zu einer Nachzahlung führen kann. Liegen solche Leistungen über 410 € im Jahr, ist eine Steuererklärung Pflicht (§ 46 Abs. 2 Nr. 1 EStG).",
    },
    {
      q: "Wird Mutterschaftsgeld auf das Elterngeld angerechnet?",
      a: "Ja, soweit es für die Zeit ab dem Tag der Geburt gezahlt wird (§ 3 Abs. 1 BEEG) — das gilt für das Mutterschaftsgeld der Krankenkasse und den Arbeitgeberzuschuss. Die Lebensmonate mit Mutterschutz nach der Geburt zählen deshalb als Elterngeldmonate der Mutter. Ausgenommen ist das Mutterschaftsgeld des Bundesamts für Soziale Sicherung.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Mutterschutz-Rechner"
        url={URL}
        breadcrumbLabel="Mutterschutz-Rechner"
        description="Kostenloser Mutterschutz-Rechner: Schutzfristen vor und nach der Entbindung (auch bei Früh- und Mehrlingsgeburt und nach einer Fehlgeburt), Mutterschaftsgeld der Krankenkasse und Arbeitgeberzuschuss — aus dem Brutto oder Netto."
        faqs={faqs}
      />
      <MutterschutzRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Mutterschaftsgeld nach Gehalt
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Gesetzlich versichert, Steuerklasse IV, Termin {d(BEISPIEL_ET)} ({f.tageGesamt} Tage, Bemessung Januar bis März
          2027). Netto mit dem Brutto-Netto-Rechner 2026.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Brutto / Monat</th>
                <th className="py-3.5 px-5 text-right">Netto / Tag</th>
                <th className="py-3.5 px-5 text-right">Krankenkasse</th>
                <th className="py-3.5 px-5 text-right">Arbeitgeber</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {zeilen.map((z) => (
                <tr key={z.b}>
                  <td className="py-3 px-5 font-mono font-semibold">{formatEUR(z.b)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(z.g.nettoKalendertag)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(z.g.krankenkasse)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(z.g.arbeitgeber)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(z.g.gesamt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Rechtsgrundlagen:{" "}
          <a href="https://www.gesetze-im-internet.de/muschg_2018/__3.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 3</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/muschg_2018/__19.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 19</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/muschg_2018/__20.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 20 MuSchG</a>,{" "}
          <a href="https://www.gesetze-im-internet.de/sgb_5/__24i.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 24i SGB V</a>.
          Einmalzahlungen wie Weihnachtsgeld zählen bei der Bemessung nicht mit (§ 21 MuSchG).
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Nach dem Mutterschutz: Elterngeld</h2>
          <p>
            Direkt im Anschluss folgt meist die Elternzeit. Wie viel Elterngeld Sie bekommen und wie das Mutterschaftsgeld
            darauf angerechnet wird, zeigt der{" "}
            <Link href="/elterngeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Elterngeld-Rechner</Link>.
            Ob sich vor der Geburt ein Wechsel der Steuerklasse lohnt, prüft der{" "}
            <Link href="/steuerklassenwechsel-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassenwechsel-Rechner</Link>{" "}
            — für das Elterngeld zählt grundsätzlich die Steuerklasse im letzten Monat vor dem Mutterschutz, eine frühere
            aber, wenn sie in den meisten Monaten des Bemessungszeitraums galt (§ 2c Abs. 3 BEEG). Ein Wechsel lohnt sich
            deshalb nur früh genug.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Mutterschutz</h2>
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
