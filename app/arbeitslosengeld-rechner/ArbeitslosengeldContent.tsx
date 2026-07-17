import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

/**
 * Server-rendered SEO content for the ALG-1 page. Examples use the same
 * Bundesagentur-style method as the interactive calculator: Bemessungsentgelt
 * (gross, capped at the RV/ALV BBG) → pauschaliertes Leistungsentgelt (minus a
 * flat 20 % SV lump sum and the fictive Lohnsteuer from the engine, no church
 * tax) → Leistungssatz 60 % / 67 %. Nothing hardcoded.
 */
const RV_ALV_BBG_MONAT = 101400 / 12; // 8.450 €

function algExample(brutto: number) {
  const bemessung = Math.min(brutto, RV_ALV_BBG_MONAT);
  const steuer = calculateNetto({
    bruttoMonat: bemessung,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: 1,
  }).steuer.summeMonat;
  const leistungsentgelt = Math.max(0, bemessung - bemessung * 0.2 - steuer);
  return {
    brutto,
    bemessung,
    leistungsentgelt,
    alg60: leistungsentgelt * 0.6,
    alg67: leistungsentgelt * 0.67,
  };
}

const EXAMPLE_SALARIES = [2500, 3500, 4500];

const BA_SOURCE = "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld";

export default function ArbeitslosengeldContent() {
  const rows = EXAMPLE_SALARIES.map(algExample);

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="alg-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="alg-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Kurzantwort</h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Das <strong className="text-[#16181D]">Arbeitslosengeld I</strong> beträgt{" "}
            <strong className="text-[#16181D]">60&nbsp;%</strong> Ihres pauschalierten Leistungsentgelts – mit
            mindestens einem Kind <strong className="text-[#16181D]">67&nbsp;%</strong>. Grundlage ist nicht Ihr
            Kontonetto, sondern ein <strong className="text-[#16181D]">Bemessungsentgelt</strong> (Ihr Brutto der
            letzten 12 Monate, gedeckelt auf die Beitragsbemessungsgrenze), von dem eine 20-%-Sozialpauschale und
            die fiktive Lohnsteuer abgezogen werden. Der Rechner oben liefert eine unverbindliche Orientierung;
            die verbindliche Höhe legt die Bundesagentur für Arbeit fest.
          </p>
        </div>
      </section>

      {/* Wie berechnet */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="alg-methode">
        <h2 id="alg-methode" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Wie wird Arbeitslosengeld berechnet?
        </h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong className="text-[#16181D]">Bemessungsentgelt:</strong> Ihr beitragspflichtiges Bruttoentgelt der letzten 12 Monate, geteilt durch die Kalendertage – gedeckelt auf die Beitragsbemessungsgrenze (2026: 8.450&nbsp;€/Monat).</li>
          <li><strong className="text-[#16181D]">Leistungsentgelt:</strong> Bemessungsentgelt minus 20&nbsp;% Sozialversicherungspauschale, fiktive Lohnsteuer (nach Steuerklasse) und Solidaritätszuschlag.</li>
          <li><strong className="text-[#16181D]">Leistungssatz:</strong> 60&nbsp;% des Leistungsentgelts, mit mindestens einem Kind 67&nbsp;%.</li>
        </ol>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">60 % oder 67 % Leistungssatz</h3>
        <p>
          Den <strong className="text-[#16181D]">erhöhten Leistungssatz von 67&nbsp;%</strong> erhalten Sie, wenn
          Sie oder Ihr Ehe-/Lebenspartner mindestens ein Kind im Sinne des Einkommensteuerrechts haben. Andernfalls
          gilt der <strong className="text-[#16181D]">allgemeine Leistungssatz von 60&nbsp;%</strong>. Die Steuerklasse
          beeinflusst die fiktive Lohnsteuer und damit die Höhe des Leistungsentgelts – nicht aber den Prozentsatz.
        </p>
      </section>

      {/* Beispielrechnungen */}
      <section className="py-6" aria-labelledby="alg-beispiele">
        <h2 id="alg-beispiele" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Beispielrechnungen: ALG I nach Bruttogehalt
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Werte für Steuerklasse&nbsp;I, Steuerjahr 2026. Berechnet mit derselben Engine wie der Rechner oben –
          voraussichtliches Ergebnis, die tatsächliche Abrechnung der Bundesagentur kann abweichen.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Leistungsentgelt</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">ALG I (60 %)</th>
                <th className="py-4 px-5 text-right">ALG I mit Kind (67 %)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{formatEUR(r.leistungsentgelt)}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-emerald-600 bg-emerald-50/60">{formatEUR(r.alg60)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/80">{formatEUR(r.alg67)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">Unverbindliche Berechnung – keine Rechtsgrundlage.</p>
      </section>

      {/* Anspruchsdauer + Kinder/Steuerklasse */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="alg-dauer">
        <h2 id="alg-dauer" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Anspruchsdauer</h2>
        <p>
          Wie lange Sie ALG&nbsp;I beziehen, hängt von Ihrem Alter und der Dauer der versicherungspflichtigen
          Beschäftigung ab – von <strong className="text-[#16181D]">6 Monaten</strong> (mindestens 12 Monate
          versichert) bis zu <strong className="text-[#16181D]">24 Monaten</strong> (ab 58 Jahren mit
          entsprechend langer Beschäftigung). Voraussetzung ist eine Anwartschaftszeit von mindestens 12 Monaten
          innerhalb der letzten 30 Monate.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Einfluss von Kindern und Steuerklasse</h3>
        <p>
          Ein Kind hebt den Leistungssatz von 60&nbsp;% auf 67&nbsp;% an. Die Steuerklasse wirkt sich über die
          fiktive Lohnsteuer auf das Leistungsentgelt aus: Wählen Sie oben Ihre Steuerklasse, um den Effekt zu
          sehen. Ein <Link href="/steuerklassen" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassenwechsel</Link>{" "}
          vor der Arbeitslosigkeit kann das ALG&nbsp;I beeinflussen.
        </p>
        <p className="text-sm">
          <a href={BA_SOURCE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#E60A1C] font-semibold hover:underline">
            <ExternalLink size={14} /> Offizielle Informationen der Bundesagentur für Arbeit
          </a>
        </p>
      </section>
    </div>
  );
}
