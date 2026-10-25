/**
 * Lohnpfändung gegen die amtliche Tabelle "Auszahlung für Monate" der
 * Pfändungsfreigrenzenbekanntmachung 2026 (BGBl. 2026 I Nr. 80, Anhang).
 * Jede Zeile unten ist wörtlich aus dem BGBl übernommen (Untergrenze der Zeile).
 */
import { pfaendbarerBetrag, pfaendungsfreibetrag, WEIHNACHTSGELD_UNPFAENDBAR } from "../lib/pfaendung.ts";

let failed = 0;
const eq = (name: string, got: number, want: number) => {
  const ok = Math.abs(got - want) < 0.005;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(2)}, want ${want.toFixed(2)}`);
};

// [Nettolohn, pfändbar bei 0, 1, 2, 3, 4, 5+ Personen]
const AMTLICH: [number, number[]][] = [
  [1589.99, [0, 0, 0, 0, 0, 0]],
  [1590.0, [1.82, 0, 0, 0, 0, 0]],
  [2000.0, [288.82, 0, 0, 0, 0, 0]],
  [2500.0, [638.82, 157.59, 0, 0, 0, 0]],
  [3000.0, [988.82, 407.59, 192.94, 44.86, 0, 0]],
  [4000.0, [1688.82, 907.59, 592.94, 344.86, 163.34, 48.39]],
  [4840.0, [2276.82, 1327.59, 928.94, 596.86, 331.34, 132.39]],
  [4850.0, [2283.82, 1332.59, 932.94, 599.86, 333.34, 133.39]],
  [4866.3, [2290.82, 1337.59, 936.94, 602.86, 335.34, 134.39]],
];

for (const [netto, werte] of AMTLICH) {
  werte.forEach((want, n) => eq(`${netto} € / ${n} Pers.`, pfaendbarerBetrag(netto, n), want));
}
// Zeilenmitte rundet ab: 2.009,99 € gehört zur Zeile ab 2.000 €.
eq("2.009,99 € / 0 Pers.", pfaendbarerBetrag(2009.99, 0), 288.82);
// "Der Mehrbetrag über 4 866,30 ist voll pfändbar."
eq("5.000 € / 0 Pers.", pfaendbarerBetrag(5000, 0), 2290.82 + (5000 - 4866.3));
eq("Freibetrag 0 Pers.", pfaendungsfreibetrag(0), 1587.4);
eq("Freibetrag 1 Pers.", pfaendungsfreibetrag(1), 2184.82);
eq("Freibetrag 5 Pers.", pfaendungsfreibetrag(5), 3516.14);
eq("Freibetrag 7 Pers. = 5", pfaendungsfreibetrag(7), 3516.14);
eq("Weihnachtsgeld unpfändbar (§ 850a Nr. 4)", WEIHNACHTSGELD_UNPFAENDBAR, 795);

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen`);
  process.exit(1);
}
console.log("\nAlle Prüfungen bestanden");
