/**
 * Azubi-Sonderregeln (§ 20 SGB IV) — handrechenbare Prüfpunkte.
 * AN-Sätze 2026 ohne Kinderlosenzuschlag: RV 9,3 % + ALV 1,3 % + KV 8,75 %
 * (14,6 % + 2,9 % Ø-Zusatzbeitrag, halbiert) + PV 1,8 % = 21,15 %.
 */
import { calculateNetto, AZUBI_GERINGVERDIENERGRENZE } from "../lib/taxCalculator.ts";

let failed = 0;
const near = (name: string, got: number, want: number, tol = 0.01) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(2)}, want ${want.toFixed(2)}`);
};
const azubi = (bruttoMonat: number, kinderlosUeber23 = false) =>
  calculateNetto({ bruttoMonat, jahr: 2026, verheiratet: false, kinderlosUeber23, kirche: false, steuerklasse: 1, auszubildend: true });

near("Grenze ist 325 €", AZUBI_GERINGVERDIENERGRENZE, 325, 0);
near("300 € Azubi: keine AN-SV", azubi(300).sv.summeMonat, 0);
near("325 € Azubi: keine AN-SV (inkl.)", azubi(325).sv.summeMonat, 0);
near("325 € kinderlos 23+: Zuschlag trägt auch der AG", azubi(325, true).sv.summeMonat, 0);
near("326 € Azubi: volle AN-SV 21,15 %", azubi(326).sv.summeMonat, 326 * 0.2115);
near("724 € Azubi: volle AN-SV, kein Midijob", azubi(724).sv.summeMonat, 724 * 0.2115);
near("1.014 € Azubi: volle AN-SV", azubi(1014).sv.summeMonat, 1014 * 0.2115);
near("1.014 € Azubi: keine Lohnsteuer", azubi(1014).steuer.summeMonat, 0);

// Ohne Flag rechnet der Midijob weiter — die Abweichung muss also existieren.
const normal = calculateNetto({ bruttoMonat: 1014, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 });
if (!(normal.sv.summeMonat < azubi(1014).sv.summeMonat)) { failed++; console.log("✗ Midijob-Abzug ohne Flag sollte kleiner sein"); }
else console.log(`✓ ohne Flag Midijob: ${normal.sv.summeMonat.toFixed(2)} < Azubi ${azubi(1014).sv.summeMonat.toFixed(2)}`);

if (failed) { console.log(`\n${failed} AZUBI CHECK(S) FAILED`); process.exit(1); }
console.log("\nALL AZUBI CHECKS PASSED");
