import Link from "next/link";
import { calculateArbeitgeberkosten, calculateNetto, formatEUR } from "@/lib/taxCalculator";

/**
 * Server-rendered SEO content for the Arbeitgeberrechner page.
 * Employer costs come from calculateArbeitgeberkosten and the employee net from
 * calculateNetto — both use the central RECHENGROESSEN_2026 constants, so the
 * examples stay consistent with the interactive calculator. Nothing hardcoded.
 */
const EXAMPLE_SALARIES = [3000, 4000, 5000];

export default function ArbeitgeberContent() {
  const rows = EXAMPLE_SALARIES.map((brutto) => {
    const ag = calculateArbeitgeberkosten(brutto, true);
    const employee = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: false,
      kinderlosUeber23: false,
      kirche: false,
      steuerklasse: 1,
    });
    return { brutto, ag, netto: employee.nettoMonat };
  });

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="ag-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ag-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Kurzantwort</h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Ein Mitarbeiter kostet den Arbeitgeber deutlich mehr als sein Bruttogehalt. Zusätzlich trägt der
            Betrieb den <strong className="text-[#16181D]">Arbeitgeberanteil</strong> zur Sozialversicherung
            (rund <strong className="text-[#16181D]">21&nbsp;%</strong> des Bruttos) sowie die Umlagen U1, U2 und
            U3 (ca. 1,9&nbsp;%). Aus 4.000&nbsp;€ Brutto werden so rund 4.900&nbsp;€ Gesamtkosten. Der Rechner oben
            zeigt Arbeitgeberbrutto und Gesamtkosten – auf Basis der gesetzlichen Werte für 2026, unverbindlich.
          </p>
        </div>
      </section>

      {/* Vier Begriffe */}
      <section className="py-6" aria-labelledby="ag-begriffe">
        <h2 id="ag-begriffe" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Bruttogehalt, Nettogehalt, Arbeitgeberbrutto und Personalkosten
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Vier Begriffe, die oft verwechselt werden – hier die klare Abgrenzung:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { t: "Bruttogehalt", d: "Der vereinbarte Lohn des Arbeitnehmers vor Abzügen – Basis für Steuern und Sozialabgaben." },
            { t: "Nettogehalt", d: "Das, was beim Arbeitnehmer nach Lohnsteuer, Soli, ggf. Kirchensteuer und dem Arbeitnehmeranteil zur Sozialversicherung auf dem Konto ankommt." },
            { t: "Arbeitgeberbrutto", d: "Bruttogehalt plus Arbeitgeberanteil zur Sozialversicherung – die Kosten ohne Umlagen." },
            { t: "Gesamte Personalkosten", d: "Arbeitgeberbrutto plus Umlagen (U1/U2/U3) und ggf. weitere Lohnnebenkosten – die tatsächliche Belastung des Betriebs." },
          ].map((b) => (
            <div key={b.t} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
              <div className="font-bold text-[#16181D] mb-1">{b.t}</div>
              <div className="text-sm text-black/65 leading-relaxed">{b.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Beispielrechnung */}
      <section className="py-6" aria-labelledby="ag-beispiele">
        <h2 id="ag-beispiele" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Beispielrechnung: Arbeitgeberkosten pro Monat
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Arbeitgeberanteil, Arbeitgeberbrutto und Gesamtkosten für gängige Gehälter. Das Arbeitnehmer-Netto in
          der letzten Spalte gilt für Steuerklasse&nbsp;I ohne Kirchensteuer. Berechnet mit derselben Engine wie
          der Rechner oben; die tatsächliche Abrechnung kann je nach Kasse und Umlagesatz abweichen.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">AG-Anteil SV</th>
                <th className="py-4 px-5 text-right">Umlagen (ca.)</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Gesamtkosten AG</th>
                <th className="py-4 px-5 text-right">AN-Netto (SK I)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">+{formatEUR(r.ag.ag.summeMonat)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">+{formatEUR(r.ag.umlagenMonat)}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-[#16181D] bg-black/[0.03]">{formatEUR(r.ag.gesamtkostenMonat)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600">{formatEUR(r.netto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Auf ein Jahr gerechnet entsprechen die Gesamtkosten dem Zwölffachen der Monatswerte. Unverbindliche
          Berechnung nach den SV-Rechengrößen 2026; Umlagesätze sind kassenabhängig geschätzt (ca. 1,9&nbsp;%).
        </p>
      </section>

      {/* Erklärungen */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="ag-anteile">
        <h2 id="ag-anteile" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Arbeitgeberanteile zur Sozialversicherung
        </h2>
        <p>
          Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung werden seit der Wiederherstellung der Parität
          grundsätzlich <strong className="text-[#16181D]">hälftig</strong> von Arbeitnehmer und Arbeitgeber
          getragen. Der Arbeitgeber zahlt seinen Anteil zusätzlich zum Bruttogehalt – bis zur jeweiligen
          Beitragsbemessungsgrenze (2026: 69.750&nbsp;€ in KV/PV, 101.400&nbsp;€ in RV/ALV). Oberhalb dieser
          Grenzen steigt der Beitrag nicht weiter.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Weitere Lohnnebenkosten</h3>
        <p>
          Über die reine Sozialversicherung hinaus kommen die Umlagen U1 (Entgeltfortzahlung im Krankheitsfall),
          U2 (Mutterschaftsaufwendungen) und U3 (Insolvenzgeldumlage) hinzu. Je nach Betrieb und Krankenkasse
          machen sie zusammen rund 1,5–2&nbsp;% aus. Nicht enthalten sind freiwillige Leistungen wie
          betriebliche Altersvorsorge, Zuschüsse oder Sachbezüge.
        </p>
        <p>
          Aus Arbeitnehmersicht berechnen Sie Ihr Nettogehalt mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>. Für
          gezielte Umrechnungen eignen sich der{" "}
          <Link href="/rechner/brutto-zu-netto" className="text-[#E60A1C] font-semibold hover:underline">Brutto-zu-Netto-Rechner</Link>{" "}
          und der{" "}
          <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-zu-Brutto-Rechner</Link>.
          Den Stundenlohn hinter einem Gehalt ermitteln Sie mit dem{" "}
          <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">Stundenlohnrechner</Link>.
        </p>
      </section>
    </div>
  );
}
