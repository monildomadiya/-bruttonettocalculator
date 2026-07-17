import Link from "next/link";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

/**
 * Server-rendered SEO content for the Stundenlohnrechner. Explains both
 * conversion directions and provides an engine-based Monatsgehalt → Stundenlohn
 * reference table (brutto & netto), assuming a 40-hour week. Values from
 * calculateNetto so they match the interactive calculator.
 */
const STUNDEN_PRO_MONAT = (40 * 52) / 12; // 173,33 h bei 40-Stunden-Woche
const EXAMPLE_SALARIES = [2000, 2500, 3000, 3500, 4000, 4500];

function stundenlohnFor(bruttoMonat: number) {
  const netto = calculateNetto({
    bruttoMonat,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: 1,
  }).nettoMonat;
  return {
    bruttoMonat,
    bruttoStunde: bruttoMonat / STUNDEN_PRO_MONAT,
    nettoStunde: netto / STUNDEN_PRO_MONAT,
  };
}

export default function StundenlohnContent() {
  const rows = EXAMPLE_SALARIES.map(stundenlohnFor);

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="sl-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="sl-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Kurzantwort</h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Ihren <strong className="text-[#16181D]">Stundenlohn</strong> rechnen Sie so um: Multiplizieren Sie
            den Stundenlohn mit den Wochenstunden und mit 52 Wochen und teilen Sie durch 12 – das ergibt das
            Brutto-Monatsgehalt. Umgekehrt gilt: Monatsgehalt&nbsp;×&nbsp;12&nbsp;÷&nbsp;(Wochenstunden&nbsp;×&nbsp;52)
            = Stundenlohn. Wie viel davon netto pro Stunde bleibt, zeigt der Rechner oben – auf Basis der
            gesetzlichen Werte 2026, unverbindlich.
          </p>
        </div>
      </section>

      {/* Formeln */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="sl-formeln">
        <h2 id="sl-formeln" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Stundenlohn und Monatslohn umrechnen
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
            <div className="font-bold text-[#16181D] mb-2">Stundenlohn → Monatslohn</div>
            <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2">
              Monatslohn = Stundenlohn × Wochenstunden × 52 ÷ 12
            </p>
            <p className="text-xs text-black/55 mt-2">
              Bei einer 40-Stunden-Woche entspricht ein Monat rund {STUNDEN_PRO_MONAT.toFixed(2).replace(".", ",")} bezahlten Stunden.
            </p>
          </div>
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
            <div className="font-bold text-[#16181D] mb-2">Monatslohn → Stundenlohn</div>
            <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2">
              Stundenlohn = Monatslohn × 12 ÷ (Wochenstunden × 52)
            </p>
            <p className="text-xs text-black/55 mt-2">
              Für das Jahresgehalt multiplizieren Sie den Stundenlohn mit den Jahresstunden (Wochenstunden × 52).
            </p>
          </div>
        </div>
      </section>

      {/* Reverse table */}
      <section className="py-6" aria-labelledby="sl-tabelle">
        <h2 id="sl-tabelle" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Monatsgehalt in Stundenlohn: Beispiele
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Brutto- und Netto-Stundenlohn bei einer 40-Stunden-Woche (Steuerklasse&nbsp;I, ohne Kirchensteuer,
          2026). Berechnet mit derselben Engine wie der Rechner oben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Brutto / Stunde</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto / Stunde (SK I)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.bruttoMonat} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.bruttoMonat)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{formatEUR(r.bruttoStunde)}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-emerald-600 bg-emerald-50/60">{formatEUR(r.nettoStunde)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Unverbindliche Berechnung. Ihr Netto-Stundenlohn hängt von Steuerklasse, Bundesland und Freibeträgen ab.
        </p>
      </section>

      {/* Links */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-3" aria-labelledby="sl-links">
        <h2 id="sl-links" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Brutto oder netto?</h2>
        <p>
          Der <strong className="text-[#16181D]">Brutto-Stundenlohn</strong> ist die Basis für Ihren Arbeitsvertrag,
          der <strong className="text-[#16181D]">Netto-Stundenlohn</strong> zeigt, was tatsächlich pro Stunde übrig
          bleibt. Ihr vollständiges Nettogehalt berechnen Sie mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>. Ob Ihr
          Stundenlohn über dem gesetzlichen Minimum liegt, prüfen Sie mit dem{" "}
          <Link href="/mindestlohn" className="text-[#E60A1C] font-semibold hover:underline">Mindestlohn-Rechner</Link>.
          Für Teilzeit lohnt sich der{" "}
          <Link href="/teilzeitrechner" className="text-[#E60A1C] font-semibold hover:underline">Teilzeitrechner</Link>.
        </p>
      </section>
    </div>
  );
}
