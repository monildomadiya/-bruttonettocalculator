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
 * Bewusst NICHT abgebildet: Midijob-Sonderregeln für Einmalzahlungen
 * (Übergangsbereich bis 2.000 €) — `naeherung` ist dann true und die Seite
 * sagt das.
 */
import {
  BBG_2026,
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
  naeherung: boolean;
}

export function nettoEinmalzahlung(input: EinmalzahlungInput): EinmalzahlungResult {
  const monat = Math.min(12, Math.max(1, Math.round(input.auszahlungsMonat ?? 11)));
  const einmal = Math.max(0, input.einmal);
  const sk = input.steuerklasse;
  const basis = {
    bruttoMonat: Math.max(0, input.bruttoMonat),
    jahr: 2026 as const,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: input.kinderlosUeber23,
    kirche: input.kirche,
    kvZusatzbeitrag: input.kvZusatzbeitrag,
  };
  const laufend = calculateNetto(basis);

  // Beitragspflichtiger Teil nach der anteiligen Jahres-BBG (§ 23a Abs. 3 SGB IV).
  const bisher = basis.bruttoMonat * monat;
  const svBasisKvPv = Math.min(einmal, Math.max(0, (BBG_2026.kvPvJahr * monat) / 12 - bisher));
  const svBasisRvAlv = Math.min(einmal, Math.max(0, (BBG_2026.rvAlvJahr * monat) / 12 - bisher));

  const kvSatz = laufend.sv.krankenSatzAnPct / 100;
  const pvSatz = laufend.sv.pflegeSatzAnPct / 100;
  const svKranken = svBasisKvPv * kvSatz;
  const svPflege = svBasisKvPv * pvSatz;
  const svRente = svBasisRvAlv * BBG_2026.anSatzRv;
  const svArbeitslosen = svBasisRvAlv * BBG_2026.anSatzAlv;
  const svSumme = svKranken + svPflege + svRente + svArbeitslosen;

  const gemeinsam = { steuerklasse: sk, jahr: 2026 as const, kirche: input.kirche };
  const ohne = steuerNachKlasse({
    ...gemeinsam,
    zvE: laufend.steuer.zvE,
    bruttoJahr: laufend.bruttoJahr,
    svSummeJahr: laufend.sv.summeJahr,
  });
  const mit = steuerNachKlasse({
    ...gemeinsam,
    zvE: laufend.steuer.zvE + Math.max(0, einmal - svSumme),
    bruttoJahr: laufend.bruttoJahr + einmal,
    svSummeJahr: laufend.sv.summeJahr + svSumme,
  });

  const lohnsteuer = mit.estJahr - ohne.estJahr;
  const soli = mit.soliJahr - ohne.soliJahr;
  const kirchensteuer = mit.kirchensteuerJahr - ohne.kirchensteuerJahr;
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
    svBasisKvPv,
    svBasisRvAlv,
    naeherung: isMidijob(basis.bruttoMonat, 2026),
  };
}
