/**
 * Brutto-Netto Österreich 2026 — Prüfpunkte gegen veröffentlichte
 * Referenzrechnungen (Stand 2026).
 * Run: node --experimental-strip-types --no-warnings scripts/oesterreich.test.mts
 *
 * Referenzen:
 *  - 3.000 € brutto (Angestellte, ohne Absetzbeträge): SV 542,10 €,
 *    Lohnsteuer 283,82 €, netto 2.174,08 €; Urlaubsgeld: SV 512,10 €,
 *    LSt 112,07 €, netto 2.375,83 €; Weihnachtsgeld netto 2.338,63 €.
 *  - 4.000 € brutto: SV Jahr 10.039,20 €, Jahresnetto 38.971,02 €.
 */
import { berechneBruttoNettoAT, berechnePensionAT, pabJahr, tarifsteuerAT, type EingabeAT } from "../lib/oesterreich.ts";

let failed = 0;
const r = (v: number) => Math.round(v * 100) / 100;
function approx(name: string, got: number, want: number, eps = 0.01) {
  const ok = Math.abs(got - want) <= eps;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(2)}, want ${want} (±${eps})`);
  if (!ok) failed++;
}

const basis: EingabeAT = {
  bruttoMonat: 3000,
  bundesland: "niederoesterreich",
  gehaelter: 14,
  kinderUnter18: 0,
  kinderAb18: 0,
  familienbonusVoll: true,
  avab: false,
  pendler: "keine",
  pendlerKm: 0,
};

// Tarif 2026: Stufen 13.539 / 21.992 / 36.458 / 70.365 / 104.859 / 1 Mio.
approx("Tarif bis 13.539 steuerfrei", tarifsteuerAT(13539), 0);
approx("Tarif 21.992 → 20 % der Stufe", tarifsteuerAT(21992), 8453 * 0.2);
approx("Tarif 36.458", tarifsteuerAT(36458), 8453 * 0.2 + 14466 * 0.3);

const a = berechneBruttoNettoAT(basis);
approx("3.000 € SV laufend", a.laufend.sv, 542.1);
approx("3.000 € Lohnsteuer laufend", a.laufend.lohnsteuer, 283.82);
approx("3.000 € netto laufend", a.laufend.netto, 2174.08);
approx("3.000 € Urlaubsgeld SV", a.sonderzahlungen[0].sv, 512.1);
approx("3.000 € Urlaubsgeld LSt", a.sonderzahlungen[0].lohnsteuer, 112.07);
approx("3.000 € Urlaubsgeld netto", a.sonderzahlungen[0].netto, 2375.83);
approx("3.000 € Weihnachtsgeld netto", a.sonderzahlungen[1].netto, 2338.63);

const b = berechneBruttoNettoAT({ ...basis, bruttoMonat: 4000 });
approx("4.000 € SV Jahr", b.jahr.sv, 10039.2);
approx("4.000 € Jahresnetto", b.jahr.netto, 38971.02);

// Wien: Wohnbauförderung 0,75 % → 18,32 % laufend, Sonderzahlungen unverändert.
const w = berechneBruttoNettoAT({ ...basis, bundesland: "wien" });
approx("Wien SV-Satz laufend 18,32 %", w.laufend.svSatz * 100, 18.32, 1e-9);
approx("Wien Urlaubsgeld SV unverändert", w.sonderzahlungen[0].sv, 512.1);

// AV-Staffel: bis 2.225 € kein AV-Beitrag des Dienstnehmers (15,12 %).
approx("2.200 € SV-Satz 15,12 %", berechneBruttoNettoAT({ ...basis, bruttoMonat: 2200 }).laufend.svSatz * 100, 15.12, 1e-9);
approx("2.400 € SV-Satz 16,12 %", berechneBruttoNettoAT({ ...basis, bruttoMonat: 2400 }).laufend.svSatz * 100, 16.12, 1e-9);

// Höchstbeitragsgrundlage 6.930 €: SV bei 10.000 € = 6.930 × 18,07 %.
approx("10.000 € SV gedeckelt", berechneBruttoNettoAT({ ...basis, bruttoMonat: 10000 }).laufend.sv, 1252.25);

// Geringfügig (≤ 551,10 €): keine DN-SV.
approx("500 € geringfügig SV", berechneBruttoNettoAT({ ...basis, bruttoMonat: 500 }).laufend.sv, 0);

// Freigrenze: Jahressechstel ≤ 2.615 € → Sonderzahlungen steuerfrei.
approx("1.300 € Sonderzahlung steuerfrei", berechneBruttoNettoAT({ ...basis, bruttoMonat: 1300 }).sonderzahlungen[0].lohnsteuer, 0);

// Familienbonus Plus: 1 Kind unter 18 senkt die Jahres-LSt um 2.000,16 €.
const fb = berechneBruttoNettoAT({ ...basis, kinderUnter18: 1 });
approx("Familienbonus wirkt voll", (a.laufend.lohnsteuer - fb.laufend.lohnsteuer) * 12, 2000.16, 0.12);

// Nie negative Lohnsteuer.
approx("Keine Negativsteuer", berechneBruttoNettoAT({ ...basis, bruttoMonat: 1800, kinderUnter18: 3 }).laufend.lohnsteuer, 0);

// ── 2027 (Inflationsanpassungsverordnung 2027, ÖGK-Werte 2027) ──
approx("2027 Tarif bis 13.846 steuerfrei", tarifsteuerAT(13846, 2027), 0);
approx("2027 Tarif 22.491", tarifsteuerAT(22491, 2027), 8645 * 0.2);
approx("2027 HBGL 7.410", berechneBruttoNettoAT({ ...basis, jahr: 2027, bruttoMonat: 10000 }).laufend.sv, r(7410 * 0.1807));
approx("2027 AV bestehend 2.400 € → 1,5 %", berechneBruttoNettoAT({ ...basis, jahr: 2027, bruttoMonat: 2400 }).laufend.svSatz * 100, 16.62, 1e-9);
approx("2027 AV neu 2.400 € → 2 %", berechneBruttoNettoAT({ ...basis, jahr: 2027, bruttoMonat: 2400, neuesDienstverhaeltnis: true }).laufend.svSatz * 100, 17.12, 1e-9);
approx("2027 AV neu 2.600 € → 2,95 %", berechneBruttoNettoAT({ ...basis, jahr: 2027, bruttoMonat: 2600, neuesDienstverhaeltnis: true }).laufend.svSatz * 100, 18.07, 1e-9);
approx("ohne AK-Umlage 17,57 %", berechneBruttoNettoAT({ ...basis, akUmlage: false }).laufend.svSatz * 100, 17.57, 1e-9);

// ── Pension 2026: 2.000 € → KV 120,00, LSt 78,22, netto 1.801,78 (veröffentlichtes Beispiel) ──
const p = berechnePensionAT({ bruttoPension: 2000, erhoehterPab: false, avabKinder: 0 });
approx("Pension 2.000 € KV", p.laufend.kv, 120);
approx("Pension 2.000 € LSt", p.laufend.lohnsteuer, 78.22);
approx("Pension 2.000 € netto", p.laufend.netto, 1801.78);
approx("Pension 2.000 € 14. Pension LSt (1.880 − 620) × 6 %", p.sonderzahlungen[0].lohnsteuer, 75.6);
approx("PAB 2026 voll bis 21.614", pabJahr(21614, false), 1020);
approx("PAB 2026 null ab 31.494", pabJahr(31494, false), 0);
approx("PAB 2027 voll 1.044", pabJahr(20000, false, 2027), 1044);
approx("Pension 1.200 € steuerfrei", berechnePensionAT({ bruttoPension: 1200, erhoehterPab: false, avabKinder: 0 }).laufend.lohnsteuer, 0);

console.log(failed ? `\n${failed} CHECK(S) FAILED` : "\nALL AUSTRIA CHECKS PASSED");
process.exit(failed ? 1 : 0);
