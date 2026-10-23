/**
 * Sozialabgaben 2026 vs. 2027 — Arbeitnehmer- und Arbeitgeberbeiträge im
 * direkten Vergleich.
 *
 * Bewusst getrennt von `calculateNetto`: Die Engine rechnet 2027 standardmäßig
 * mit den amtlichen SV-Werten 2026 und optional (`sv2027: "entwurf"`) nur mit
 * den Entwurfs-BBG bei unveränderten Sätzen. Diese Seite geht weiter und
 * lässt auch RV-Satz und Zusatzbeitrag 2027 variieren. Jede 2027-Annahme ist deshalb ein
 * Parameter, den die Oberfläche offenlegt und der Nutzer verstellen kann.
 *
 * Stand der 2027-Werte:
 *  - Beitragsbemessungsgrenzen: Rechengrößen-Verordnung 2027, vom Kabinett am
 *    07.10.2026 beschlossen, Bundesrat steht aus
 *    (`SV_RECHENGROESSEN_2027_ENTWURF`, Status in `BBG_2027_STATUS`).
 *  - Rentenbeitragssatz: bleibt laut Rentenversicherungsbericht 2025 der
 *    Bundesregierung (19.11.2025) bis einschließlich 2027 bei 18,6 %; erst 2028
 *    steigt er. 18,8 % ist nur das Risikoszenario, falls der Bundeszuschuss
 *    gekürzt wird (DRV: +0,2 Punkte) — im Rechner zuschaltbar.
 *  - Durchschnittlicher KV-Zusatzbeitrag: GKV-Schätzerkreis vom 14.10.2026
 *    rechnerisch unverändert 2,9 %; amtlich setzt ihn das BMG bis 1.11.2026 fest
 *    (`ZUSATZBEITRAG_2027_SCHAETZERKREIS` in data/krankenkassen.ts).
 *  - Pflegeversicherung: Grundbeitrag 3,6 % bleibt; der Kinderlosenzuschlag
 *    soll nach dem Regierungsentwurf des Pflegeneuordnungsgesetzes (Kabinett
 *    30.09.2026) von 0,6 auf 0,9 Punkte steigen — im Rechner zuschaltbar.
 *  - Arbeitslosenversicherung: 2,6 % (§ 341 SGB III), keine Änderung.
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
  /** Kinderlosenzuschlag PV (allein Arbeitnehmer), 2026: 0,6 Punkte. */
  pvKinderlosenzuschlag: number;
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
  pvKinderlosenzuschlag: 0.006,
  rvSatz: BBG_2026.anSatzRv * 2,
  alvSatz: BBG_2026.anSatzAlv * 2,
};

/**
 * Erwarteter RV-Beitragssatz 2027: unverändert 18,6 % (Rentenversicherungsbericht
 * 2025: „bleibt er bis zum Jahr 2027 stabil“, danach 19,8 % in 2028).
 * https://www.bundesregierung.de/breg-de/aktuelles/rentenbericht-2025-2394260
 */
export const RV_SATZ_2027_ERWARTET = 0.186;

/**
 * Risikoszenario: Kürzt der Bund den Zuschuss an die Rentenversicherung um
 * 4 Mrd. €, steigt der Satz laut DRV schon 2027 um rund 0,2 Punkte.
 */
export const RV_SATZ_2027_RISIKO = 0.188;

/** Kinderlosenzuschlag PV 2027 laut Regierungsentwurf Pflegeneuordnungsgesetz (Kabinett 30.09.2026). */
export const PV_KINDERLOSENZUSCHLAG_2027_ENTWURF = 0.009;

/** 2027 mit den Grenzen der Rechengrößen-Verordnung 2027; Sätze als Parameter. */
export function sv2027(opts: { rvSatz: number; kvZusatzbeitrag: number; pvKinderlosenzuschlag?: number }): SvJahresWerte {
  return {
    kvPvBbgJahr: SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgJahr,
    rvAlvBbgJahr: SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgJahr,
    kvSatz: SV_2026.kvSatz,
    kvZusatzbeitrag: opts.kvZusatzbeitrag,
    pvSatz: SV_2026.pvSatz,
    pvKinderlosenzuschlag: opts.pvKinderlosenzuschlag ?? SV_2026.pvKinderlosenzuschlag,
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
 *  - Kinderlosenzuschlag (2026: 0,6 Prozentpunkte) allein für den AN (ab 23),
 *  - Abschlag 0,25 Prozentpunkte je Kind ab dem 2. bis zum 5. Kind unter 25,
 *    ebenfalls nur auf den AN-Anteil.
 */
export function pvSaetze(werte: SvJahresWerte, p: PersonInput) {
  const agGrund = werte.pvSatz / 2 - (p.sachsen ? 0.005 : 0);
  let an = werte.pvSatz - agGrund;
  if (p.kinder === 0 && p.ueber23) an += werte.pvKinderlosenzuschlag;
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
