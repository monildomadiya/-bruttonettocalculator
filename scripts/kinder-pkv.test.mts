/**
 * Kinder (Kinderfreibeträge für Soli/KiSt, PV-Abschlag) und PKV — handrechenbare
 * Prüfpunkte. Rechtsgrundlagen: § 51a Abs. 2a EStG, § 32 Abs. 6 EStG
 * (2026: 3.414 € + BEA 1.464 € je Elternteil), § 55 Abs. 3 SGB XI,
 * § 257 Abs. 2 SGB V, § 61 SGB XI.
 */
import { calculateNetto, estFormel2026 } from "../lib/taxCalculator.ts";

let failed = 0;
const near = (name: string, got: number, want: number, tol = 0.01) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(2)}, want ${want.toFixed(2)}`);
};
const base = { bruttoMonat: 4000, jahr: 2026 as const, verheiratet: false, kinderlosUeber23: false, kirche: true };

// ── Kinderfreibeträge: nur Soli/KiSt ────────────────────────────────────────
const ohne = calculateNetto({ ...base, steuerklasse: 1 });
const mit = calculateNetto({ ...base, steuerklasse: 1, kinderfreibetraege: 0.5 });
near("Lohnsteuer bleibt gleich", mit.steuer.einkommensteuerJahr, ohne.steuer.einkommensteuerJahr);
// Klasse I, Zähler 0,5: doppelt → 0,5 × 2 × (3.414 + 1.464) = 4.878 €
near("KiSt SK I, 1 Kind (0,5)", mit.steuer.kirchensteuerJahr, estFormel2026(mit.steuer.zvE - 4878) * 0.09);
const iv = calculateNetto({ ...base, verheiratet: true, steuerklasse: 4, kinderfreibetraege: 1 });
// Klasse IV, Zähler 1,0: einfach → 4.878 €
near("KiSt SK IV, 1 Kind (1,0)", iv.steuer.kirchensteuerJahr, estFormel2026(iv.steuer.zvE - 4878) * 0.09);
const iii = calculateNetto({ ...base, verheiratet: true, steuerklasse: 3, kinderfreibetraege: 2 });
// Klasse III, Zähler 2,0: doppelt → 19.512 €, Splitting
near("KiSt SK III, 2 Kinder", iii.steuer.kirchensteuerJahr, 2 * estFormel2026((iii.steuer.zvE - 19512) / 2) * 0.09);
const v = calculateNetto({ ...base, verheiratet: true, steuerklasse: 5, kinderfreibetraege: 1 });
const v0 = calculateNetto({ ...base, verheiratet: true, steuerklasse: 5 });
near("SK V: keine Kinderfreibeträge", v.steuer.kirchensteuerJahr, v0.steuer.kirchensteuerJahr);

// ── PV-Abschlag ab dem 2. Kind unter 25 ─────────────────────────────────────
near("PV AN 1 Kind: 1,8 %", calculateNetto({ ...base, pvKinderUnter25: 1 }).sv.pflegeSatzAnPct, 1.8, 1e-9);
near("PV AN 3 Kinder: 1,3 %", calculateNetto({ ...base, pvKinderUnter25: 3 }).sv.pflegeSatzAnPct, 1.3, 1e-9);
near("PV AN 7 Kinder: max. 0,8 %", calculateNetto({ ...base, pvKinderUnter25: 7 }).sv.pflegeSatzAnPct, 0.8, 1e-9);

// ── PKV ─────────────────────────────────────────────────────────────────────
const hoechst2026 = 5812.5 * (0.146 / 2 + 0.029 / 2 + 0.018); // 613,22 €
const p900 = calculateNetto({ bruttoMonat: 7000, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, pkvBeitragMonat: 900 });
near("PKV 900 €: Zuschuss = halbe Prämie", p900.sv.pkvZuschussMonat ?? -1, 450);
near("PKV 900 €: Eigenanteil", p900.sv.kranken / 12, 450);
near("PKV: keine SPV", p900.sv.pflege, 0);
near("PKV: RV unverändert", p900.sv.rente / 12, 7000 * 0.093);
const p1400 = calculateNetto({ bruttoMonat: 7000, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, pkvBeitragMonat: 1400 });
near("PKV 1.400 €: Höchstzuschuss 2026", p1400.sv.pkvZuschussMonat ?? -1, hoechst2026);
const p2027 = calculateNetto({ bruttoMonat: 7000, jahr: 2027, verheiratet: false, kinderlosUeber23: true, kirche: false, pkvBeitragMonat: 1400 });
near("PKV 1.400 €: Höchstzuschuss 2027 (BBG 6.375 €)", p2027.sv.pkvZuschussMonat ?? -1, 6375 * (0.146 / 2 + 0.029 / 2 + 0.018));
const gkv = calculateNetto({ bruttoMonat: 7000, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false });
near("Ohne PKV kein Zuschussfeld", gkv.sv.pkvZuschussMonat === undefined ? 0 : 1, 0, 0);

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen`);
  process.exit(1);
}
console.log("\nALLE KINDER-/PKV-PRUEFUNGEN BESTANDEN");
