import { Fragment } from "react";
import {
  GRUNDFREIBETRAG,
  ARBEITNEHMER_PAUSCHBETRAG,
  KINDERGELD,
  KINDERFREIBETRAG,
  BBG_2026,
  SV_RECHENGROESSEN_2027_ENTWURF,
  PV_ZUSCHLAG_KINDERLOS_2027_ENTWURF,
} from "@/lib/taxCalculator";
import { BBG_2027_STATUS, LEGISLATION_STATUS, MINDESTLOHN, MINIJOB_GRENZE } from "@/lib/config2027";
import { RV_SATZ_2027_ERWARTET, SV_2026 } from "@/lib/sozialabgaben2027";
import {
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ZUSATZBEITRAG_DURCHSCHNITT_2027,
  ZUSATZBEITRAG_2027_SCHAETZERKREIS,
} from "@/data/krankenkassen";

/**
 * Alle Werte 2026 → 2027 mit Verfahrensstand, als eine Tabelle.
 *
 * Konkurrenz-Seiten (netto-check, mein-nettogehalt, Okt. 2026) zeigen eine
 * solche Statustabelle; Antwortmaschinen zitieren Tabellen, nicht Fließtext.
 * Jede Zahl kommt aus derselben Konstante, mit der die Engine rechnet — beim
 * nächsten Verfahrensschritt ändert sich die Tabelle mit.
 */

type Stufe = "fest" | "entwurf";

interface Zeile {
  wert: string;
  alt: string;
  neu: string;
  stufe: Stufe;
  stand: string;
}

const de = (n: number, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
/** Ganze Euro ohne ",00", Cent nur wo nötig (5.812,50 €). */
const euro = (n: number) => de(n, Number.isInteger(n) ? 0 : 2) + " €";
const pct = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " %";
const ESTREFG = `Gesetzentwurf (${LEGISLATION_STATUS.drucksache})`;

const zusatzbeitrag2027 = ZUSATZBEITRAG_DURCHSCHNITT_2027;

const ZEILEN: Zeile[] = [
  { wert: "Grundfreibetrag", alt: `${de(GRUNDFREIBETRAG.amtlich2026)} €`, neu: `${de(GRUNDFREIBETRAG.entwurf2027)} €`, stufe: "entwurf", stand: ESTREFG },
  { wert: "Arbeitnehmer-Pausch­betrag", alt: `${de(ARBEITNEHMER_PAUSCHBETRAG.amtlich2026)} €`, neu: `${de(ARBEITNEHMER_PAUSCHBETRAG.reform)} €`, stufe: "entwurf", stand: ESTREFG },
  // § 32a EStG 2026 bzw. Art. 1 Nr. 4 EStRefG-Entwurf (BT-Drs. 21/8235).
  { wert: "Spitzensteuersatz 42 % ab (zvE)", alt: "69.879 €", neu: "70.601 €", stufe: "entwurf", stand: ESTREFG },
  { wert: "Kindergeld je Kind", alt: `${de(KINDERGELD.amtlich2026)} €`, neu: `${de(KINDERGELD.entwurf2027)} €`, stufe: "entwurf", stand: ESTREFG },
  { wert: "Kinderfreibetrag je Elternteil", alt: `${de(KINDERFREIBETRAG.amtlich2026)} €`, neu: `${de(KINDERFREIBETRAG.entwurf2027)} €`, stufe: "entwurf", stand: ESTREFG },
  {
    wert: "Beitrags­bemessungs­grenze KV/PV",
    alt: euro(BBG_2026.kvPvJahr / 12),
    neu: euro(SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat),
    stufe: "entwurf",
    stand: `${BBG_2027_STATUS.kurz}, Bundesrat steht aus`,
  },
  {
    wert: "Beitrags­bemessungs­grenze RV/ALV",
    alt: euro(BBG_2026.rvAlvJahr / 12),
    neu: euro(SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgMonat),
    stufe: "entwurf",
    stand: `${BBG_2027_STATUS.kurz}, Bundesrat steht aus`,
  },
  {
    wert: "Ø Zusatzbeitrag Krankenkasse",
    alt: pct(DURCHSCHNITT_ZUSATZBEITRAG_2026),
    neu: pct(zusatzbeitrag2027 ?? ZUSATZBEITRAG_2027_SCHAETZERKREIS.wert),
    stufe: zusatzbeitrag2027 !== null ? "fest" : "entwurf",
    stand:
      zusatzbeitrag2027 !== null
        ? "vom Bundesgesundheitsministerium festgelegt"
        : `Schätzerkreis ${ZUSATZBEITRAG_2027_SCHAETZERKREIS.datum}; amtlich bis 1. November`,
  },
  {
    wert: "Pflege: Zuschlag für Kinderlose",
    alt: `${de(SV_2026.pvKinderlosenzuschlag * 100, 1)} Punkte`,
    neu: `${de(PV_ZUSCHLAG_KINDERLOS_2027_ENTWURF * 100, 1)} Punkte`,
    stufe: "entwurf",
    stand: "Regierungsentwurf Pflegereform (Kabinett 30.9.2026)",
  },
  {
    wert: "Rentenbeitrag",
    alt: pct(Math.round(SV_2026.rvSatz * 1000) / 10),
    neu: pct(RV_SATZ_2027_ERWARTET * 100),
    stufe: "entwurf",
    stand: "erwartet (Rentenversicherungsbericht 2025), Verordnung zum Jahresende",
  },
  { wert: "Mindestlohn je Stunde", alt: `${de(MINDESTLOHN[2026], 2)} €`, neu: `${de(MINDESTLOHN[2027], 2)} €`, stufe: "fest", stand: "beschlossen (Mindestlohnanpassungsverordnung)" },
  { wert: "Minijob-Grenze", alt: `${de(MINIJOB_GRENZE[2026])} €`, neu: `${de(MINIJOB_GRENZE[2027])} €`, stufe: "fest", stand: "folgt dem Mindestlohn (§ 8 Abs. 1a SGB IV)" },
];

function StandChip({ zeile }: { zeile: Zeile }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-xl border [hyphens:auto] [overflow-wrap:anywhere] ${
        zeile.stufe === "fest"
          ? "bg-emerald-600/10 text-emerald-800 border-emerald-600/25"
          : "bg-amber-500/10 text-amber-900 border-amber-500/30"
      }`}
    >
      {zeile.stand}
    </span>
  );
}

export default function Werte2027Tabelle() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white">
      <table className="w-full text-xs sm:text-sm">
        <caption className="text-left text-xs text-black/55 px-4 pt-3 pb-2">
          Monatswerte bei den Beitragsbemessungsgrenzen. Grün = beschlossen, gelb = Entwurf oder Kabinettsbeschluss.
        </caption>
        <thead>
          <tr className="bg-[#E60A1C]/10 border-b border-black/[0.08] text-left">
            <th scope="col" className="px-3 sm:px-4 py-3 font-bold text-[#16181D]">Wert</th>
            <th scope="col" className="px-2 sm:px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">2026</th>
            <th scope="col" className="px-3 sm:px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">2027</th>
            <th scope="col" className="hidden sm:table-cell px-4 py-3 font-bold text-[#16181D]">Stand</th>
          </tr>
        </thead>
        <tbody>
          {ZEILEN.map((z) => (
            <Fragment key={z.wert}>
              <tr className="sm:border-b border-black/[0.05]">
                <th scope="row" className="pl-3 pr-1 sm:px-4 pt-3 pb-1 sm:pb-3 text-left font-semibold text-[#16181D] [hyphens:auto]" lang="de">
                  {z.wert}
                </th>
                <td className="px-1.5 sm:px-4 pt-3 pb-1 sm:pb-3 text-right font-mono whitespace-nowrap text-black/70 align-top">{z.alt}</td>
                <td className="pl-1.5 pr-3 sm:px-4 pt-3 pb-1 sm:pb-3 text-right font-mono whitespace-nowrap font-bold text-[#16181D] align-top">{z.neu}</td>
                <td className="hidden sm:table-cell px-4 py-3 min-w-[12rem]">
                  <StandChip zeile={z} />
                </td>
              </tr>
              {/* Mobil: Stand als eigene Zeile über die volle Breite, damit 2026/2027 ohne Scrollen sichtbar bleiben. */}
              <tr className="sm:hidden border-b border-black/[0.05]">
                <td colSpan={3} className="px-3 pb-3">
                  <StandChip zeile={z} />
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
