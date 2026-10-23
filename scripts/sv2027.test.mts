/**
 * SV 2027 (calculateNetto, `sv2027`) — Voreinstellung seit 23.10.2026 ist
 * "entwurf" = wie der Lohnsteuer-PAP-2027-Entwurf des BMF (08.10.2026):
 * Beitragsbemessungsgrenzen 2027 (KV/PV 6.375 €, RV/ALV 8.850 € im Monat,
 * Kabinettsbeschluss 07.10.2026) und Pflegezuschlag für Kinderlose 0,9 statt
 * 0,6 Punkte; übrige Sätze wie 2026. "beschlossen" = Stand 2026.
 * Run: npm run test:sv2027
 *
 * Erwartung (Steuerklasse I, ohne Kirche):
 *  - mit Kind (kein Zuschlag): unter 5.812,50 € brutto keine Änderung;
 *    8.000 €: KV/PV (6.375 − 5.812,50) × (8,75 % + 1,8 %) = 59,34 €;
 *    9.000 €: zusätzlich RV/ALV (8.850 − 8.450) × (9,3 % + 1,3 %) = 42,40 €
 *  - kinderlos: 4.000 € × 0,3 % = 12,00 €;
 *    8.000 €: 6.375 × 11,45 % − 5.812,50 × 11,15 % = 81,84 €
 *  - 2026 ignoriert den Schalter; Default 2027 = "entwurf"
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

let failed = 0;
function approx(name: string, got: number, want: number, eps = 0.01) {
  const ok = Math.abs(got - want) <= eps;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${got.toFixed(2)} (erwartet ${want})`);
  if (!ok) failed++;
}

const sv = (brutto: number, jahr: 2026 | 2027, sv2027?: "beschlossen" | "entwurf", kinderlos = true) =>
  calculateNetto({ bruttoMonat: brutto, jahr, verheiratet: false, kinderlosUeber23: kinderlos, kirche: false, steuerklasse: 1, sv2027 }).sv
    .summeMonat;

approx("4.000 € mit Kind: Entwurf = beschlossen", sv(4000, 2027, "entwurf", false) - sv(4000, 2027, "beschlossen", false), 0);
approx("8.000 € mit Kind: KV/PV-Mehrbeitrag", sv(8000, 2027, "entwurf", false) - sv(8000, 2027, "beschlossen", false), 59.34);
approx("9.000 € mit Kind: KV/PV + RV/ALV", sv(9000, 2027, "entwurf", false) - sv(9000, 2027, "beschlossen", false), 101.74);
approx("4.000 € kinderlos: Pflegezuschlag +0,3 %", sv(4000, 2027, "entwurf") - sv(4000, 2027, "beschlossen"), 12.0);
approx("8.000 € kinderlos: Grenzen + Zuschlag", sv(8000, 2027, "entwurf") - sv(8000, 2027, "beschlossen"), 81.84);
approx("Default 2027 = entwurf", sv(9000, 2027) - sv(9000, 2027, "entwurf"), 0);
approx("2026 ignoriert den Schalter", sv(9000, 2026, "entwurf") - sv(9000, 2026), 0);
approx(
  "PV-Satz AN 2027 kinderlos = 2,7 %",
  calculateNetto({ bruttoMonat: 3000, jahr: 2027, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).sv.pflegeSatzAnPct,
  2.7,
  0.0001
);

// Mehr SV senkt das zvE — die Lohnsteuer muss im Entwurf etwas niedriger sein.
const lst = (sv2027: "beschlossen" | "entwurf") =>
  calculateNetto({ bruttoMonat: 9000, jahr: 2027, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1, sv2027 }).steuer
    .summeMonat;
const ok = lst("entwurf") < lst("beschlossen");
console.log(`${ok ? "✓" : "✗"} 9.000 €: Lohnsteuer im Entwurf niedriger (${lst("entwurf").toFixed(2)} < ${lst("beschlossen").toFixed(2)})`);
if (!ok) failed++;

console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL SV-2027 CHECKS PASSED");
process.exit(failed ? 1 : 0);
