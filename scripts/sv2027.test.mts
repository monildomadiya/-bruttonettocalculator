/**
 * SV-Umschalter 2027 (calculateNetto, `sv2027: "entwurf"`) — rechnet die
 * Beitragsbemessungsgrenzen aus dem BMAS-Referentenentwurf vom 21.09.2026
 * (KV/PV 6.375 €, RV/ALV 8.850 € im Monat) bei unveränderten Sätzen 2026.
 * Run: npm run test:sv2027
 *
 * Erwartung (kinderlos, ohne Kirche, Steuerklasse I):
 *  - unter 5.812,50 € brutto: keine Änderung
 *  - 8.000 €: KV/PV-Mehrbeitrag (6.375 − 5.812,50) × (8,75 % + 2,4 %) = 62,72 €
 *  - 9.000 €: zusätzlich RV/ALV (8.850 − 8.450) × (9,3 % + 1,3 %) = 42,40 €
 *  - 2026 und Default "beschlossen" bleiben unverändert
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

const sv = (brutto: number, jahr: 2026 | 2027, sv2027?: "beschlossen" | "entwurf") =>
  calculateNetto({ bruttoMonat: brutto, jahr, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1, sv2027 }).sv
    .summeMonat;

approx("4.000 € 2027: Entwurf = beschlossen", sv(4000, 2027, "entwurf") - sv(4000, 2027, "beschlossen"), 0);
approx("8.000 € 2027: KV/PV-Mehrbeitrag", sv(8000, 2027, "entwurf") - sv(8000, 2027, "beschlossen"), 62.72);
approx("9.000 € 2027: KV/PV + RV/ALV", sv(9000, 2027, "entwurf") - sv(9000, 2027, "beschlossen"), 105.12);
approx("Default 2027 = beschlossen", sv(9000, 2027) - sv(9000, 2027, "beschlossen"), 0);
approx("2026 ignoriert den Schalter", sv(9000, 2026, "entwurf") - sv(9000, 2026), 0);

// Mehr SV senkt das zvE — die Lohnsteuer muss im Entwurf etwas niedriger sein.
const lst = (sv2027: "beschlossen" | "entwurf") =>
  calculateNetto({ bruttoMonat: 9000, jahr: 2027, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1, sv2027 }).steuer
    .summeMonat;
const ok = lst("entwurf") < lst("beschlossen");
console.log(`${ok ? "✓" : "✗"} 9.000 €: Lohnsteuer im Entwurf niedriger (${lst("entwurf").toFixed(2)} < ${lst("beschlossen").toFixed(2)})`);
if (!ok) failed++;

console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL SV-2027 CHECKS PASSED");
process.exit(failed ? 1 : 0);
