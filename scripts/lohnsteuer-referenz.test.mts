/**
 * Referenzfälle Lohnsteuer 2026 gegen den amtlichen BMF-Lohnsteuerrechner
 * (https://www.bmf-steuerrechner.de, "Lohnsteuerrechner 2026").
 *
 * Die BMF-Werte (`bmf`) müssen von Hand eingetragen werden: Der BMF-Rechner ist
 * ein Formular, seine Schnittstelle braucht einen registrierten Zugangscode.
 * Solange `bmf` null ist, zeigt der Test nur die Engine-Werte an.
 *
 * Eingaben im BMF-Rechner je Fall: Abrechnungszeitraum Monat, Bundesland laut
 * Fall (Kirchensteuer 8/9 %), gesetzlich krankenversichert, Zusatzbeitrag 2,9 %,
 * Pflegeversicherung laut Fall, keine Freibeträge, Kinderfreibeträge 0 (außer
 * Fall SK II: 0,5). Eingetragen wird die MONATLICHE Lohnsteuer.
 *
 * Die Engine rechnet mit vereinfachtem zu versteuernden Einkommen (tatsächliche
 * Sozialabgaben statt PAP-Vorsorgepauschale). Abweichungen von einigen Euro sind
 * deshalb zu erwarten; die Toleranz unten markiert, was als Fehler gilt.
 *
 * Run: npm run test:referenz
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = pathToFileURL(path.resolve(import.meta.dirname, "..") + "/").href;
register(
  "data:text/javascript," +
    encodeURIComponent(
      `export async function resolve(s, c, n) { if (s.startsWith("@/")) return n(${JSON.stringify(root)} + s.slice(2) + ".ts", c); return n(s, c); }`
    )
);
const { calculateNetto } = await import("../lib/taxCalculator.ts");
const { nettoEinmalzahlung } = await import("../lib/einmalzahlung.ts");

/** Erlaubte Abweichung der Monats-Lohnsteuer in Euro (vereinfachtes zvE). */
const TOLERANZ_EUR = 15;

interface Fall {
  name: string;
  brutto: number;
  sk: 1 | 2 | 3 | 4 | 5 | 6;
  kirche?: boolean;
  kirchensteuerSatz?: number;
  kinderlos?: boolean;
  sachsen?: boolean;
  /** Sonstiger Bezug (z. B. Weihnachtsgeld) im November: Lohnsteuer darauf statt laufend. */
  einmal?: number;
  /** Monatliche Lohnsteuer laut BMF-Rechner — von Hand eintragen. */
  bmf: number | null;
}

const FAELLE: Fall[] = [
  { name: "SK I, 3.500 €, kinderlos, NRW", brutto: 3500, sk: 1, kinderlos: true, bmf: null },
  { name: "SK II, 3.500 €, 1 Kind (Zähler 0,5)", brutto: 3500, sk: 2, kinderlos: false, bmf: null },
  { name: "SK III, 5.000 €, mit Kind", brutto: 5000, sk: 3, kinderlos: false, bmf: null },
  { name: "SK IV, 4.000 €, kinderlos", brutto: 4000, sk: 4, kinderlos: true, bmf: null },
  { name: "SK V, 2.500 €, kinderlos", brutto: 2500, sk: 5, kinderlos: true, bmf: null },
  { name: "SK VI, 1.500 €, kinderlos", brutto: 1500, sk: 6, kinderlos: true, bmf: null },
  { name: "SK I, 4.000 €, KiSt 8 % (Bayern)", brutto: 4000, sk: 1, kinderlos: true, kirche: true, kirchensteuerSatz: 0.08, bmf: null },
  { name: "SK I, 4.000 €, KiSt 9 % (Hessen)", brutto: 4000, sk: 1, kinderlos: true, kirche: true, kirchensteuerSatz: 0.09, bmf: null },
  { name: "SK I, 3.000 €, mit Kind (kein PV-Zuschlag)", brutto: 3000, sk: 1, kinderlos: false, bmf: null },
  { name: "SK I, 3.500 €, Sachsen, kinderlos", brutto: 3500, sk: 1, kinderlos: true, sachsen: true, bmf: null },
  { name: "SK I, 9.000 € (über beiden BBG)", brutto: 9000, sk: 1, kinderlos: true, bmf: null },
  { name: "SK I, 1.500 € Midijob", brutto: 1500, sk: 1, kinderlos: true, bmf: null },
  { name: "SK I, 3.500 € + 2.000 € Weihnachtsgeld (LSt auf den sonstigen Bezug)", brutto: 3500, sk: 1, kinderlos: true, einmal: 2000, bmf: null },
];

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let fehler = 0;
let offen = 0;

console.log("Fall | Engine LSt/Monat | BMF | Differenz");
for (const f of FAELLE) {
  let lst: number;
  if (f.einmal) {
    lst = nettoEinmalzahlung({
      bruttoMonat: f.brutto,
      einmal: f.einmal,
      steuerklasse: f.sk,
      kirche: !!f.kirche,
      kinderlosUeber23: !!f.kinderlos,
      auszahlungsMonat: 11,
    }).lohnsteuer;
  } else {
    lst = calculateNetto({
      bruttoMonat: f.brutto,
      jahr: 2026,
      steuerklasse: f.sk,
      verheiratet: f.sk === 3 || f.sk === 4 || f.sk === 5,
      kinderlosUeber23: !!f.kinderlos,
      kirche: !!f.kirche,
      kirchensteuerSatz: f.kirchensteuerSatz,
      sachsen: f.sachsen,
    }).steuer.einkommensteuerJahr / 12;
  }
  if (f.bmf === null) {
    offen++;
    console.log(`… ${f.name} | ${eur(lst)} | (offen) |`);
    continue;
  }
  const diff = lst - f.bmf;
  const ok = Math.abs(diff) <= TOLERANZ_EUR;
  if (!ok) fehler++;
  console.log(`${ok ? "✓" : "✗"} ${f.name} | ${eur(lst)} | ${eur(f.bmf)} | ${diff >= 0 ? "+" : ""}${eur(diff)}`);
}

console.log(`\n${FAELLE.length - offen} geprüft, ${offen} ohne BMF-Wert, ${fehler} außerhalb der Toleranz (${TOLERANZ_EUR} €).`);
process.exit(fehler ? 1 : 0);
