/**
 * Midijob / Übergangsbereich 2026 checkpoints against the production engine.
 * Run: node scripts/midijob.test.mts   (Node 23.6+ strips the TS types)
 *
 * Verifies the official Deutsche-Rentenversicherung values so the €1,200 page
 * (and the existing 1.500–2.000 € pages) never ship wrong payroll figures.
 */
import {
  midijobArbeitnehmerBemessungMonat,
  midijobGesamtBemessungMonat,
  isMidijob2026,
  calculateNetto,
} from "../lib/taxCalculator.ts";

let failed = 0;
function approx(name: string, got: number, want: number, eps = 0.01) {
  const ok = Math.abs(got - want) <= eps;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(4)}, want ${want} (±${eps})`);
  if (!ok) failed++;
}
function assert(name: string, cond: boolean) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failed++;
}

// --- Official DRV checkpoint at €1,200 ---
approx("AN-Bemessung @1200 = 854,69 €", midijobArbeitnehmerBemessungMonat(1200), 854.69);
approx("Gesamt-Bemessung @1200 = 1.083,25 €", midijobGesamtBemessungMonat(1200), 1083.25);

// --- Range boundaries: at €2,000 both bases collapse to the actual pay ---
approx("AN-Bemessung @2000 = 2000 €", midijobArbeitnehmerBemessungMonat(2000), 2000);
approx("Gesamt-Bemessung @2000 = 2000 €", midijobGesamtBemessungMonat(2000), 2000);

// --- isMidijob range gate (603,01 … 2.000) ---
assert("603,00 € is NOT Midijob (Minijob)", isMidijob2026(603) === false);
assert("603,01 € IS Midijob", isMidijob2026(603.01) === true);
assert("1.200 € IS Midijob", isMidijob2026(1200) === true);
assert("2.000 € IS Midijob (upper incl.)", isMidijob2026(2000) === true);
assert("2.000,01 € is NOT Midijob", isMidijob2026(2000.01) === false);

// --- Engine wiring: employee SV in the range is computed on the reduced base ---
const at1200 = calculateNetto({ bruttoMonat: 1200, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
// Employee SV should be well below the naive 1200 × ~21.8% ≈ 261 €/mo full-rate figure.
assert("€1200 employee SV < full-rate (Midijob relief applies)", at1200.sv.summeMonat < 220);
assert("€1200 net is below gross and positive", at1200.nettoMonat > 900 && at1200.nettoMonat < 1200);

// The reduced employee base (854.69) times the total AN SV rate should match the SV sum.
const anRate = (0.146 + 0.029) / 2 + (0.036 + 0.006 - 0.017) + 0.186 / 2 + 0.026 / 2; // KV/2 + PV(AN,kinderlos) + RV/2 + ALV/2
approx("€1200 SV sum = 854,69 × AN-Satz", at1200.sv.summeMonat, 854.6886185 * anRate, 0.02);

// --- Continuity at the top boundary: €2,000 equals the normal (non-reduced) calc ---
const at2000 = calculateNetto({ bruttoMonat: 2000, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
const naive2000Sv = 2000 * anRate;
approx("€2000 SV sum equals full-rate (base = pay)", at2000.sv.summeMonat, naive2000Sv, 0.05);

console.log(failed === 0 ? "\nALL MIDIJOB CHECKS PASSED" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
