import { calculateNetto } from "@/lib/taxCalculator";
import { skala, linie, flaeche, kurzEuro, euro, type Punkt } from "./chartUtils";

/**
 * Netto-Differenz pro Monat zwischen dem geltenden Tarif 2026 und dem
 * Referentenentwurf EStRefG 2027, aufgetragen über dem Bruttomonatsgehalt.
 *
 * Warum genau diese Größe: Ein Vergleich der beiden Durchschnittssteuersätze
 * ergäbe zwei fast deckungsgleiche Kurven (bei 3.000 € brutto 12,49 % gegen
 * 12,22 %) — optisch eine Nullaussage. Die *Differenz* ist die Zahl, nach der
 * Nutzer suchen, und sie hat einen Vorzeichenwechsel: Durch die neue
 * 47-%-Zone ab 280.000 € zu versteuerndem Einkommen entlastet der Entwurf
 * mittlere Einkommen und belastet sehr hohe. Diese Kurve zeigt beides.
 *
 * Alle Werte stammen aus `calculateNetto` — es gibt hier keine fest
 * verdrahteten Zahlen, die von der Engine abweichen könnten.
 */

const BREITE = 760;
const HOEHE = 340;
const RAND = { oben: 24, rechts: 20, unten: 48, links: 56 };

const PLOT_B = BREITE - RAND.links - RAND.rechts;
const PLOT_H = HOEHE - RAND.oben - RAND.unten;

/** Bruttomonatsgehalt von 1.500 € bis 26.000 € — deckt den Vorzeichenwechsel ab. */
const VON = 1500;
const BIS = 26000;
const SCHRITTE = 130;

type Szenario = "entwurf2027" | "stufe2028";

function differenzProMonat(bruttoMonat: number, szenario: Szenario): number {
  const basis = {
    bruttoMonat,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1 as const,
  };
  const alt = calculateNetto({ ...basis, jahr: 2026 });
  const neu = calculateNetto({ ...basis, jahr: 2027, szenario });
  return neu.nettoMonat - alt.nettoMonat;
}

function reihe(szenario: Szenario): Punkt[] {
  const punkte: Punkt[] = [];
  for (let i = 0; i <= SCHRITTE; i++) {
    const x = VON + ((BIS - VON) * i) / SCHRITTE;
    punkte.push({ x, y: differenzProMonat(x, szenario) });
  }
  return punkte;
}

export default function EntlastungsKurve() {
  const daten2027 = reihe("entwurf2027");
  const daten2028 = reihe("stufe2028");

  const alleY = [...daten2027, ...daten2028].map((p) => p.y);
  const yMax = Math.ceil(Math.max(...alleY) / 10) * 10 + 5;
  const yMin = Math.floor(Math.min(...alleY) / 10) * 10 - 5;

  const sx = skala([VON, BIS], [RAND.links, RAND.links + PLOT_B]);
  const sy = skala([yMin, yMax], [RAND.oben + PLOT_H, RAND.oben]);

  const px = (d: Punkt[]) => d.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
  const pfad2027 = px(daten2027);
  const pfad2028 = px(daten2028);
  const nullY = sy(0);

  // Kennpunkte für die Beschriftung: das Maximum und der Vorzeichenwechsel.
  const maximum = daten2027.reduce((a, b) => (b.y > a.y ? b : a));
  const wechsel = daten2027.find((p) => p.y < 0);

  const xTicks = [2000, 6000, 10000, 14000, 18000, 22000, 26000];
  const yTicks: number[] = [];
  for (let v = Math.ceil(yMin / 20) * 20; v <= yMax; v += 20) yTicks.push(v);

  const titelId = "entlastungskurve-titel";
  const beschreibungId = "entlastungskurve-beschreibung";

  return (
    <figure className="w-full my-8">
      <figcaption className="mb-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2">
          Wie viel mehr Netto bringt der Entwurf — nach Gehalt?
        </h3>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed">
          Differenz zum geltenden Tarif 2026, in Euro pro Monat, Steuerklasse&nbsp;I ohne Kinder und
          ohne Kirchensteuer. Oberhalb der Nulllinie entlastet der Entwurf, unterhalb belastet er.
        </p>
      </figcaption>

      <div className="bg-white border border-black/[0.10] rounded-3xl p-4 sm:p-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${BREITE} ${HOEHE}`}
          className="w-full h-auto min-w-[520px]"
          role="img"
          aria-labelledby={`${titelId} ${beschreibungId}`}
        >
          <title id={titelId}>
            Netto-Differenz pro Monat zwischen Tarif 2026 und dem Referentenentwurf 2027
          </title>
          <desc id={beschreibungId}>
            Die Entlastung steigt von rund {euro(daten2027[0].y)} Euro bei {kurzEuro(VON)} Euro
            brutto auf höchstens {euro(maximum.y)} Euro bei rund{" "}
            {maximum.x.toLocaleString("de-DE", { maximumFractionDigits: 0 })} Euro brutto im Monat
            und fällt danach wieder ab.
            {wechsel
              ? ` Ab etwa ${wechsel.x.toLocaleString("de-DE", { maximumFractionDigits: 0 })} Euro brutto im Monat wird daraus eine Mehrbelastung.`
              : ""}
          </desc>

          {/* Waagerechte Hilfslinien */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={RAND.links}
                x2={RAND.links + PLOT_B}
                y1={sy(v)}
                y2={sy(v)}
                stroke="rgba(16,24,40,0.07)"
                strokeWidth={1}
              />
              <text
                x={RAND.links - 10}
                y={sy(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill="rgba(0,0,0,0.45)"
              >
                {v > 0 ? `+${v}` : v}
              </text>
            </g>
          ))}

          {/* Nulllinie: die inhaltlich wichtigste Linie des Diagramms */}
          <line
            x1={RAND.links}
            x2={RAND.links + PLOT_B}
            y1={nullY}
            y2={nullY}
            stroke="rgba(16,24,40,0.45)"
            strokeWidth={1.5}
          />

          {/* Senkrechte Achsenbeschriftung */}
          {xTicks.map((v) => (
            <text
              key={v}
              x={sx(v)}
              y={RAND.oben + PLOT_H + 22}
              textAnchor="middle"
              fontSize={12}
              fill="rgba(0,0,0,0.45)"
            >
              {kurzEuro(v)}
            </text>
          ))}
          <text
            x={RAND.links + PLOT_B / 2}
            y={HOEHE - 6}
            textAnchor="middle"
            fontSize={12}
            fill="rgba(0,0,0,0.55)"
          >
            Bruttogehalt pro Monat in Euro
          </text>
          {/* Links ausgerichtet an der Achse: rechtsbündig ragte das „€“ aus der viewBox. */}
          <text
            x={RAND.links - 34}
            y={RAND.oben - 8}
            textAnchor="start"
            fontSize={12}
            fill="rgba(0,0,0,0.55)"
          >
            € / Monat
          </text>

          {/* Fläche unter der 2027-Kurve, an der Nulllinie gekappt */}
          <clipPath id="entlastung-positiv">
            <rect x={RAND.links} y={RAND.oben} width={PLOT_B} height={Math.max(0, nullY - RAND.oben)} />
          </clipPath>
          <clipPath id="entlastung-negativ">
            <rect
              x={RAND.links}
              y={nullY}
              width={PLOT_B}
              height={Math.max(0, RAND.oben + PLOT_H - nullY)}
            />
          </clipPath>
          <path
            d={flaeche(pfad2027, nullY)}
            fill="rgba(230,10,28,0.10)"
            clipPath="url(#entlastung-positiv)"
          />
          <path
            d={flaeche(pfad2027, nullY)}
            fill="rgba(16,24,40,0.13)"
            clipPath="url(#entlastung-negativ)"
          />

          {/* Kurven */}
          <path
            d={linie(pfad2028)}
            fill="none"
            stroke="rgba(16,24,40,0.45)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <path d={linie(pfad2027)} fill="none" stroke="#E60A1C" strokeWidth={2.75} />

          {/* Kennpunkt: Maximum */}
          <circle cx={sx(maximum.x)} cy={sy(maximum.y)} r={4.5} fill="#E60A1C" />
          <text
            x={sx(maximum.x)}
            y={sy(maximum.y) - 12}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#E60A1C"
          >
            max. +{euro(maximum.y)} €
          </text>

          {/* Kennpunkt: Vorzeichenwechsel */}
          {wechsel && (
            <g>
              <line
                x1={sx(wechsel.x)}
                x2={sx(wechsel.x)}
                y1={RAND.oben}
                y2={RAND.oben + PLOT_H}
                stroke="rgba(16,24,40,0.35)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={sx(wechsel.x) - 8}
                y={RAND.oben + 14}
                textAnchor="end"
                fontSize={12}
                fontWeight={700}
                fill="rgba(16,24,40,0.7)"
              >
                ab hier Mehrbelastung
              </text>
            </g>
          )}
        </svg>

        {/* Legende */}
        <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-black/70">
          <li className="flex items-center gap-2">
            <span className="w-6 h-[3px] rounded bg-[#E60A1C]" aria-hidden="true" />
            Entwurf 2027 (Artikel&nbsp;1)
          </li>
          <li className="flex items-center gap-2">
            <span
              className="w-6 h-0 border-t-2 border-dashed border-black/45"
              aria-hidden="true"
            />
            Zweite Stufe 2028 (Artikel&nbsp;2)
          </li>
        </ul>
      </div>

      {/*
        Die Werte zusätzlich als echte Tabelle: für Screenreader, für Nutzer
        ohne Grafikdarstellung — und weil Suchmaschinen und Antwortmaschinen
        eine Tabelle zitieren können, eine SVG-Kurve aber nicht.
      */}
      <details className="mt-4 bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
        <summary className="cursor-pointer px-5 py-3.5 text-sm font-bold text-[#16181D]">
          Werte als Tabelle anzeigen
        </summary>
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">
              Netto-Differenz pro Monat gegenüber dem Tarif 2026, Steuerklasse I
            </caption>
            <thead>
              <tr className="text-left text-black/55">
                <th scope="col" className="py-2 pr-4 font-semibold">Brutto / Monat</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Entwurf 2027</th>
                <th scope="col" className="py-2 font-semibold">Stufe 2028</th>
              </tr>
            </thead>
            <tbody>
              {[2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 25000].map((b) => {
                const d27 = differenzProMonat(b, "entwurf2027");
                const d28 = differenzProMonat(b, "stufe2028");
                const zelle = (v: number) =>
                  `${v >= 0 ? "+" : "−"}${euro(Math.abs(v))} €`;
                return (
                  <tr key={b} className="border-t border-black/[0.07]">
                    <th scope="row" className="py-2 pr-4 font-semibold text-[#16181D] text-left">
                      {b.toLocaleString("de-DE")} €
                    </th>
                    <td className={`py-2 pr-4 font-bold ${d27 >= 0 ? "text-emerald-700" : "text-[#E60A1C]"}`}>
                      {zelle(d27)}
                    </td>
                    <td className={`py-2 font-bold ${d28 >= 0 ? "text-emerald-700" : "text-[#E60A1C]"}`}>
                      {zelle(d28)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
