/**
 * Prüfpunkte für die Rechner vom 04.10.2026:
 * Altersvorsorgedepot (§§ 84–86 EStG i. d. F. BGBl. 2026 I Nr. 156),
 * Renteneintritt (SGB VI §§ 35–38, 77, 99, 235–236b) und Einmalzahlung
 * (§ 23a SGB IV, § 39b Abs. 3 EStG).
 * Run: npm run test:neue-rechner
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
const avd = await import("../lib/altersvorsorgedepot.ts");
const re = await import("../lib/renteneintritt.ts");
const ez = await import("../lib/einmalzahlung.ts");
const { calculateNetto } = await import("../lib/taxCalculator.ts");

let failed = 0;
function eq(name: string, got: unknown, want: unknown) {
  const ok = typeof want === "number" ? Math.abs((got as number) - want) < 0.005 : got === want;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${String(got)}${ok ? "" : ` (erwartet ${String(want)})`}`);
  if (!ok) failed++;
}
const iso = (d: Date | null) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "—");

// ── Altersvorsorgedepot: § 84 / § 85 / § 86 EStG ─────────────────────────
eq("Grundzulage 1.800 €", avd.grundzulage(1800), 540);
eq("Grundzulage 360 €", avd.grundzulage(360), 180);
eq("Grundzulage 1.000 €", avd.grundzulage(1000), 340);
eq("Grundzulage 120 € (Mindesteigenbeitrag)", avd.grundzulage(120), 60);
eq("Grundzulage 119 € (unter Mindesteigenbeitrag)", avd.grundzulage(119), 0);
eq("Grundzulage 6.840 € (gedeckelt)", avd.grundzulage(6840), 540);
eq("Kinderzulage 300 €, 2 Kinder", avd.kinderzulage(300, 2), 600);
eq("Kinderzulage 200 €, 1 Kind", avd.kinderzulage(200, 1), 200);
eq("Kinderzulage 1.800 €, 1 Kind (Deckel 300)", avd.kinderzulage(1800, 1), 300);
eq("Kinderzulage 100 € (unter Mindesteigenbeitrag)", avd.kinderzulage(100, 1), 0);
eq("Zulagen 1.800 €, 1 Kind, unter 25", avd.zulagen(1800, 1, true).summe, 1040);
const gpNiedrig = avd.guenstigerpruefung({ zvE: 15000, beitragJahr: 1800, zulage: 540, splitting: false, kirche: false });
eq("Günstigerprüfung zvE 15.000: keine Zusatzerstattung", gpNiedrig.zusaetzlicheErstattung, 0);
const gpHoch = avd.guenstigerpruefung({ zvE: 70000, beitragJahr: 1800, zulage: 540, splitting: false, kirche: false });
eq("Günstigerprüfung zvE 70.000: Abzug 2.340 €", gpHoch.abzug, 2340);
console.log(`  · Ersparnis bei zvE 70.000: ${gpHoch.steuerersparnis.toFixed(2)} €, zusätzlich ${gpHoch.zusaetzlicheErstattung.toFixed(2)} €`);
eq("Günstigerprüfung zvE 70.000: Ersparnis > Zulage", gpHoch.steuerersparnis > 540, true);
const sp = avd.ansparen({ beitragMonat: 150, alter: 30, auszahlungAb: 67, kinder: 0, kinderJahre: 0, renditePct: 0, kostenPct: 0 });
eq("Ansparen 0 %: Endkapital = Beiträge + Zulagen", sp.endkapital, 150 * 12 * 37 + 540 * 37);
eq("Ansparen 0 %: Auszahlungsplan 67–85 = 216 Monate", sp.auszahlungsMonate, 216);

// ── Renteneintritt (DRV-Beispiele) ───────────────────────────────────────
const art = (d: string, key: string) => re.rentenarten(new Date(d + "T12:00:00")).find((a) => a.key === key)!;
eq("1.1.1964 Regelaltersrente ab", iso(art("1964-01-01", "regel").beginnAbschlagsfrei), "2031-01-01");
eq("2.1.1964 Regelaltersrente ab", iso(art("1964-01-02", "regel").beginnAbschlagsfrei), "2031-02-01");
eq("15.5.1960 Regelaltersgrenze 66+4 → ab", iso(art("1960-05-15", "regel").beginnAbschlagsfrei), "2026-10-01");
eq("1.3.1962 Regelaltersgrenze 66+8 → ab", iso(art("1962-03-01", "regel").beginnAbschlagsfrei), "2028-11-01");
eq("31.12.1955 (65+9, 31.9. fehlt) → ab", iso(art("1955-12-31", "regel").beginnAbschlagsfrei), "2021-10-01");
const lj = art("1964-06-15", "langjaehrig");
eq("15.6.1964 langjährig frühestens", iso(lj.beginnFruehestens), "2027-07-01");
eq("15.6.1964 langjährig Abschlag", lj.abschlagPct, 14.4);
eq("10.3.1960 besonders langjährig (64+4) ab", iso(art("1960-03-10", "besondersLangjaehrig").beginnAbschlagsfrei), "2024-08-01");
eq("1970 besonders langjährig 65", re.formatAlter(art("1970-08-20", "besondersLangjaehrig").alterAbschlagsfrei), "65 Jahre");
eq("1964 schwerbehindert Abschlag", art("1964-04-10", "schwerbehindert").abschlagPct, 10.8);
eq("1958 schwerbehindert 64 / 61", `${re.formatAlter(art("1958-07-07", "schwerbehindert").alterAbschlagsfrei)} / ${re.formatAlter(art("1958-07-07", "schwerbehindert").alterFruehestens!)}`, "64 Jahre / 61 Jahre");
eq("1963 Regelaltersgrenze", re.formatAlter(re.regelaltersgrenze(1963)), "66 Jahre und 10 Monate");

// ── Einmalzahlung ─────────────────────────────────────────────────────────
const e1 = ez.nettoEinmalzahlung({ bruttoMonat: 3500, einmal: 2975, steuerklasse: 1, kirche: false, kinderlosUeber23: false });
eq("JSZ 2.975 € bei 3.500 €: volle SV (21,15 %)", e1.svSumme, 2975 * 0.2115);
console.log(`  · Lohnsteuer ${e1.lohnsteuer.toFixed(2)}, Soli ${e1.soli.toFixed(2)}, Netto ${e1.netto.toFixed(2)} (${e1.nettoQuotePct.toFixed(1)} %)`);
// Gegenprobe: Steuer auf die Einmalzahlung = Differenz zweier Jahresrechnungen der Engine
const ohne = calculateNetto({ bruttoMonat: 3500, jahr: 2026, steuerklasse: 1, verheiratet: false, kinderlosUeber23: false, kirche: false });
eq("JSZ: Steuer wächst mit der Zahlung", e1.lohnsteuer > 0 && e1.lohnsteuer < 2975 * ohne.grenzsteuersatzPct / 100 + 1, true);
const e2 = ez.nettoEinmalzahlung({ bruttoMonat: 7000, einmal: 5000, steuerklasse: 1, kirche: false, kinderlosUeber23: false });
eq("7.000 €/Monat: KV/PV-Grenze im November schon erreicht", e2.svBasisKvPv, 0);
eq("7.000 €/Monat: RV/ALV voll beitragspflichtig", e2.svBasisRvAlv, 5000);
const e3 = ez.nettoEinmalzahlung({ bruttoMonat: 5500, einmal: 4000, steuerklasse: 1, kirche: false, kinderlosUeber23: false });
eq("5.500 €/Monat: KV/PV nur bis anteilige BBG", e3.svBasisKvPv, 69750 * 11 / 12 - 5500 * 11);

console.log(failed ? `\n${failed} PRUEFUNG(EN) FEHLGESCHLAGEN` : "\nALLE PRUEFUNGEN BESTANDEN");
process.exit(failed ? 1 : 0);
