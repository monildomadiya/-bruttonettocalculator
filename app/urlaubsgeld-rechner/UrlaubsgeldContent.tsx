import Link from "next/link";
import { calculateNetto, estFormel2026, soliBerechnen, formatEUR, BBG_2026 } from "@/lib/taxCalculator";

/**
 * Server-gerenderter SEO-Block für den Urlaubsgeld-Rechner. Die Referenztabelle
 * wird mit derselben Engine berechnet wie der interaktive Rechner, damit die
 * Zahlen auf der Seite nicht auseinanderlaufen.
 */
const BEISPIELE = [
  { brutto: 2500, urlaubsgeld: 1000 },
  { brutto: 3000, urlaubsgeld: 1500 },
  { brutto: 3500, urlaubsgeld: 1500 },
  { brutto: 4500, urlaubsgeld: 2000 },
  { brutto: 5500, urlaubsgeld: 2500 },
];

/** Netto einer Einmalzahlung in Steuerklasse I, ohne Kirchensteuer, 2026. */
function urlaubsgeldNetto(bruttoMonat: number, urlaubsgeld: number) {
  const regulaer = calculateNetto({
    bruttoMonat,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: 1,
  });

  const bruttoJahr = bruttoMonat * 12;
  const kvPvBasis = Math.max(0, Math.min(urlaubsgeld, BBG_2026.kvPvJahr - bruttoJahr));
  const rvAlvBasis = Math.max(0, Math.min(urlaubsgeld, BBG_2026.rvAlvJahr - bruttoJahr));
  const sv =
    kvPvBasis * (BBG_2026.anSatzKv + BBG_2026.anSatzPv) +
    rvAlvBasis * (BBG_2026.anSatzRv + BBG_2026.anSatzAlv);

  const zvEOhne = regulaer.steuer.zvE;
  const zvEMit = zvEOhne + Math.max(0, urlaubsgeld - sv);
  const estOhne = estFormel2026(Math.max(0, zvEOhne));
  const estMit = estFormel2026(Math.max(0, zvEMit));
  const steuer = estMit + soliBerechnen(estMit, false) - (estOhne + soliBerechnen(estOhne, false));

  const netto = urlaubsgeld - steuer - sv;
  return {
    bruttoMonat,
    urlaubsgeld,
    steuer,
    sv,
    netto,
    quote: urlaubsgeld > 0 ? (netto / urlaubsgeld) * 100 : 0,
  };
}

export default function UrlaubsgeldContent() {
  const rows = BEISPIELE.map((b) => urlaubsgeldNetto(b.brutto, b.urlaubsgeld));

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="ug-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ug-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Vom <strong className="text-[#16181D]">Urlaubsgeld</strong> bleiben je nach Steuerklasse und
            Gehalt typischerweise <strong className="text-[#16181D]">50–65 % netto</strong> übrig. Grund:
            Urlaubsgeld ist ein „sonstiger Bezug“ und wird dem Jahreseinkommen hinzugerechnet — es trifft
            damit Ihren Grenzsteuersatz statt des niedrigeren Durchschnittssteuersatzes. Zusätzlich fallen
            Sozialabgaben an, allerdings nur bis zur Beitragsbemessungsgrenze. Ein gesetzlicher Anspruch
            auf Urlaubsgeld besteht nicht — er ergibt sich nur aus Vertrag, Tarif oder betrieblicher Übung.
          </p>
        </div>
      </section>

      {/* So wird gerechnet */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ug-berechnung"
      >
        <h2 id="ug-berechnung" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Urlaubsgeld berechnen: So funktioniert die Jahresmethode
        </h2>
        <p>
          Anders als beim laufenden Lohn wird die Steuer auf Sonderzahlungen nicht über die
          Monatstabelle ermittelt. Der Arbeitgeber rechnet stattdessen zweimal die
          <strong className="text-[#16181D]"> Jahreslohnsteuer</strong> — einmal ohne und einmal mit
          Urlaubsgeld. Die Differenz ist die Lohnsteuer auf die Sonderzahlung.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
          <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2 mb-3">
            Steuer = Jahreslohnsteuer(Jahreslohn + Urlaubsgeld) − Jahreslohnsteuer(Jahreslohn)
          </p>
          <p className="text-black/65 text-sm">
            Weil das Urlaubsgeld „oben drauf“ kommt, wird es mit dem höchsten für Sie geltenden Steuersatz
            belastet. Genau deshalb wirkt die Abzugsquote auf der Abrechnung oft überraschend hoch —
            es ist kein Fehler, sondern die Steuerprogression.
          </p>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D] pt-2">
          Sozialabgaben nur bis zur Beitragsbemessungsgrenze
        </h3>
        <p>
          Auf das Urlaubsgeld fallen Beiträge zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung
          an — aber nur, soweit Ihr Jahresentgelt die jeweilige Grenze noch nicht erreicht hat. 2026 liegt
          die Beitragsbemessungsgrenze bei{" "}
          <strong className="text-[#16181D]">{formatEUR(BBG_2026.kvPvJahr)}</strong> für Kranken- und
          Pflegeversicherung und bei{" "}
          <strong className="text-[#16181D]">{formatEUR(BBG_2026.rvAlvJahr)}</strong> für Renten- und
          Arbeitslosenversicherung. Wer bereits darüber liegt, bekommt vom Urlaubsgeld spürbar mehr netto
          ausgezahlt als ein Durchschnittsverdiener. Details dazu im{" "}
          <Link
            href="/beitragsbemessungsgrenze-2026"
            className="text-[#E60A1C] font-semibold hover:underline"
          >
            Überblick zur Beitragsbemessungsgrenze 2026
          </Link>
          .
        </p>
      </section>

      {/* Referenztabelle */}
      <section className="py-6" aria-labelledby="ug-tabelle">
        <h2 id="ug-tabelle" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Urlaubsgeld netto: Beispiele 2026
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Steuerklasse&nbsp;I, ohne Kirchensteuer, keine Kinder. Berechnet mit derselben Engine wie der
          Rechner oben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Urlaubsgeld</th>
                <th className="py-4 px-5 text-right">Steuer</th>
                <th className="py-4 px-5 text-right">Sozialabgaben</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.bruttoMonat} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.bruttoMonat)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{formatEUR(r.urlaubsgeld)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/60">− {formatEUR(r.steuer)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/60">− {formatEUR(r.sv)}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-emerald-600 bg-emerald-50/60">
                    {formatEUR(r.netto)}
                    <span className="block text-[11px] font-normal text-black/45">
                      {r.quote.toFixed(0)} %
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Unverbindliche Orientierung. Der tatsächliche Betrag hängt von Steuerklasse, Bundesland,
          Kirchensteuer, Krankenkassen-Zusatzbeitrag und Freibeträgen ab.
        </p>
      </section>

      {/* Urlaubsgeld vs Urlaubsentgelt */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ug-abgrenzung"
      >
        <h2 id="ug-abgrenzung" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Urlaubsgeld oder Urlaubsentgelt?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
            <div className="font-bold text-[#16181D] mb-2">Urlaubsentgelt</div>
            <p className="text-sm text-black/70">
              Ihr <strong className="text-[#16181D]">normales Gehalt</strong>, das während des Urlaubs
              weitergezahlt wird. Gesetzlich garantiert nach § 11 BUrlG und wie laufender Arbeitslohn
              versteuert.
            </p>
          </div>
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
            <div className="font-bold text-[#16181D] mb-2">Urlaubsgeld</div>
            <p className="text-sm text-black/70">
              Eine <strong className="text-[#16181D]">freiwillige Sonderzahlung</strong> obendrauf. Kein
              gesetzlicher Anspruch — nur aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung oder
              betrieblicher Übung. Versteuerung als sonstiger Bezug.
            </p>
          </div>
        </div>
        <p>
          Wurde Urlaubsgeld mindestens dreimal in Folge vorbehaltlos gezahlt, kann daraus eine{" "}
          <strong className="text-[#16181D]">betriebliche Übung</strong> entstehen — dann besteht auch
          künftig ein Anspruch. Arbeitgeber vermeiden das üblicherweise durch einen ausdrücklichen
          Freiwilligkeitsvorbehalt.
        </p>
      </section>

      {/* Interne Verlinkung */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-3"
        aria-labelledby="ug-links"
      >
        <h2 id="ug-links" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Passende Rechner
        </h2>
        <p>
          Das <strong className="text-[#16181D]">Weihnachtsgeld</strong> wird nach denselben Regeln
          besteuert — dafür gibt es den{" "}
          <Link href="/weihnachtsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Weihnachtsgeld-Rechner
          </Link>
          . Für Boni und variable Vergütung passt der{" "}
          <Link href="/bonus-steuerrechner" className="text-[#E60A1C] font-semibold hover:underline">
            Bonus-Steuerrechner
          </Link>
          , bei einer Abfindung greift dagegen die günstigere Fünftelregelung im{" "}
          <Link href="/abfindungsrechner" className="text-[#E60A1C] font-semibold hover:underline">
            Abfindungsrechner
          </Link>
          . Ihr laufendes Nettogehalt berechnen Sie mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">
            Brutto-Netto-Rechner
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
