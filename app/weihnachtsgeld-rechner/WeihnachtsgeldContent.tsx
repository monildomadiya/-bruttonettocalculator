import Link from "next/link";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";

/**
 * Server-rendered SEO content for the Weihnachtsgeld page (crawlable, no JS).
 * All numbers come from the shared calculation engine so they stay consistent
 * with the interactive calculator — nothing is hardcoded.
 *
 * Weihnachtsgeld is a "sonstiger Bezug": the tax/SV on it is the *marginal*
 * effect of adding it to the annual income. We model that by comparing the
 * engine's annual net at base salary vs. base salary + Weihnachtsgeld/12.
 */
const BASE_MONTHLY = 3500; // Annahme: reguläres Bruttogehalt / Monat
const BASE_SK: Steuerklasse = 1;

function marginalNetto(bonus: number) {
  const base = calculateNetto({
    bruttoMonat: BASE_MONTHLY,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: BASE_SK,
  });
  const withBonus = calculateNetto({
    bruttoMonat: BASE_MONTHLY + bonus / 12,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: BASE_SK,
  });
  const steuer = withBonus.steuer.summeJahr - base.steuer.summeJahr;
  const sv = withBonus.sv.summeJahr - base.sv.summeJahr;
  const netto = bonus - steuer - sv;
  return { bonus, steuer, sv, netto, quote: bonus > 0 ? (netto / bonus) * 100 : 0 };
}

const EXAMPLE_AMOUNTS = [500, 1000, 1500, 2000];

export default function WeihnachtsgeldContent() {
  const examples = EXAMPLE_AMOUNTS.map(marginalNetto);

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Vom <strong className="text-[#16181D]">Weihnachtsgeld</strong> bleiben je nach Steuerklasse und Höhe
            des laufenden Gehalts meist rund <strong className="text-[#16181D]">50–65&nbsp;%</strong> netto übrig.
            Weihnachtsgeld gilt steuerlich als <strong className="text-[#16181D]">sonstiger Bezug</strong>: Es wird
            dem Jahreseinkommen hinzugerechnet und mit dem persönlichen Grenzsteuersatz belastet, zusätzlich fallen
            Sozialabgaben an, solange die Beitragsbemessungsgrenze nicht überschritten ist. Der Rechner oben zeigt
            Ihren individuellen Netto-Betrag – unverbindlich und auf Basis der gesetzlichen Werte für 2026.
          </p>
        </div>
      </section>

      {/* Beispielrechnungen */}
      <section className="py-6" aria-labelledby="beispiele">
        <h2 id="beispiele" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Beispielrechnungen: Weihnachtsgeld netto
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Alle Werte auf Basis eines regulären Bruttogehalts von{" "}
          <strong className="text-[#16181D]">{formatEUR(BASE_MONTHLY)} / Monat</strong>,{" "}
          <strong className="text-[#16181D]">Steuerklasse&nbsp;I</strong>, ohne Kirchensteuer, ohne
          Kinderfreibeträge, Steuerjahr 2026. Berechnet mit derselben Engine wie der Rechner oben – Ihre
          tatsächliche Abrechnung kann je nach Bundesland, Kasse und Freibeträgen abweichen.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Weihnachtsgeld (brutto)</th>
                <th className="py-4 px-5 text-right">Steuer</th>
                <th className="py-4 px-5 text-right">Sozialabgaben</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto</th>
                <th className="py-4 px-5 text-right">Netto-Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {examples.map((e) => (
                <tr key={e.bonus} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(e.bonus)}</td>
                  <td className="py-4 px-5 text-right text-rose-600 font-mono">−{formatEUR(e.steuer)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">−{formatEUR(e.sv)}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-emerald-600 bg-emerald-50/60">{formatEUR(e.netto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{e.quote.toFixed(0)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Unverbindliche Berechnung nach § 32a EStG und den SV-Rechengrößen 2026. Keine Steuerberatung.
        </p>
      </section>

      {/* Wie wird Weihnachtsgeld versteuert? */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="versteuerung">
        <h2 id="versteuerung" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Wie wird Weihnachtsgeld versteuert?
        </h2>
        <p>
          Weihnachtsgeld ist ein <strong className="text-[#16181D]">sonstiger Bezug</strong>. Der Arbeitgeber
          berechnet die Lohnsteuer darauf nach der sogenannten Jahresmethode: Er ermittelt die Lohnsteuer auf das
          voraussichtliche Jahresgehalt <strong className="text-[#16181D]">mit</strong> und{" "}
          <strong className="text-[#16181D]">ohne</strong> Weihnachtsgeld. Die Differenz ist die Steuer, die auf
          die Sonderzahlung entfällt. Genau diese Logik bildet der Rechner oben ab.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Warum wird Weihnachtsgeld scheinbar höher besteuert?</h3>
        <p>
          Das Weihnachtsgeld kommt <em>zusätzlich</em> zum laufenden Gehalt und wird deshalb mit Ihrem
          persönlichen <strong className="text-[#16181D]">Grenzsteuersatz</strong> belastet – nicht mit dem
          niedrigeren Durchschnittssteuersatz. Dadurch wirkt die Abgabenlast auf die Sonderzahlung höher als auf
          das normale Monatsgehalt. Zu viel gezahlte Lohnsteuer holen sich viele Arbeitnehmer über die
          Einkommensteuererklärung teilweise zurück, wenn die tatsächliche Jahressteuer niedriger ausfällt.
        </p>
      </section>

      {/* Einfluss der Steuerklasse */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="steuerklasse">
        <h2 id="steuerklasse" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Einfluss der Steuerklasse
        </h2>
        <p>
          Die Steuerklasse bestimmt, wie viel Lohnsteuer monatlich einbehalten wird – und damit auch, wie hoch der
          Abzug auf das Weihnachtsgeld ausfällt. In <strong className="text-[#16181D]">Steuerklasse&nbsp;III</strong>{" "}
          bleibt vom Weihnachtsgeld tendenziell mehr netto übrig als in{" "}
          <strong className="text-[#16181D]">Steuerklasse&nbsp;V</strong> oder{" "}
          <strong className="text-[#16181D]">VI</strong>. Wählen Sie im Rechner oben Ihre Steuerklasse aus, um den
          Unterschied direkt zu sehen. Einen vollständigen Überblick bietet unsere Seite{" "}
          <Link href="/steuerklassen" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassen im Vergleich</Link>.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Weihnachtsgeld und reguläres Monatsgehalt</h3>
        <p>
          Ob sich Weihnachtsgeld „lohnt“, hängt vom laufenden Gehalt ab: Liegt Ihr Jahreseinkommen inklusive
          Sonderzahlung noch unter der Beitragsbemessungsgrenze, fallen die vollen Sozialabgaben an. Überschreiten
          Sie mit dem Weihnachtsgeld die Grenze (2026: 101.400 € in der Renten-/Arbeitslosenversicherung,
          69.750 € in Kranken-/Pflegeversicherung), bleibt vom übersteigenden Teil relativ mehr netto übrig. Ihr
          reguläres Nettogehalt berechnen Sie mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Weihnachtsgeld vs. Bonus</h3>
        <p>
          Steuerlich gibt es keinen Unterschied: Weihnachtsgeld, Urlaubsgeld, 13.&nbsp;Monatsgehalt und ein
          Jahresbonus werden alle als sonstiger Bezug behandelt. Für die kombinierte Berechnung von Urlaubs- und
          Weihnachtsgeld oder eines Bonus nutzen Sie den{" "}
          <Link href="/bonus-steuerrechner" className="text-[#E60A1C] font-semibold hover:underline">Bonus-Steuerrechner</Link>.
          Aus Arbeitgebersicht erhöhen Sonderzahlungen die gesamten Lohnkosten – diese berechnen Sie mit dem{" "}
          <Link href="/arbeitgeber-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitgeberrechner</Link>.
        </p>
      </section>
    </div>
  );
}
