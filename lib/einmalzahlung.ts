/**
 * Netto einer Einmalzahlung (sonstiger Bezug): Jahressonderzahlung,
 * Weihnachtsgeld, Urlaubsgeld, Bonus.
 *
 * Sozialversicherung — § 23a Abs. 3 SGB IV: Einmalig gezahltes Arbeitsentgelt
 * ist beitragspflichtig, soweit es zusammen mit dem bisher im Kalenderjahr
 * gezahlten beitragspflichtigen Entgelt die ANTEILIGE Jahres-
 * Beitragsbemessungsgrenze bis zum Ende des Auszahlungsmonats nicht
 * übersteigt. Bei einer Zahlung im November und ganzjähriger Beschäftigung:
 * BBG × 11/12 minus 11 Monatsgehälter.
 *
 * Lohnsteuer — § 39b Abs. 3 EStG: Jahreslohnsteuer auf (voraussichtlicher
 * Jahresarbeitslohn + sonstiger Bezug) minus Jahreslohnsteuer auf den
 * Jahresarbeitslohn allein. Gerechnet mit genau der Steuerklassen-Logik von
 * `calculateNetto` (`steuerNachKlasse`), damit Einmalzahlung und laufendes
 * Gehalt nach derselben Engine laufen.
 *
 * Optional (alle mit Standardwerten, die das bisherige Verhalten erhalten):
 *  - `beschaeftigtAbMonat`: Beschäftigung erst ab Monat X (Eintritt im Lauf des
 *    Jahres). Jahresarbeitslohn = Monatsbrutto × Beschäftigungsmonate; die
 *    anteilige BBG zählt nur die Monate von X bis zur Auszahlung (§ 23a Abs. 3
 *    SGB IV: Dauer der Beschäftigung beim selben Arbeitgeber im Kalenderjahr).
 *  - `bisherigeEinmalzahlungen`: im selben Jahr schon gezahlte Sonderzahlungen
 *    (z. B. Urlaubsgeld). Sie verbrauchen BBG-Spielraum und erhöhen den
 *    Jahresarbeitslohn — beides "mit" und "ohne" die neue Zahlung. Ihre eigenen
 *    Sozialabgaben werden vereinfacht so gerechnet, als wären sie im
 *    Auszahlungszeitraum der neuen Zahlung angefallen.
 *  - `kinderfreibetraege` (Zähler laut ELStAM, nur Klasse I–IV): mindern nach
 *    § 51a Abs. 2a EStG die Bemessungsgrundlage für Soli und Kirchensteuer, nicht
 *    die Lohnsteuer. Je Zähler 1,0 in Klasse I–III 9.756 €, in Klasse IV 4.878 €
 *    (2 × 3.414 € + 2 × 1.464 €, 2026).
 *  - `kirchensteuerSatz` (8 % BY/BW, sonst 9 %) und `sachsen` (PV-AN-Anteil).
 *
 * Bewusst NICHT abgebildet: Midijob-Sonderregeln für Einmalzahlungen
 * (Übergangsbereich bis 2.000 €) — `naeherung` ist dann true und die Seite
 * sagt das. Ebenso nicht: die Märzklausel (§ 23a Abs. 4 SGB IV) für Zahlungen
 * von Januar bis März.
 */
import {
  ARBEITNEHMER_PAUSCHBETRAG,
  BBG_2026,
  BETREUUNGSFREIBETRAG,
  KINDERFREIBETRAG,
  calculateNetto,
  isMidijob,
  steuerNachKlasse,
  type Steuerklasse,
} from "@/lib/taxCalculator";

export interface EinmalzahlungInput {
  bruttoMonat: number;
  einmal: number;
  steuerklasse: Steuerklasse;
  kirche: boolean;
  kinderlosUeber23: boolean;
  /** 1–12; Jahressonderzahlung TVöD/TV-L: November = 11. */
  auszahlungsMonat?: number;
  kvZusatzbeitrag?: number;
  /** 1–12, Standard 1 (ganzjährig beschäftigt). */
  beschaeftigtAbMonat?: number;
  /** Im selben Kalenderjahr bereits gezahlte Einmalzahlungen (brutto), Standard 0. */
  bisherigeEinmalzahlungen?: number;
  /** Kinderfreibetrags-Zähler (0, 0,5, 1, 1,5 …), nur Klasse I–IV wirksam. */
  kinderfreibetraege?: number;
  /** 0,08 (Bayern, Baden-Württemberg) oder 0,09; Standard 0,09. */
  kirchensteuerSatz?: number;
  /** Sachsen: höherer PV-Arbeitnehmeranteil. */
  sachsen?: boolean;
}

export interface EinmalzahlungResult {
  einmal: number;
  svKranken: number;
  svPflege: number;
  svRente: number;
  svArbeitslosen: number;
  svSumme: number;
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
  steuerSumme: number;
  netto: number;
  nettoQuotePct: number;
  /** Beitragspflichtiger Teil der Einmalzahlung (KV/PV bzw. RV/ALV). */
  svBasisKvPv: number;
  svBasisRvAlv: number;
  /** Monate, für die 2026 Gehalt gezahlt wird (12 − Eintrittsmonat + 1). */
  beschaeftigungsMonate: number;
  /** Anteil der Zahlung, der an Steuern und Sozialabgaben geht. */
  abzugsQuotePct: number;
  naeherung: boolean;
}

/** Sonderausgaben-Pauschbetrag § 10c EStG — wie in `calculateNetto`. */
const SONDERAUSGABEN_PAUSCHBETRAG = 36;

/** Kinderfreibeträge je Zähler 1,0 für Soli/KiSt (§ 51a Abs. 2a EStG), 2026. */
function kinderfreibetragFuerSoliKist(zaehler: number, sk: Steuerklasse): number {
  if (zaehler <= 0 || sk >= 5) return 0;
  const voll = 2 * KINDERFREIBETRAG.amtlich2026 + 2 * BETREUUNGSFREIBETRAG; // 9.756 €
  return zaehler * (sk === 4 ? voll / 2 : voll);
}

export function nettoEinmalzahlung(input: EinmalzahlungInput): EinmalzahlungResult {
  const monat = Math.min(12, Math.max(1, Math.round(input.auszahlungsMonat ?? 11)));
  const abMonat = Math.min(monat, Math.max(1, Math.round(input.beschaeftigtAbMonat ?? 1)));
  const beschaeftigungsMonate = 12 - abMonat + 1;
  const einmal = Math.max(0, input.einmal);
  const vorher = Math.max(0, input.bisherigeEinmalzahlungen ?? 0);
  const sk = input.steuerklasse;
  const ksSatz = input.kirchensteuerSatz ?? 0.09;
  const basis = {
    bruttoMonat: Math.max(0, input.bruttoMonat),
    jahr: 2026 as const,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: input.kinderlosUeber23,
    kirche: input.kirche,
    kirchensteuerSatz: ksSatz,
    kvZusatzbeitrag: input.kvZusatzbeitrag,
    sachsen: input.sachsen,
  };
  const laufend = calculateNetto(basis);
  const kvSatz = laufend.sv.krankenSatzAnPct / 100;
  const pvSatz = laufend.sv.pflegeSatzAnPct / 100;

  // Beitragspflichtiger Teil nach der anteiligen Jahres-BBG (§ 23a Abs. 3 SGB IV):
  // BBG × (Beschäftigungsmonate bis zur Auszahlung) ÷ 12 minus das bisher im
  // Jahr beitragspflichtige Entgelt (laufendes Gehalt + frühere Einmalzahlungen).
  const monateBisAuszahlung = monat - abMonat + 1;
  const bbgKvPv = (BBG_2026.kvPvJahr * monateBisAuszahlung) / 12;
  const bbgRvAlv = (BBG_2026.rvAlvJahr * monateBisAuszahlung) / 12;
  const laufendBisher = basis.bruttoMonat * monateBisAuszahlung;
  const svFuer = (betrag: number, bisher: number) => {
    const kvPv = Math.min(betrag, Math.max(0, bbgKvPv - bisher));
    const rvAlv = Math.min(betrag, Math.max(0, bbgRvAlv - bisher));
    return {
      kvPv,
      rvAlv,
      kranken: kvPv * kvSatz,
      pflege: kvPv * pvSatz,
      rente: rvAlv * BBG_2026.anSatzRv,
      arbeitslosen: rvAlv * BBG_2026.anSatzAlv,
    };
  };
  const svVorher = svFuer(vorher, laufendBisher);
  const svVorherSumme = svVorher.kranken + svVorher.pflege + svVorher.rente + svVorher.arbeitslosen;
  const sv = svFuer(einmal, laufendBisher + vorher);
  const svKranken = sv.kranken;
  const svPflege = sv.pflege;
  const svRente = sv.rente;
  const svArbeitslosen = sv.arbeitslosen;
  const svSumme = svKranken + svPflege + svRente + svArbeitslosen;

  // Voraussichtlicher Jahresarbeitslohn (§ 39b Abs. 3 EStG) — anteilig, wenn erst
  // im Lauf des Jahres eingetreten. Die Pauschbeträge gibt es auch dann voll.
  const anteil = beschaeftigungsMonate / 12;
  const bruttoJahrOhne = laufend.bruttoJahr * anteil + vorher;
  const svJahrOhne = laufend.sv.summeJahr * anteil + svVorherSumme;
  const pauschbetraege = ARBEITNEHMER_PAUSCHBETRAG.amtlich2026 + SONDERAUSGABEN_PAUSCHBETRAG;
  const zvEOhne = Math.max(0, bruttoJahrOhne - svJahrOhne - pauschbetraege);
  const zvEMit = Math.max(0, bruttoJahrOhne + einmal - svJahrOhne - svSumme - pauschbetraege);

  const gemeinsam = { steuerklasse: sk, jahr: 2026 as const, kirche: input.kirche, kirchensteuerSatz: ksSatz };
  const ohne = steuerNachKlasse({ ...gemeinsam, zvE: zvEOhne, bruttoJahr: bruttoJahrOhne, svSummeJahr: svJahrOhne });
  const mit = steuerNachKlasse({
    ...gemeinsam,
    zvE: zvEMit,
    bruttoJahr: bruttoJahrOhne + einmal,
    svSummeJahr: svJahrOhne + svSumme,
  });

  // Soli und Kirchensteuer: mit Kinderfreibeträgen auf gemindertem zvE (§ 51a EStG).
  const kfb = kinderfreibetragFuerSoliKist(input.kinderfreibetraege ?? 0, sk);
  const soliKist = (zvE: number, bruttoJahr: number, svSummeJahr: number, fallback: typeof ohne) =>
    kfb > 0
      ? steuerNachKlasse({ ...gemeinsam, zvE: Math.max(0, zvE - kfb), bruttoJahr, svSummeJahr })
      : fallback;
  const ohneSk = soliKist(zvEOhne, bruttoJahrOhne, svJahrOhne, ohne);
  const mitSk = soliKist(zvEMit, bruttoJahrOhne + einmal, svJahrOhne + svSumme, mit);

  const lohnsteuer = mit.estJahr - ohne.estJahr;
  const soli = mitSk.soliJahr - ohneSk.soliJahr;
  const kirchensteuer = mitSk.kirchensteuerJahr - ohneSk.kirchensteuerJahr;
  const steuerSumme = lohnsteuer + soli + kirchensteuer;
  const netto = einmal - svSumme - steuerSumme;

  return {
    einmal,
    svKranken,
    svPflege,
    svRente,
    svArbeitslosen,
    svSumme,
    lohnsteuer,
    soli,
    kirchensteuer,
    steuerSumme,
    netto,
    nettoQuotePct: einmal > 0 ? (netto / einmal) * 100 : 0,
    svBasisKvPv: sv.kvPv,
    svBasisRvAlv: sv.rvAlv,
    beschaeftigungsMonate,
    abzugsQuotePct: einmal > 0 ? ((svSumme + steuerSumme) / einmal) * 100 : 0,
    naeherung: isMidijob(basis.bruttoMonat, 2026),
  };
}
