/**
 * Krankengeld (§ 47 SGB V) — gemeinsame Rechenlogik für den Krankengeld-Rechner
 * und den Abschnitt "Krankengeld 2027".
 *
 * Regel: 70 % des Regelentgelts, höchstens 90 % des Nettoarbeitsentgelts. Das
 * Regelentgelt zählt nur bis zur Beitragsbemessungsgrenze der KV (§ 47 Abs. 6)
 * — 2026: 69.750 € / 360 = 193,75 € am Tag, also höchstens 135,63 € Krankengeld
 * am Tag. (Bis 10/2026 fehlte diese Kappung im Rechner; bei hohen Gehältern
 * wurde zu viel Krankengeld ausgewiesen.)
 *
 * Vom Brutto-Krankengeld trägt der Versicherte die Hälfte der Beiträge zur
 * Renten- (18,6 %) und Arbeitslosenversicherung (2,6 %) sowie die Hälfte der
 * Pflegeversicherung (3,6 %) plus den Kinderlosenzuschlag (0,6 %) allein.
 * Vereinfachung: die Sätze werden auf das Krankengeld angewandt.
 *
 * 2027 — GKV-Beitragssatzstabilisierungsgesetz (BGBl. 2026 I Nr. 228, Art. 1
 * Nr. 18 b, Inkrafttreten 1.1.2027 nach Art. 8 Abs. 2): Endet das
 * Beschäftigungsverhältnis während der Arbeitsunfähigkeit, beträgt das
 * Krankengeld ab dem Folgetag 60 % des Nettoarbeitsentgelts (67 % mit Kind,
 * § 47 Abs. 2a SGB V n. F.).
 */
import { BBG_2026 } from "@/lib/taxCalculator";

export const KG_SATZ_BRUTTO = 0.7;
export const KG_DECKEL_NETTO = 0.9;
/** Ab 1.1.2027 bei Ende der Beschäftigung während der AU (§ 47 Abs. 2a SGB V n. F.). */
export const KG_NACH_JOBENDE_2027 = { ohneKind: 0.6, mitKind: 0.67 } as const;

/** Höchstes Regelentgelt am Tag: KV-BBG / 360. */
export const REGELENTGELT_MAX_TAG = BBG_2026.kvPvJahr / 360;

/** Arbeitnehmeranteil der Sozialabgaben auf das Krankengeld (RV + ALV + PV). */
export function kgSvSatz(kinderlos: boolean): number {
  return 0.186 / 2 + 0.026 / 2 + 0.036 / 2 + (kinderlos ? 0.006 : 0);
}

/** Brutto- und Netto-Krankengeld pro Kalendertag (30-Tage-Monat). */
export function krankengeldTag(bruttoMonat: number, nettoMonat: number, kinderlos: boolean) {
  const regelentgeltTag = Math.min(bruttoMonat / 30, REGELENTGELT_MAX_TAG);
  const nettoTag = nettoMonat / 30;
  const bruttoKg = Math.min(regelentgeltTag * KG_SATZ_BRUTTO, nettoTag * KG_DECKEL_NETTO);
  return { bruttoKg, nettoKg: bruttoKg * (1 - kgSvSatz(kinderlos)) };
}

/** Ab 2027: Krankengeld pro Tag, wenn die Beschäftigung während der AU endet. */
export function krankengeldNachJobende2027Tag(nettoMonat: number, mitKind: boolean, kinderlos: boolean) {
  const bruttoKg = (nettoMonat / 30) * (mitKind ? KG_NACH_JOBENDE_2027.mitKind : KG_NACH_JOBENDE_2027.ohneKind);
  return { bruttoKg, nettoKg: bruttoKg * (1 - kgSvSatz(kinderlos)) };
}
