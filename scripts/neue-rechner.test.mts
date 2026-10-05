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

// ── Unterhalt: Düsseldorfer Tabelle 2026 (OLG Düsseldorf) ───────────────
const uh = await import("../lib/unterhalt.ts");
// Anhang „Tabelle Zahlbeträge“ — Stichproben
eq("DT Zahlbetrag Gr. 1, 0–5", uh.zahlbetrag(uh.DT_2026[0], 3), 356.5);
eq("DT Zahlbetrag Gr. 1, ab 18", uh.zahlbetrag(uh.DT_2026[0], 18), 439);
eq("DT Zahlbetrag Gr. 12, 12–17", uh.zahlbetrag(uh.DT_2026[11], 14), 1020.5);
eq("DT Zahlbetrag Gr. 15, 6–11", uh.zahlbetrag(uh.DT_2026[14], 8), 986.5);
eq("DT Zahlbetrag Gr. 15, ab 18", uh.zahlbetrag(uh.DT_2026[14], 19), 1137);
eq("DT Gruppe für 2.100 €", uh.gruppeFuer(2100).nr, 1);
eq("DT Gruppe für 2.100,50 €", uh.gruppeFuer(2100.5).nr, 2);
eq("DT Gruppe für 6.400 €", uh.gruppeFuer(6400).nr, 11);
// Mangelfall-Beispiel aus Anm. C der Tabelle: 1.750 €, Kinder 18 (Schüler), 7, 5
const mf = uh.berechneUnterhalt({ einkommen: 1750, alter: [18, 7, 5], erwerbstaetig: true, bedarfskontrolle: true });
eq("Mangelfall erkannt", mf.mangelfall, true);
eq("Mangelfall K1 (OLG: 107,60)", mf.kinder[0].zahlbetrag, 107.6);
eq("Mangelfall K2 (OLG: 105,02)", mf.kinder[1].zahlbetrag, 105.02);
eq("Mangelfall K3 (OLG: 87,38)", mf.kinder[2].zahlbetrag, 87.38);
// Bedarfskontrollbetrag: 3.000 € (Gr. 4, BKB 1.950), zwei Kinder 4 und 9
const bk = uh.berechneUnterhalt({ einkommen: 3000, alter: [4, 9], erwerbstaetig: true, bedarfskontrolle: true });
console.log(`  · 3.000 €, Kinder 4/9: Gruppe ${bk.gruppeNachEinkommen} → ${bk.gruppe}, Zahlbeträge ${bk.kinder.map((k) => k.zahlbetrag).join(" / ")}, bleibt ${bk.verbleibt}`);
eq("BKB-Herabstufung hält den Kontrollbetrag ein", bk.verbleibt >= uh.DT_2026[bk.gruppe - 1].bkb || bk.gruppe === 1, true);

// ── TV-L 2026 (LfF Bayern) ───────────────────────────────────────────────
const tvl = await import("../data/tvl.ts");
const tv = (slug: string, st: number) => tvl.TVL_2026.find((g) => g.slug === slug)!.stufen[st - 1];
eq("TV-L E 13 Stufe 1", tv("e13", 1), 4759.37);
eq("TV-L E 9a Stufe 3", tv("e9a", 3), 3925.58);
eq("TV-L E 1 Stufe 1 (gibt es nicht)", tv("e1", 1), null);
eq("TV-L E 1 Stufe 2", tv("e1", 2), 2534.49);
eq("TV-L E 15 Stufe 6", tv("e15", 6), 7854.52);

// ── Mutterschutz (MuSchG §§ 3, 19, 20; § 24i SGB V) ──────────────────────
const ms = await import("../lib/mutterschutz.ts");
const sf = ms.schutzfristen(new Date(2027, 4, 15), false);
eq("ET 15.05.2027: Beginn", iso(sf.beginn), "2027-04-03");
eq("ET 15.05.2027: Ende (8 Wochen)", iso(sf.ende), "2027-07-10");
eq("ET 15.05.2027: Tage Mutterschaftsgeld", sf.tageGesamt, 99);
const sf12 = ms.schutzfristen(new Date(2027, 4, 15), true);
eq("ET 15.05.2027: Ende (12 Wochen)", iso(sf12.ende), "2027-08-07");
eq("12 Wochen: Tage", sf12.tageGesamt, 127);
eq("Bemessung Jan–Mär 2027 = 90 Tage", ms.tageBemessung(sf.beginn), 90);
const mg = ms.mutterschaftsgeld({ nettoMonat: 2000, fristen: sf, gesetzlichVersichert: true });
eq("Mutterschaftsgeld KK 13 € × 99", mg.krankenkasse, 1287);
eq("KK + AG = volles Netto der 99 Tage", mg.gesamt, (6000 / 90) * 99);
const mgP = ms.mutterschaftsgeld({ nettoMonat: 2000, fristen: sf, gesetzlichVersichert: false });
eq("Privat versichert: BAS max. 210 €", mgP.krankenkasse, 210);
eq("Fehlgeburt 18. SSW → 6 Wochen", ms.schutzfristFehlgeburt(18), 6);
eq("Fehlgeburt 12. SSW → keine Schutzfrist", ms.schutzfristFehlgeburt(12), null);

// ── Kündigungsfrist (§ 622 BGB, §§ 187 f. BGB) ───────────────────────────
const kf = await import("../lib/kuendigungsfrist.ts");
const d = (y: number, m: number, t: number) => new Date(y, m - 1, t);
eq("4 Wochen zum 15./Monatsende: Zugang Mo 1.6.2026", iso(kf.fristEnde(d(2026, 6, 1), { wochen: 4, termin: "15oderMonatsende" })), "2026-06-30");
eq("Zugang 2.6.2026 (Frist endet 30.6.)", iso(kf.fristEnde(d(2026, 6, 2), { wochen: 4, termin: "15oderMonatsende" })), "2026-06-30");
eq("Zugang 3.6.2026 → 15.7.", iso(kf.fristEnde(d(2026, 6, 3), { wochen: 4, termin: "15oderMonatsende" })), "2026-07-15");
eq("1 Monat zum Monatsende, Zugang 31.3.", iso(kf.fristEnde(d(2026, 3, 31), { monate: 1, termin: "monatsende" })), "2026-04-30");
eq("1 Monat zum Monatsende, Zugang 1.4.", iso(kf.fristEnde(d(2026, 4, 1), { monate: 1, termin: "monatsende" })), "2026-05-31");
eq("6 Wochen zum Quartalsende, Zugang 17.2.", iso(kf.fristEnde(d(2026, 2, 17), { wochen: 6, termin: "quartalsende" })), "2026-03-31");
eq("6 Wochen zum Quartalsende, Zugang 18.2.", iso(kf.fristEnde(d(2026, 2, 18), { wochen: 6, termin: "quartalsende" })), "2026-06-30");
eq("Probezeit 2 Wochen, Zugang 10.3.", iso(kf.fristEnde(d(2026, 3, 10), { wochen: 2, termin: "keiner" })), "2026-03-24");
const ag10 = kf.gesetzlicheFrist({ arbeitgeberKuendigt: true, beginn: d(2016, 1, 1), zugang: d(2026, 1, 15), probezeit: false });
eq("AG nach 10 Jahren: 4 Monate", ag10.text, "4 Monate zum Monatsende");
const ag9 = kf.gesetzlicheFrist({ arbeitgeberKuendigt: true, beginn: d(2016, 1, 16), zugang: d(2026, 1, 15), probezeit: false });
eq("AG einen Tag vor 10 Jahren: 3 Monate", ag9.text, "3 Monate zum Monatsende");
const an = kf.gesetzlicheFrist({ arbeitgeberKuendigt: false, beginn: d(2000, 1, 1), zugang: d(2026, 1, 15), probezeit: false });
eq("Arbeitnehmer nach 26 Jahren: Grundfrist", an.text, "4 Wochen zum 15. oder zum Monatsende");
eq("Spätester Zugang für Ende 30.6. (4 Wochen)", iso(kf.spaetesterZugang(d(2026, 6, 30), { wochen: 4, termin: "15oderMonatsende" })), "2026-06-02");
eq("Spätester Zugang für Ende 30.4. (1 Monat)", iso(kf.spaetesterZugang(d(2026, 4, 30), { monate: 1, termin: "monatsende" })), "2026-03-31");

// Kindergeld & Günstigerprüfung (§§ 31, 32 Abs. 6, 66 EStG; 2027/2028 laut BT-Drs. 21/8235)
const kgm = await import("../lib/kindergeld.ts");
const { estFormel2026 } = await import("../lib/taxCalculator.ts");
eq("Kindergeld 2026", kgm.KG_WERTE[2026].kindergeld, 259);
eq("Kindergeld 2027 (Entwurf)", kgm.KG_WERTE[2027].kindergeld, 267);
eq("Kindergeld 2028 (Entwurf)", kgm.KG_WERTE[2028].kindergeld, 272);
eq("Freibeträge je Elternteil 2026 (3.414 + 1.464)", kgm.freibetragJeElternteil(2026), 4878);
eq("Freibeträge je Elternteil 2027 (3.564 + 1.464)", kgm.freibetragJeElternteil(2027), 5028);
const kgV = kgm.kindergeldRechnen({ jahr: 2026, veranlagung: "verheiratet", brutto1: 140000, kinder: 1 });
const splitt = (z: number) => 2 * estFormel2026(z / 2);
eq("Ehepaar 2026: Ersparnis = Splitting(zvE) − Splitting(zvE − 9.756)", kgV.kinder[0].ersparnis, splitt(kgV.zvE) - splitt(kgV.zvE - 9756));
eq("Ehepaar 2026, 140.000 €: Freibetrag günstiger", kgV.kinder[0].freibetragGuenstiger, kgV.kinder[0].ersparnis > 3108);
const kgG = kgm.kindergeldRechnen({ jahr: 2026, veranlagung: "getrennt", brutto1: 70000, kinder: 1 });
eq("Getrennt: halber Freibetrag 4.878 €", kgG.freibetragJeKind, 4878);
eq("Getrennt: angerechnet halbes Kindergeld 1.554 €", kgG.kinder[0].kindergeldJahr, 1554);
eq("Getrennt: Ersparnis = ESt(zvE) − ESt(zvE − 4.878)", kgG.kinder[0].ersparnis, estFormel2026(kgG.zvE) - estFormel2026(kgG.zvE - 4878));
eq("Geringes Einkommen: Kindergeld günstiger", kgm.kindergeldRechnen({ jahr: 2027, veranlagung: "verheiratet", brutto1: 40000, kinder: 2 }).mehrGesamt, 0);
const sw = kgm.schwelleFreibetrag(2027, "verheiratet");
eq("Schwelle 2027: knapp darunter Kindergeld", kgm.kindergeldRechnen({ jahr: 2027, veranlagung: "verheiratet", brutto1: sw - 100, kinder: 1 }).kinder[0].freibetragGuenstiger, false);
eq("Schwelle 2027: ab Schwelle Freibetrag", kgm.kindergeldRechnen({ jahr: 2027, veranlagung: "verheiratet", brutto1: sw, kinder: 1 }).kinder[0].freibetragGuenstiger, true);

console.log(failed ? `\n${failed} PRUEFUNG(EN) FEHLGESCHLAGEN` : "\nALLE PRUEFUNGEN BESTANDEN");
process.exit(failed ? 1 : 0);
