/**
 * Sozialabgaben 2026 vs. 2027 — Arbeitnehmer- und Arbeitgeberbeiträge im
 * direkten Vergleich.
 *
 * Bewusst getrennt von `calculateNetto`: Die Engine rechnet 2027 weiterhin mit
 * den amtlichen SV-Werten 2026, solange die Rechengrößen-Verordnung 2027 nicht
 * beschlossen ist. Diese Seite soll genau das Gegenteil zeigen — was sich
 * ändert, wenn die Entwurfswerte kommen. Jede 2027-Annahme ist deshalb ein
 * Parameter, den die Oberfläche offenlegt und der Nutzer verstellen kann.
 *
 * Stand der 2027-Werte:
 *  - Beitragsbemessungsgrenzen: Referentenentwurf BMAS vom 21.09.2026
 *    (`SV_RECHENGROESSEN_2027_ENTWURF`).
 *  - Rentenbeitragssatz: 18,8 % laut Rentenversicherungsbericht / Rentenpaket
 *    erwartet; verbindlich erst mit der Beitragssatzverordnung (Herbst 2026).
 *  - Durchschnittlicher KV-Zusatzbeitrag: setzt das BMG nach dem Schätzerkreis
 *    (Mitte Oktober 2026) fest; Prognosen liegen bei 3,1–3,7 %.
 *  - Pflege- und Arbeitslosenversicherung: keine beschlossene Änderung — die
 *    Sätze 2026 werden fortgeschrieben.
 *
 * Nicht abgebildet: Übergangsbereich (Midijob, bis 2.000 €), Minijobs,
 * Privatversicherte, knappschaftliche Rentenversicherung.
 */
import { BBG_2026, KV_2026, SV_RECHENGROESSEN_2027_ENTWURF } from "@/lib/taxCalculator";

export interface SvJahresWerte {
  kvPvBbgJahr: number;
  rvAlvBbgJahr: number;
  /** Allgemeiner KV-Beitragssatz (gesamt), 14,6 %. */
  kvSatz: number;
  /** Durchschnittlicher bzw. kassenindividueller Zusatzbeitrag (gesamt). */
  kvZusatzbeitrag: number;
  /** PV-Grundbeitrag (gesamt), 3,6 %. */
  pvSatz: number;
  /** RV-Beitragssatz (gesamt). */
  rvSatz: number;
  /** ALV-Beitragssatz (gesamt). */
  alvSatz: number;
}

export const SV_2026: SvJahresWerte = {
  kvPvBbgJahr: BBG_2026.kvPvJahr,
  rvAlvBbgJahr: BBG_2026.rvAlvJahr,
  kvSatz: KV_2026.allgemeinerBeitragssatz,
  kvZusatzbeitrag: KV_2026.durchschnittlicherZusatzbeitrag,
  pvSatz: 0.036,
  rvSatz: BBG_2026.anSatzRv * 2,
  alvSatz: BBG_2026.anSatzAlv * 2,
};

/** Erwarteter RV-Beitragssatz 2027 (Rentenversicherungsbericht / Rentenpaket). */
export const RV_SATZ_2027_ERWARTET = 0.188;

/** Prognosekorridor für den durchschnittlichen Zusatzbeitrag 2027. */
export const ZUSATZBEITRAG_2027_PROGNOSE = { von: 0.031, bis: 0.037 } as const;

/** 2027 mit den Entwurfsgrenzen; Sätze als Parameter. */
export function sv2027(opts: { rvSatz: number; kvZusatzbeitrag: number }): SvJahresWerte {
  return {
    kvPvBbgJahr: SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgJahr,
    rvAlvBbgJahr: SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgJahr,
    kvSatz: SV_2026.kvSatz,
    kvZusatzbeitrag: opts.kvZusatzbeitrag,
    pvSatz: SV_2026.pvSatz,
    rvSatz: opts.rvSatz,
    alvSatz: SV_2026.alvSatz,
  };
}

export interface PersonInput {
  bruttoJahr: number;
  /** Anzahl Kinder unter 25 (für PV-Abschläge); 0 = kinderlos. */
  kinder: number;
  /** Mindestens 23 Jahre alt — nur dann gilt der Kinderlosenzuschlag. */
  ueber23: boolean;
  /** Beschäftigungsort Sachsen: AN trägt 1 Prozentpunkt PV-Grundbeitrag mehr. */
  sachsen: boolean;
}

export interface Beitraege {
  kv: number;
  pv: number;
  rv: number;
  alv: number;
  summe: number;
}

export interface SvErgebnis {
  an: Beitraege;
  ag: Beitraege;
  pvSatzAn: number;
  pvSatzAg: number;
  kvPvBemessung: number;
  rvAlvBemessung: number;
}

/**
 * PV-Satz des Arbeitnehmers nach § 55 Abs. 3 SGB XI und § 58 Abs. 3 SGB XI:
 *  - Grundbeitrag hälftig (Sachsen: AG 1 Prozentpunkt weniger),
 *  - Kinderlosenzuschlag 0,6 Prozentpunkte allein für den AN (ab 23),
 *  - Abschlag 0,25 Prozentpunkte je Kind ab dem 2. bis zum 5. Kind unter 25,
 *    ebenfalls nur auf den AN-Anteil.
 */
export function pvSaetze(werte: SvJahresWerte, p: PersonInput) {
  const agGrund = werte.pvSatz / 2 - (p.sachsen ? 0.005 : 0);
  let an = werte.pvSatz - agGrund;
  if (p.kinder === 0 && p.ueber23) an += 0.006;
  if (p.kinder >= 2) an -= 0.0025 * (Math.min(p.kinder, 5) - 1);
  return { an, ag: agGrund };
}

export function berechneSv(werte: SvJahresWerte, p: PersonInput): SvErgebnis {
  const brutto = Math.max(0, p.bruttoJahr);
  const kvPv = Math.min(brutto, werte.kvPvBbgJahr);
  const rvAlv = Math.min(brutto, werte.rvAlvBbgJahr);
  const kvHalb = (werte.kvSatz + werte.kvZusatzbeitrag) / 2;
  const pv = pvSaetze(werte, p);

  const an: Beitraege = {
    kv: kvPv * kvHalb,
    pv: kvPv * pv.an,
    rv: rvAlv * (werte.rvSatz / 2),
    alv: rvAlv * (werte.alvSatz / 2),
    summe: 0,
  };
  an.summe = an.kv + an.pv + an.rv + an.alv;

  const ag: Beitraege = {
    kv: kvPv * kvHalb,
    pv: kvPv * pv.ag,
    rv: rvAlv * (werte.rvSatz / 2),
    alv: rvAlv * (werte.alvSatz / 2),
    summe: 0,
  };
  ag.summe = ag.kv + ag.pv + ag.rv + ag.alv;

  return { an, ag, pvSatzAn: pv.an, pvSatzAg: pv.ag, kvPvBemessung: kvPv, rvAlvBemessung: rvAlv };
}

/** Untergrenze, ab der diese Vollberechnung gilt (Ende Übergangsbereich 2026). */
export const MIDIJOB_OBERGRENZE_MONAT = 2000;
