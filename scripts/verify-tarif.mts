/**
 * Prüft die in `lib/taxCalculator.ts` hinterlegten Einkommensteuertarife gegen
 * die Systematik des § 32a EStG.
 *
 * Der Sinn ist nicht, die Rechnung zu wiederholen, sondern die *Konstanten*
 * abzusichern: ein Tarif nach § 32a ist an jeder Zonengrenze stetig, und die
 * Grenzsteuersätze an den Tarifecken sind vorgegeben (14 % am Grundfreibetrag,
 * 23,97 % am Ende der ersten Progressionszone, 42 % / 45 % / 47 % darüber).
 * Ein Zahlendreher in einem der Koeffizienten bricht mindestens eine dieser
 * Bedingungen — deshalb fällt er hier auf, statt still ins Netto zu wandern.
 *
 * Quelle der 2027/2028-Werte: Referentenentwurf eines Einkommensteuerreform-
 * gesetzes 2027 (BMF, Bearbeitungsstand 18.08.2026), Artikel 1 und Artikel 2.
 *
 *   npm run verify:tarif
 */
import {
  estFormel2026,
  estFuerTarif,
  grenzsteuersatzFuerTarif,
  TARIF_2027_ENTWURF,
  TARIF_2028_ENTWURF,
  GRUNDFREIBETRAG,
  type Tarif,
} from "../lib/taxCalculator.ts";

const eur = (v: number) =>
  v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let fails = 0;
function check(label: string, got: number, want: number, tol: number) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fails++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}: ${eur(got)} (erwartet ${eur(want)})`);
}

/**
 * Ein § 32a-Tarif ist an jeder Zonengrenze stetig — sowohl im Steuerbetrag als
 * auch im Grenzsteuersatz. Beides wird hier für alle fünf Nahtstellen geprüft.
 */
function pruefeTarif(name: string, t: Tarif) {
  console.log(`\n── ${name} ──`);

  check(`ESt am Grundfreibetrag (${t.gfb} €) ist 0`, estFuerTarif(t, t.gfb), 0, 0);

  // Zone 2 → 3: der Anschlussbetrag `c` ist definitionsgemäß die ESt bei e1.
  check(`Anschlussbetrag c = ESt(${t.e1} €)`, estFuerTarif(t, t.e1), t.c, 0.02);

  // Zone 3 → 4: am Ende der zweiten Progressionszone muss die quadratische
  // Formel denselben Betrag liefern wie die lineare 42-%-Formel.
  check(`Naht ${t.e2} € → 42-%-Zone`, estFuerTarif(t, t.e2), 0.42 * t.e2 - t.c3, 0.35);

  // Zone 4 → 5 und 5 → 6: rein lineare Nahtstellen, hier muss es exakt passen.
  const reichensteuerAb = t.topStart + 1;
  check(
    `Naht ${reichensteuerAb} € → 45-%-Zone`,
    0.42 * reichensteuerAb - t.c3,
    0.45 * reichensteuerAb - t.c4,
    0.005
  );
  if (t.top2Start !== undefined) {
    const top2Ab = t.top2Start + 1;
    check(
      `Naht ${top2Ab} € → 47-%-Zone`,
      0.45 * top2Ab - t.c4,
      0.47 * top2Ab - t.c5!,
      0.005
    );
  }

  // Grenzsteuersätze an den Tarifecken.
  check(`Grenzsteuersatz bei ${t.gfb + 1} € = 14 %`, grenzsteuersatzFuerTarif(t, t.gfb + 1) * 100, 14, 0.01);
  check(`Grenzsteuersatz bei ${t.e1} € = 23,97 %`, grenzsteuersatzFuerTarif(t, t.e1) * 100, 23.97, 0.01);
  check(`Grenzsteuersatz bei ${t.e2} € = 42 %`, grenzsteuersatzFuerTarif(t, t.e2) * 100, 42, 0.02);
  if (t.top2Start !== undefined) {
    check(`Grenzsteuersatz bei 300.000 € = 47 %`, grenzsteuersatzFuerTarif(t, 300000) * 100, 47, 0.001);
  }
}

pruefeTarif("§ 32a EStG i. d. F. Art. 1 EStRefG 2027 (ab VZ 2027)", TARIF_2027_ENTWURF);
pruefeTarif("§ 32a EStG i. d. F. Art. 2 EStRefG 2027 (ab VZ 2028)", TARIF_2028_ENTWURF);

// Regressionsschutz: der geltende Tarif 2026 darf sich durch Reformarbeiten
// nicht verändern. Die Werte stammen aus der Gesetzesformel selbst.
console.log("\n── Geltender Tarif 2026 (unverändert) ──");
check("Grundfreibetrag 2026", GRUNDFREIBETRAG.amtlich2026, 12348, 0);
check("ESt(12.348 €) = 0", estFormel2026(12348), 0, 0);
check("ESt(12.349 €)", estFormel2026(12349), 0.14, 0.01);
check("ESt(69.878 €) = Naht 42-%-Zone", estFormel2026(69878), 0.42 * 69878 - 11135.63, 0.35);
// Die Abzugsbeträge des geltenden Tarifs 2026 sind im Gesetz auf Cent gerundet,
// die 45-%-Naht geht deshalb nur auf ~3 Cent auf. Das ist keine Ungenauigkeit
// dieses Moduls, sondern steht so im Gesetz — die Toleranz bildet das ab.
check("ESt(277.825 €) = Naht 45-%-Zone", 0.42 * 277826 - 11135.63, 0.45 * 277826 - 19470.38, 0.05);

console.log("\n── Jahres-Einkommensteuer im Vergleich (zvE, Grundtarif) ──");
const spalten = ["zvE", "2026", "Entwurf 2027", "Entwurf 2028", "Δ 2027", "Δ 2028"];
console.log(spalten.map((c, i) => c.padStart(i === 0 ? 10 : 14)).join(""));
for (const zve of [15000, 20000, 30000, 40000, 50000, 60000, 70600, 80000, 120000, 250000, 280000, 300000]) {
  const a = estFormel2026(zve);
  const b = estFuerTarif(TARIF_2027_ENTWURF, zve);
  const c = estFuerTarif(TARIF_2028_ENTWURF, zve);
  console.log(
    [eur(zve), eur(a), eur(b), eur(c), eur(b - a), eur(c - a)]
      .map((v, i) => v.padStart(i === 0 ? 10 : 14))
      .join("")
  );
}

console.log(
  fails === 0
    ? "\nAlle Pruefungen bestanden."
    : `\n${fails} Pruefung(en) fehlgeschlagen.`
);
process.exit(fails === 0 ? 0 : 1);
