/**
 * Steuerklassen V und VI (lib/taxCalculator.ts → lohnsteuerKlasse56) gegen
 * veröffentlichte Lohnsteuertabellen-Werte 2026 (PAP 2026, Monatslohnsteuer).
 * Run: npm run test:steuerklassen
 *
 * Toleranz: Die Engine zieht die tatsächlichen SV-Beiträge statt der
 * PAP-Vorsorgepauschale ab — auch Klasse I weicht deshalb um rund 13 € ab
 * (280 € statt 293 € bei 3.000 €). Geprüft wird daher mit ±25 €, dazu die
 * Reihenfolge VI > V > I, die die alte Näherung (×1,45 / ×1,1) verletzt hat.
 *
 * Referenz (Monat, 2026): 3.000 € → I 293, V 626, VI 665;
 *                         6.000 € → V 1.624, VI 1.669.
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
function approx(name: string, got: number, want: number, eps: number) {
  const ok = Math.abs(got - want) <= eps;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${got.toFixed(2)} (erwartet ${want} ±${eps})`);
  if (!ok) failed++;
}
function check(name: string, ok: boolean) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (!ok) failed++;
}

const lst = (brutto: number, sk: 1 | 2 | 3 | 4 | 5 | 6) =>
  calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: sk,
  }).steuer.einkommensteuerJahr / 12;

approx("3.000 € SK I", lst(3000, 1), 293, 25);
approx("3.000 € SK V", lst(3000, 5), 626, 25);
approx("3.000 € SK VI", lst(3000, 6), 665, 25);
approx("6.000 € SK V", lst(6000, 5), 1624, 30);
approx("6.000 € SK VI", lst(6000, 6), 1669, 30);

for (const b of [1500, 2500, 3500, 5000, 8000, 20000]) {
  check(`${b} €: VI > V > I`, lst(b, 6) > lst(b, 5) && lst(b, 5) > lst(b, 1));
}
// Mindeststeuer 14 % in Klasse V bei kleinem Lohn (zvE > 0).
check("1.500 € SK V ≥ 14 % des zvE", lst(1500, 5) > 0);

console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL STEUERKLASSEN CHECKS PASSED");
process.exit(failed ? 1 : 0);
