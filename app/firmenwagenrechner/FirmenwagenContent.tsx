import Link from "next/link";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

/**
 * Server-rendered SEO content for the Firmenwagenrechner. The worked example
 * uses the same geldwerter-Vorteil logic as the interactive calculator (1 % of
 * the Listenpreis + 0,03 % per Entfernungskilometer) and the shared engine to
 * quantify the extra tax/SV the private use actually costs. Nothing hardcoded.
 */
const BEISPIEL = {
  listenpreis: 45000,
  entfernungKm: 20,
  bruttoMonat: 4000,
};

function worked() {
  const gwvPrivat = BEISPIEL.listenpreis * 0.01; // 1%-Regelung
  const gwvPendler = BEISPIEL.listenpreis * 0.0003 * BEISPIEL.entfernungKm; // 0,03 % je km
  const gwv = gwvPrivat + gwvPendler;

  const ohne = calculateNetto({ bruttoMonat: BEISPIEL.bruttoMonat, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 });
  const mit = calculateNetto({ bruttoMonat: BEISPIEL.bruttoMonat + gwv, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 });

  const zusatzAbgaben =
    mit.steuer.summeMonat + mit.sv.summeMonat - (ohne.steuer.summeMonat + ohne.sv.summeMonat);

  return { gwvPrivat, gwvPendler, gwv, zusatzAbgaben, nettoOhne: ohne.nettoMonat };
}

export default function FirmenwagenContent() {
  const w = worked();

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="fw-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="fw-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Kurzantwort</h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Ein Firmenwagen zur Privatnutzung ist ein <strong className="text-[#16181D]">geldwerter Vorteil</strong>.
            Nach der <strong className="text-[#16181D]">1&nbsp;%-Regelung</strong> werden monatlich 1&nbsp;% des
            Bruttolistenpreises plus 0,03&nbsp;% je Entfernungskilometer für den Arbeitsweg zum Brutto
            hinzugerechnet – bei E-Autos gelten reduzierte Sätze von 0,25&nbsp;% oder 0,5&nbsp;%. Dadurch steigen
            Lohnsteuer und Sozialabgaben, und das Nettogehalt sinkt. Der Rechner oben zeigt den geldwerten Vorteil
            und die Auswirkung aufs Netto – unverbindlich, auf Basis der gesetzlichen Werte 2026.
          </p>
        </div>
      </section>

      {/* Worked example */}
      <section className="py-6" aria-labelledby="fw-beispiel">
        <h2 id="fw-beispiel" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Beispiel: Was kostet mich ein Firmenwagen?
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Listenpreis <strong className="text-[#16181D]">{formatEUR(BEISPIEL.listenpreis)}</strong>,
          1&nbsp;%-Regelung, {BEISPIEL.entfernungKm} km Arbeitsweg, Bruttogehalt{" "}
          <strong className="text-[#16181D]">{formatEUR(BEISPIEL.bruttoMonat)} / Monat</strong>, Steuerklasse&nbsp;I,
          2026. Berechnet mit derselben Engine wie der Rechner oben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm">
          <dl className="divide-y divide-black/10 text-sm sm:text-base">
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-black/70">Geldwerter Vorteil (1 % Listenpreis)</dt>
              <dd className="font-mono font-bold text-[#16181D]">{formatEUR(w.gwvPrivat)}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-black/70">Zuschlag Arbeitsweg (0,03 % × {BEISPIEL.entfernungKm} km)</dt>
              <dd className="font-mono font-bold text-[#16181D]">{formatEUR(w.gwvPendler)}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-4 bg-black/[0.03]">
              <dt className="text-black/80 font-semibold">Geldwerter Vorteil gesamt / Monat</dt>
              <dd className="font-mono font-extrabold text-[#16181D]">{formatEUR(w.gwv)}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-4 bg-emerald-50/60">
              <dt className="text-black/80 font-semibold">Zusätzliche Steuer + Sozialabgaben / Monat</dt>
              <dd className="font-mono font-extrabold text-emerald-700">{formatEUR(w.zusatzAbgaben)}</dd>
            </div>
          </dl>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Die reine private Nutzung kostet Sie also nicht den vollen geldwerten Vorteil, sondern die darauf
          anfallenden zusätzlichen Abgaben von rund {formatEUR(w.zusatzAbgaben)} im Monat. Unverbindliche Berechnung.
        </p>
      </section>

      {/* Erklärungen */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="fw-details">
        <h2 id="fw-details" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Listenpreis vs. Kaufpreis
        </h2>
        <p>
          Maßgeblich ist immer der <strong className="text-[#16181D]">Bruttolistenpreis</strong> zum Zeitpunkt der
          Erstzulassung – inklusive Sonderausstattung und Umsatzsteuer, abgerundet auf volle 100&nbsp;€. Der
          tatsächlich gezahlte <strong className="text-[#16181D]">Kaufpreis</strong> (etwa nach Rabatt oder als
          Gebrauchtwagen) spielt für die 1&nbsp;%-Regelung keine Rolle. Das ist wichtig, weil ein hoher
          Listenpreis den geldwerten Vorteil auch dann erhöht, wenn der Arbeitgeber den Wagen günstiger eingekauft hat.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Firmenwagen vs. Privatwagen</h3>
        <p>
          Ob sich ein Firmenwagen lohnt, hängt vom Verhältnis aus geldwertem Vorteil und ersparten Kosten für ein
          eigenes Auto ab. Faustregel: Je höher der Listenpreis und je kürzer der Arbeitsweg, desto teurer wird die
          Versteuerung im Verhältnis zum Nutzen. Bei einem E-Auto mit reduziertem Satz (0,25&nbsp;%) ist die
          Belastung deutlich geringer. Als Alternative zur pauschalen 1&nbsp;%-Regelung kann ein Fahrtenbuch
          sinnvoll sein, wenn der private Nutzungsanteil gering ist.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Einfluss auf das Nettogehalt</h3>
        <p>
          Der geldwerte Vorteil erhöht die Bemessungsgrundlage für Lohnsteuer und Sozialabgaben – nicht Ihr
          ausgezahltes Bargeld. Ihr reguläres Nettogehalt ohne Firmenwagen berechnen Sie mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>. Den
          Stundenlohn dahinter zeigt der{" "}
          <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">Stundenlohnrechner</Link>.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Firmenwagen aus Arbeitgebersicht</h3>
        <p>
          Für den Arbeitgeber ist der Firmenwagen Teil der Vergütung und der Personalkosten. Wie sich Gehalt und
          Sozialabgaben aus Arbeitgebersicht zusammensetzen, berechnen Sie mit dem{" "}
          <Link href="/arbeitgeber-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitgeberrechner</Link>.
        </p>
      </section>
    </div>
  );
}
