/**
 * Nettorente-Engine (lib/renteNetto.ts) gegen feste Prüfpunkte.
 * Run: npm run test:rente
 *
 * Anker: Die 2026-Werte müssen exakt die Tabelle im Ratgeber
 * "rente-netto-berechnen" reproduzieren (dort per scripts/article-figures.mts
 * erzeugt) — sonst widersprechen sich Rechner und Artikel.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

// lib/renteNetto.ts importiert über den Next-Alias "@/…"; Node kennt den nicht.
const root = pathToFileURL(path.resolve(import.meta.dirname, "..") + "/").href;
register(
  "data:text/javascript," +
    encodeURIComponent(
      `export async function resolve(s, c, n) { if (s.startsWith("@/")) return n(${JSON.stringify(root)} + s.slice(2) + ".ts", c); return n(s, c); }`
    )
);
const { calculateRentenNetto, besteuerungsanteilProzent, steuerpflichtAbRente } = await import("../lib/renteNetto.ts");

let failed = 0;
function approx(name: string, got: number, want: number, eps = 0.01) {
  const ok = Math.abs(got - want) <= eps;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${got.toFixed(2)} (erwartet ${want})`);
  if (!ok) failed++;
}

// Besteuerungsanteil (Wachstumschancengesetz: ab 2023 +0,5 Pp. je Jahrgang)
approx("Anteil 2005", besteuerungsanteilProzent(2005), 50, 0);
approx("Anteil 2020", besteuerungsanteilProzent(2020), 80, 0);
approx("Anteil 2022", besteuerungsanteilProzent(2022), 82, 0);
approx("Anteil 2023", besteuerungsanteilProzent(2023), 82.5, 0);
approx("Anteil 2026", besteuerungsanteilProzent(2026), 84, 0);
approx("Anteil 2027", besteuerungsanteilProzent(2027), 84.5, 0);
approx("Anteil 2058", besteuerungsanteilProzent(2058), 100, 0);

// Ratgeber-Tabelle 2026 (Rentenbeginn 2026, mit Kindern, ohne Kirche)
const r = (b: number, jahr: 2026 | 2027 = 2026, beginn = 2026) =>
  calculateRentenNetto({ bruttoRenteMonat: b, rentenbeginn: beginn, jahr, kinderlos: false });
approx("2026 · 1.200 € netto", r(1200).nettoRenteMonat, 1051.8);
approx("2026 · 1.500 € Steuer/Monat", r(1500).steuerMonat, 4.92);
approx("2026 · 2.000 € KV+PV", r(2000).kvMonat + r(2000).pvMonat, 247.0);
approx("2026 · 2.000 € netto", r(2000).nettoRenteMonat, 1681.14);
approx("2026 · 3.000 € netto", r(3000).nettoRenteMonat, 2377.41);
approx("2026 · Steuerpflicht ab", steuerpflichtAbRente(2026, 2026), 1455, 0);

// 2027 (Gesetzentwurf): gleiche Rente, gleicher Rentenbeginn -> weniger Steuer
const d = r(2000, 2027).nettoRenteMonat - r(2000, 2026).nettoRenteMonat;
console.log(`  2.000 € Rentenbeginn 2026: 2027 netto ${r(2000, 2027).nettoRenteMonat.toFixed(2)} € (${d >= 0 ? "+" : ""}${d.toFixed(2)} €)`);
if (!(d > 0)) { console.log("✗ 2027 muss bei gleicher Rente entlasten"); failed++; }
console.log(`  Steuerpflicht ab: Beginn 2026 im Jahr 2027 ${steuerpflichtAbRente(2026, 2027)} €, Neurentner 2027 ${steuerpflichtAbRente(2027, 2027)} €`);

console.log(failed === 0 ? "\nALLE RENTEN-PRUEFUNGEN BESTANDEN" : `\n${failed} PRUEFUNG(EN) FEHLGESCHLAGEN`);
process.exit(failed === 0 ? 0 : 1);
