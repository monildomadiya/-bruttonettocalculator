import {
  grenzsteuersatz2026,
  grenzsteuersatzFuerTarif,
  estFormel2026,
  estFuerTarif,
  TARIF_2027_ENTWURF,
  GRUNDFREIBETRAG,
} from "@/lib/taxCalculator";
import { skala, linie, kurzEuro, prozent, type Punkt } from "./chartUtils";

/**
 * Grenzsteuersatz nach § 32a EStG über dem zu versteuernden Einkommen —
 * geltender Tarif 2026 gegen den Referentenentwurf EStRefG 2027.
 *
 * Der Grenzsteuersatz, nicht der Durchschnittssteuersatz: Der Entwurf ändert
 * die *Form* des Tarifs (die Reichensteuer greift ab 250.000 € statt ab
 * 277.826 €, darüber kommt erstmals ein Satz von 47 %). In der
 * Grenzsteuersatzkurve ist das eine sichtbare zusätzliche Stufe; in der
 * Durchschnittssteuersatzkurve verschwände sie im Kurvenverlauf.
 *
 * Die Kurve wird aus denselben Funktionen erzeugt, die auch der Rechner
 * benutzt — Diagramm und Ergebnis können also nicht auseinanderlaufen.
 */

const BREITE = 760;
const HOEHE = 340;
const RAND = { oben: 24, rechts: 20, unten: 48, links: 52 };
const PLOT_B = BREITE - RAND.links - RAND.rechts;
const PLOT_H = HOEHE - RAND.oben - RAND.unten;

const VON = 0;
const BIS = 320000;
const SCHRITTE = 640; // fein genug, dass die Tarifecken nicht ausgefranst wirken

function reihe(f: (zvE: number) => number): Punkt[] {
  const punkte: Punkt[] = [];
  for (let i = 0; i <= SCHRITTE; i++) {
    const x = VON + ((BIS - VON) * i) / SCHRITTE;
    punkte.push({ x, y: f(x) * 100 });
  }
  return punkte;
}

export default function TarifKurve() {
  const daten2026 = reihe(grenzsteuersatz2026);
  const daten2027 = reihe((zvE) => grenzsteuersatzFuerTarif(TARIF_2027_ENTWURF, zvE));

  const sx = skala([VON, BIS], [RAND.links, RAND.links + PLOT_B]);
  const sy = skala([0, 50], [RAND.oben + PLOT_H, RAND.oben]);
  const px = (d: Punkt[]) => d.map((p) => ({ x: sx(p.x), y: sy(p.y) }));

  const xTicks = [0, 50000, 100000, 150000, 200000, 250000, 300000];
  const yTicks = [0, 14, 23.97, 42, 45, 47];

  const titelId = "tarifkurve-titel";
  const beschreibungId = "tarifkurve-beschreibung";

  /** Die Eckwerte, an denen sich 2026 und der Entwurf unterscheiden. */
  const eckwerte = [
    {
      label: "Grundfreibetrag",
      alt: GRUNDFREIBETRAG.amtlich2026,
      neu: GRUNDFREIBETRAG.entwurf2027,
      erlaeuterung: "Bis hierhin bleibt das Einkommen steuerfrei.",
    },
    {
      label: "Beginn 42 %",
      alt: 69879,
      neu: 70601,
      erlaeuterung: "Ende der zweiten Progressionszone, ab hier gilt der Spitzensteuersatz.",
    },
    {
      label: "Beginn 45 %",
      alt: 277826,
      neu: 250000,
      erlaeuterung: "Die sogenannte Reichensteuer greift im Entwurf deutlich früher.",
    },
    {
      label: "Beginn 47 %",
      alt: null,
      neu: 280000,
      erlaeuterung: "Neuer dritter Spitzensatz — den gibt es im geltenden Recht nicht.",
    },
  ];

  return (
    <figure className="w-full my-8">
      <figcaption className="mb-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2">
          Was der Entwurf am Steuertarif ändert
        </h3>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed">
          Grenzsteuersatz nach § 32a EStG — also der Satz, mit dem der jeweils nächste verdiente
          Euro besteuert wird. Der Entwurf verschiebt die Tarifecken und fügt oben eine Stufe hinzu.
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
            Grenzsteuersatz nach zu versteuerndem Einkommen: Tarif 2026 gegen Referentenentwurf 2027
          </title>
          <desc id={beschreibungId}>
            Beide Tarife steigen vom Grundfreibetrag aus von 14 auf 42 Prozent. Der geltende Tarif
            2026 springt danach nur noch einmal, bei 277.826 Euro, auf 45 Prozent. Der Entwurf
            erreicht 45 Prozent bereits bei 250.000 Euro und steigt bei 280.000 Euro auf 47 Prozent.
          </desc>

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
                x={RAND.links - 8}
                y={sy(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="rgba(0,0,0,0.45)"
              >
                {v === 23.97 ? "23,97" : v}
              </text>
            </g>
          ))}

          {xTicks.map((v) => (
            <text
              key={v}
              x={sx(v)}
              y={RAND.oben + PLOT_H + 22}
              textAnchor="middle"
              fontSize={12}
              fill="rgba(0,0,0,0.45)"
            >
              {v === 0 ? "0" : kurzEuro(v)}
            </text>
          ))}
          <text
            x={RAND.links + PLOT_B / 2}
            y={HOEHE - 6}
            textAnchor="middle"
            fontSize={12}
            fill="rgba(0,0,0,0.55)"
          >
            Zu versteuerndes Einkommen in Euro pro Jahr
          </text>
          <text
            x={RAND.links - 8}
            y={RAND.oben - 10}
            textAnchor="end"
            fontSize={12}
            fill="rgba(0,0,0,0.55)"
          >
            %
          </text>

          {/* Hervorhebung: der Bereich, in dem sich die beiden Tarife oben unterscheiden */}
          <rect
            x={sx(250000)}
            y={RAND.oben}
            width={sx(BIS) - sx(250000)}
            height={PLOT_H}
            fill="rgba(230,10,28,0.05)"
          />

          <path
            d={linie(px(daten2026))}
            fill="none"
            stroke="rgba(16,24,40,0.45)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <path d={linie(px(daten2027))} fill="none" stroke="#E60A1C" strokeWidth={2.75} />

          <text
            x={sx(265000)}
            y={sy(47) - 10}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#E60A1C"
          >
            neu: 47 %
          </text>
        </svg>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-black/70">
          <li className="flex items-center gap-2">
            <span className="w-6 h-[3px] rounded bg-[#E60A1C]" aria-hidden="true" />
            Referentenentwurf 2027
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-0 border-t-2 border-dashed border-black/45" aria-hidden="true" />
            Geltender Tarif 2026
          </li>
        </ul>
      </div>

      <div className="mt-4 bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm font-bold text-[#16181D] mb-3">
            Tarifeckwerte im Vergleich (zu versteuerndes Einkommen)
          </caption>
          <thead>
            <tr className="text-left text-black/55">
              <th scope="col" className="py-2 pr-4 font-semibold">Tarifecke</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Geltend 2026</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Entwurf 2027</th>
              <th scope="col" className="py-2 font-semibold">Bedeutung</th>
            </tr>
          </thead>
          <tbody>
            {eckwerte.map((e) => (
              <tr key={e.label} className="border-t border-black/[0.07] align-top">
                <th scope="row" className="py-2.5 pr-4 font-semibold text-[#16181D] text-left whitespace-nowrap">
                  {e.label}
                </th>
                <td className="py-2.5 pr-4 text-black/70 whitespace-nowrap">
                  {e.alt === null ? "—" : `${e.alt.toLocaleString("de-DE")} €`}
                </td>
                <td className="py-2.5 pr-4 font-bold text-[#E60A1C] whitespace-nowrap">
                  {e.neu.toLocaleString("de-DE")} €
                </td>
                <td className="py-2.5 text-black/65">{e.erlaeuterung}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-black/50 leading-relaxed mt-4">
          Zur Einordnung: Bei einem zu versteuernden Einkommen von 50.000 € beträgt die
          Jahres-Einkommensteuer nach geltendem Recht{" "}
          {estFormel2026(50000).toLocaleString("de-DE", { maximumFractionDigits: 0 })} € und nach dem
          Entwurf{" "}
          {estFuerTarif(TARIF_2027_ENTWURF, 50000).toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
          — der Grenzsteuersatz liegt dort bei{" "}
          {prozent(grenzsteuersatzFuerTarif(TARIF_2027_ENTWURF, 50000) * 100)}.
        </p>
      </div>
    </figure>
  );
}
