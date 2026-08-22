/**
 * article-figures.mts — rechnet die Zahlen aus, die in den Ratgeber-Artikeln
 * stehen, mit derselben Engine wie die Rechner-Seiten.
 *
 * Grund: Ein Ratgeber, der andere Zahlen nennt als der eigene Rechner, ist ein
 * Vertrauensschaden — und genau das passiert, sobald Werte von Hand abgetippt
 * werden. Alles Zitierte kommt hier aus lib/taxCalculator.ts.
 *
 *   node scripts/article-figures.mts
 */

import {
  calculateNetto,
  estFormel2026,
  soliBerechnen,
  formatEUR,
  type Steuerklasse,
} from "../lib/taxCalculator.ts";

const line = (s = "") => console.log(s);
const h = (s: string) => line(`\n══ ${s} ${"═".repeat(Math.max(0, 60 - s.length))}`);

/* ── 1. Kinderfreibetrag: ab wann schlägt er das Kindergeld? ───────── */
h("Kinderfreibetrag 2026 — Günstigerprüfung");

const KINDERFREIBETRAG_2026 = 6828 + 2928; // sächlich + BEA
const KINDERGELD_JAHR = 259 * 12;

line(`Kinderfreibetrag gesamt: ${formatEUR(KINDERFREIBETRAG_2026)}  (6.828 € sächlich + 2.928 € BEA)`);
line(`Kindergeld pro Jahr:     ${formatEUR(KINDERGELD_JAHR)}  (259 €/Monat)`);

/** Steuerersparnis durch den Freibetrag bei gegebenem zvE (Alleinerziehend/Single). */
function ersparnisDurchFreibetrag(zvE: number, freibetrag: number): number {
  return estFormel2026(zvE) - estFormel2026(Math.max(0, zvE - freibetrag));
}

// Break-even suchen: ab welchem zvE ist die Ersparnis > Kindergeld?
let breakEvenSingle = 0;
for (let zvE = 20000; zvE <= 200000; zvE += 100) {
  if (ersparnisDurchFreibetrag(zvE, KINDERFREIBETRAG_2026) >= KINDERGELD_JAHR) {
    breakEvenSingle = zvE;
    break;
  }
}
// Verheiratet: Splitting → doppelter Freibetrag auf das halbierte zvE
let breakEvenPaar = 0;
for (let zvE = 40000; zvE <= 400000; zvE += 200) {
  const ersparnis = 2 * ersparnisDurchFreibetrag(zvE / 2, KINDERFREIBETRAG_2026);
  if (ersparnis >= KINDERGELD_JAHR) {
    breakEvenPaar = zvE;
    break;
  }
}
line(`Break-even Single (1 Kind):      ab ca. ${formatEUR(breakEvenSingle)} zvE`);
line(`Break-even Ehepaar (1 Kind):     ab ca. ${formatEUR(breakEvenPaar)} zvE`);

line("\nErsparnis-Tabelle (Single, 1 Kind, voller Freibetrag 9.756 €):");
for (const zvE of [30000, 40000, 50000, 60000, 70000, 80000, 100000]) {
  const e = ersparnisDurchFreibetrag(zvE, KINDERFREIBETRAG_2026);
  const besser = e > KINDERGELD_JAHR ? "Freibetrag" : "Kindergeld";
  line(
    `  zvE ${String(zvE).padStart(6)} € → Steuerersparnis ${formatEUR(e).padStart(11)}` +
      `  | Kindergeld ${formatEUR(KINDERGELD_JAHR)} → günstiger: ${besser}`
  );
}

/* ── 2. Solidaritätszuschlag: ab welchem Brutto? ───────────────────── */
h("Solidaritätszuschlag 2026 — ab welchem Einkommen?");

const SOLI_FREIGRENZE_SINGLE = 20350;
line(`Freigrenze (ESt/Lohnsteuer im Jahr): ${formatEUR(SOLI_FREIGRENZE_SINGLE)} (Single), ${formatEUR(40700)} (Splitting)`);

/** Standard-Eingabe für die Beispielrechnungen: kinderlos, keine Kirche, nicht Sachsen. */
function input(bruttoMonat: number, steuerklasse: Steuerklasse) {
  return {
    bruttoMonat,
    jahr: 2026 as const,
    verheiratet: steuerklasse === 3 || steuerklasse === 5,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse,
  };
}

/** Kleinstes Monatsbrutto, bei dem in der Lohnabrechnung Soli anfällt. */
function ersterSoliMonat(steuerklasse: Steuerklasse): { brutto: number; soli: number } | null {
  for (let brutto = 3000; brutto <= 40000; brutto += 10) {
    const r = calculateNetto(input(brutto, steuerklasse));
    if (r.steuer.soliJahr > 0) return { brutto, soli: r.steuer.soliJahr / 12 };
  }
  return null;
}

for (const stk of [1, 3, 4] as Steuerklasse[]) {
  const res = ersterSoliMonat(stk);
  line(
    res
      ? `  Steuerklasse ${stk}: Soli ab ca. ${formatEUR(res.brutto)} brutto/Monat ` +
        `(= ${formatEUR(res.brutto * 12)}/Jahr), erste Soli-Zahlung ${formatEUR(res.soli)}/Monat`
      : `  Steuerklasse ${stk}: kein Soli im geprüften Bereich`
  );
}

line("\nSoli-Beispiele (Jahres-ESt → Soli, Single):");
for (const est of [20000, 21000, 22000, 25000, 30000, 40000, 60000]) {
  line(`  ESt ${formatEUR(est).padStart(11)} → Soli ${formatEUR(soliBerechnen(est, false)).padStart(10)}`);
}

/* ── 3. Brutto→Netto in Prozent ────────────────────────────────────── */
h("Wie viel Prozent bleiben vom Brutto? (StKl 1, kinderlos, NRW, ohne Kirche)");

for (const brutto of [2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000]) {
  const r = calculateNetto(input(brutto, 1));
  const quote = (r.nettoMonat / brutto) * 100;
  const steuernAnteil = (r.steuer.summeMonat / brutto) * 100;
  const svAnteil = (r.sv.summeMonat / brutto) * 100;
  line(
    `  ${String(brutto).padStart(6)} € → netto ${formatEUR(r.nettoMonat).padStart(11)}` +
      ` = ${quote.toFixed(1).padStart(5)} %   (Steuern ${steuernAnteil.toFixed(1).padStart(4)} %, SV ${svAnteil.toFixed(1)} %)`
  );
}

/* ── 4. Steuerklasse III/V vs. IV/IV ───────────────────────────────── */
h("Steuerklassenkombination — III/V vs. IV/IV (monatlich, kinderlos)");

function nettoFor(brutto: number, stk: Steuerklasse) {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026 as const,
    verheiratet: true,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: stk,
  }).nettoMonat;
}

for (const [a, b] of [
  [5000, 2000],
  [4500, 2500],
  [4000, 3000],
  [3500, 3500],
] as [number, number][]) {
  const kombi35 = nettoFor(a, 3) + nettoFor(b, 5);
  const kombi44 = nettoFor(a, 4) + nettoFor(b, 4);
  line(
    `  ${a} € + ${b} € → III/V: ${formatEUR(kombi35).padStart(11)}` +
      ` | IV/IV: ${formatEUR(kombi44).padStart(11)}` +
      ` | Differenz/Monat: ${formatEUR(kombi35 - kombi44)}`
  );
}

/* ── 5. Pendlerpauschale 2026 (0,38 € ab dem 1. km) ────────────────── */
h("Pendlerpauschale 2026 — 0,38 €/km ab dem ersten Kilometer");

const SATZ_2026 = 0.38;
line("  km (einfach) | 220 Arbeitstage | alt (0,30/0,38) | Differenz");
for (const km of [10, 15, 20, 25, 30, 40, 50]) {
  const neu = km * SATZ_2026 * 220;
  const alt = (Math.min(km, 20) * 0.3 + Math.max(0, km - 20) * 0.38) * 220;
  line(
    `  ${String(km).padStart(3)} km       | ${formatEUR(neu).padStart(11)}` +
      ` | ${formatEUR(alt).padStart(11)} | +${formatEUR(neu - alt)}`
  );
}

/* ── 6. Homeoffice-Pauschale vs. Werbungskostenpauschale ───────────── */
h("Homeoffice-Pauschale 2026 (6 €/Tag, max. 210 Tage = 1.260 €)");
const AN_PAUSCHBETRAG = 1230;
for (const tage of [60, 100, 150, 205, 210]) {
  const hp = tage * 6;
  line(
    `  ${String(tage).padStart(3)} Tage → ${formatEUR(hp).padStart(10)}` +
      `  ${hp > AN_PAUSCHBETRAG ? "✓ übersteigt" : "✗ unter"} Arbeitnehmer-Pauschbetrag (${formatEUR(AN_PAUSCHBETRAG)})`
  );
}
line(`  Ab ${Math.ceil((AN_PAUSCHBETRAG + 1) / 6)} Homeoffice-Tagen wirkt die Pauschale überhaupt erst steuerlich.`);

line();

/* ── 7. Nettorente 2026 (Rentenbeginn 2026 → 84 % steuerpflichtig) ── */
h("Nettorente 2026 — Rentenbeginn 2026, KVdR + Steuer");

const KV_RENTNER = 0.073 + 0.0145;   // 7,30 % + halber Zusatzbeitrag (2,9 %)
const PV_RENTNER = 0.036;            // volle 3,6 %, Rentner tragen allein
const PV_RENTNER_KINDERLOS = 0.042;
const BESTEUERUNGSANTEIL_2026 = 0.84;
const WK_PAUSCHBETRAG_RENTE = 102;
const SONDERAUSGABEN_PAUSCHALE = 36;

line("  Brutto/Mon | KV+PV    | Steuer/Mon | Netto/Mon  | Netto-Quote");
for (const brutto of [1200, 1500, 1800, 2000, 2500, 3000]) {
  const kv = brutto * KV_RENTNER;
  const pv = brutto * PV_RENTNER;
  const svJahr = (kv + pv) * 12;

  const steuerpflichtigJahr = brutto * 12 * BESTEUERUNGSANTEIL_2026;
  // Sonderausgaben: KV/PV-Beiträge sind abziehbar (vereinfacht in voller Höhe)
  const zvE = Math.max(0, steuerpflichtigJahr - WK_PAUSCHBETRAG_RENTE - svJahr - SONDERAUSGABEN_PAUSCHALE);
  const estJahr = estFormel2026(zvE);

  const nettoMonat = brutto - kv - pv - estJahr / 12;
  line(
    `  ${String(brutto).padStart(6)} €  | ${formatEUR(kv + pv).padStart(8)} | ${formatEUR(estJahr / 12).padStart(10)}` +
      ` | ${formatEUR(nettoMonat).padStart(10)} | ${((nettoMonat / brutto) * 100).toFixed(1)} %`
  );
}

// Ab welcher Bruttorente wird überhaupt Steuer fällig?
let ersteSteuerRente = 0;
for (let b = 900; b <= 3000; b += 5) {
  const svJahr = (b * KV_RENTNER + b * PV_RENTNER) * 12;
  const zvE = Math.max(0, b * 12 * BESTEUERUNGSANTEIL_2026 - WK_PAUSCHBETRAG_RENTE - svJahr - SONDERAUSGABEN_PAUSCHALE);
  if (estFormel2026(zvE) > 0) { ersteSteuerRente = b; break; }
}
line(`\n  Steuerpflicht beginnt ab ca. ${formatEUR(ersteSteuerRente)} Bruttorente/Monat (Rentenbeginn 2026).`);
line();

/* ── 8. Steuerklasse II — was der Entlastungsbetrag bringt ─────────── */
h("Steuerklasse I vs. II (Entlastungsbetrag 4.260 €)");
line("  Brutto/Mon | Netto StKl I | Netto StKl II | Vorteil/Mon | Vorteil/Jahr");
for (const b of [2000, 2500, 3000, 3500, 4000, 5000]) {
  const i = calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 }).nettoMonat;
  const ii = calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 2 }).nettoMonat;
  line(`  ${String(b).padStart(6)} €  | ${formatEUR(i).padStart(11)} | ${formatEUR(ii).padStart(12)} | ${formatEUR(ii - i).padStart(10)} | ${formatEUR((ii - i) * 12)}`);
}

/* ── 9. Gehaltserhöhung — was netto ankommt ────────────────────────── */
h("Gehaltserhöhung 2026 — Brutto-Plus vs. Netto-Plus (StKl I, kinderlos)");
line("  Ausgangsbrutto | Erhöhung | Netto-Plus | davon bleibt | Grenzbelastung");
for (const [start, plus] of [[2500, 100], [3000, 150], [3500, 200], [4000, 200], [5000, 300], [6000, 500]] as [number, number][]) {
  const a = calculateNetto({ bruttoMonat: start, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).nettoMonat;
  const b = calculateNetto({ bruttoMonat: start + plus, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).nettoMonat;
  const netPlus = b - a;
  line(
    `  ${String(start).padStart(9)} €  | ${String(plus).padStart(5)} €  | ${formatEUR(netPlus).padStart(9)}` +
      ` | ${((netPlus / plus) * 100).toFixed(1).padStart(5)} % | ${(100 - (netPlus / plus) * 100).toFixed(1)} %`
  );
}

/* ── 10. Sozialabgaben 2026 — Arbeitnehmeranteil im Detail ─────────── */
h("Sozialabgaben 2026 — Arbeitnehmeranteil (StKl I, kinderlos)");
line("  Brutto/Mon | RV      | ALV    | KV      | PV     | Summe    | in %");
for (const b of [2000, 3000, 4000, 5000, 6000, 8000]) {
  const r = calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
  line(
    `  ${String(b).padStart(6)} €  | ${formatEUR(r.sv.rente).padStart(8)} | ${formatEUR(r.sv.arbeitslosen).padStart(7)}` +
      ` | ${formatEUR(r.sv.kranken).padStart(8)} | ${formatEUR(r.sv.pflege).padStart(7)}` +
      ` | ${formatEUR(r.sv.summeMonat).padStart(9)} | ${((r.sv.summeMonat / b) * 100).toFixed(1)} %`
  );
}

/* ── 11. Midijob-Übergangsbereich — AN-Entlastung ──────────────────── */
h("Midijob 2026 — Übergangsbereich 603,01 € bis 2.000 €");
line("  Brutto/Mon | SV-Anteil AN | reguläre 21,8 % | Ersparnis");
for (const b of [620, 800, 1000, 1200, 1500, 1800, 2000, 2100]) {
  const r = calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
  const regulaer = b * 0.218;
  const im = b > 603 && b <= 2000 ? "  (Übergangsbereich)" : "";
  line(
    `  ${String(b).padStart(6)} €  | ${formatEUR(r.sv.summeMonat).padStart(12)} | ${formatEUR(regulaer).padStart(15)}` +
      ` | ${formatEUR(Math.max(0, regulaer - r.sv.summeMonat)).padStart(9)}${im}`
  );
}
line();
