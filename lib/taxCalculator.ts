/**
 * Brutto-Netto-Rechner — Berechnungslogik
 *
 * Grundlage 2026: § 32a EStG i.d.F. ab Veranlagungszeitraum 2026
 * (BMF, Amtliches Lohnsteuer-Handbuch LStH 2026, § 32a).
 * Sozialversicherungs-Rechengrößen 2026: Sozialversicherungsrechengrößen-Verordnung 2026.
 *
 * WICHTIG: Dies ist eine vereinfachte Berechnung für einen ersten Überblick
 * (Steuerklasse I/IV, keine Kinderfreibeträge, keine individuellen
 * Freibeträge). Sie ersetzt keine Steuerberatung und keine verbindliche
 * Lohnabrechnung.
 *
 * ── Steuerjahr 2027: Szenario-Modell ──────────────────────────────────────
 * Für 2027 gibt es noch kein Gesetz. Der Koalitionsausschuss hat sich am
 * 1. Juli 2026 politisch auf eine Einkommensteuerreform zum 1.1.2027
 * verständigt (Grundfreibetrag schrittweise auf 12.900 €, Arbeitnehmer-
 * Pauschbetrag auf 1.430 €, Kindergeld auf 272 €); das BMF beziffert den
 * Grundfreibetrag ausdrücklich nur als "voraussichtlich". Ein Referenten-
 * entwurf liegt (Stand: August 2026) noch nicht vor.
 *
 * Statt diese Unsicherheit zu verstecken, rechnet dieses Modul 2027 in drei
 * ausgewiesenen Szenarien (siehe `Szenario`):
 *   - "ohneReform"  → geltender Tarif 2026 fortgeschrieben (Status quo)
 *   - "stufe1"      → modellierte erste Reformstufe zum 1.1.2027
 *   - "vollausbau"  → Endstufe der Reform (Grundfreibetrag 12.900 €)
 *
 * Die Tarifeckwerte der Szenarien werden über `makeTarif()` aus dem
 * Grundfreibetrag abgeleitet — nach der üblichen "Rechtsverschiebung" der
 * Eckwerte, bei der die Grenzsteuersätze an den Tarifecken (14 %, 23,97 %,
 * 42 %, 45 %) unverändert bleiben. Die Faktorisierung ist gegen den
 * amtlichen Tarif 2026 verifiziert (siehe `makeTarif`-Doc).
 *
 * WICHTIG: Die Sozialversicherungs-Rechengrößen 2027 (Beitragsbemessungs-
 * grenzen, durchschnittlicher Zusatzbeitrag) werden erst im Herbst 2026 per
 * Verordnung festgelegt. Alle 2027-Szenarien verwenden daher weiterhin die
 * amtlichen SV-Werte 2026; nur der Steuerteil variiert.
 */

export type Steuerjahr = 2026 | 2027;

/**
 * Reformszenario für das Steuerjahr 2027. Für `jahr: 2026` ohne Wirkung —
 * dort gilt immer der amtliche Tarif 2026.
 */
export type Szenario = "ohneReform" | "stufe1" | "vollausbau";

export type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

export interface CalculatorInput {
  bruttoMonat: number;    // Monatliches Bruttogehalt in EUR
  jahr: Steuerjahr;
  verheiratet: boolean;   // Splittingverfahren (abgeleitet aus SK)
  kinderlosUeber23: boolean; // Pflegeversicherungszuschlag
  kirche: boolean;
  kirchensteuerSatz?: number; // 0.08 oder 0.09, default 0.09
  steuerklasse?: Steuerklasse; // 1–6, default 1
  sachsen?: boolean; // Sachsen: AN trägt 0,5 % höheren Pflegeversicherungs-Eigenanteil
  /**
   * Kassenindividueller KV-Zusatzbeitrag als Dezimalwert (z. B. 0.0269 für die
   * TK). Ohne Angabe wird der amtliche Durchschnittswert 2026 von 2,9 %
   * (§ 242a SGB V, Bekanntmachung des BMG) verwendet — so rechnen alle
   * bestehenden Aufrufer unverändert weiter. Der Zusatzbeitrag wird seit 2019
   * paritätisch getragen, in die AN-Belastung fließt also die Hälfte ein.
   */
  kvZusatzbeitrag?: number;
  /**
   * Reformszenario für `jahr: 2027`. Ohne Angabe wird "stufe1" verwendet —
   * die modellierte erste Reformstufe zum 1.1.2027. Für `jahr: 2026`
   * wirkungslos.
   */
  szenario?: Szenario;
}

export interface CalculatorResult {
  bruttoJahr: number;
  bruttoMonat: number;
  sv: {
    rente: number;
    arbeitslosen: number;
    kranken: number;
    pflege: number;
    summeMonat: number;
    summeJahr: number;
    /**
     * Die tatsächlich angewandten Arbeitnehmer-Beitragssätze in Prozent.
     * KV und PV sind nicht konstant — die KV hängt am gewählten kassen-
     * individuellen Zusatzbeitrag, die PV an Kinderlosigkeit und Sachsen.
     * Ohne diese Werte müsste die Oberfläche pauschale Sätze anzeigen, die
     * dann nicht zur ausgewiesenen Summe passen.
     */
    krankenSatzAnPct: number;
    pflegeSatzAnPct: number;
  };
  steuer: {
    zvE: number;
    einkommensteuerJahr: number;
    soliJahr: number;
    kirchensteuerJahr: number;
    summeJahr: number;
    summeMonat: number;
  };
  nettoJahr: number;
  nettoMonat: number;
  grenzsteuersatzPct: number;
  durchschnittssteuersatzPct: number;
}

// --- 2026 Rechengrößen (amtlich) ---
const RECHENGROESSEN_2026 = {
  kvPvBbgJahr: 69750, // Beitragsbemessungsgrenze KV/PV
  rvAlvBbgJahr: 101400, // Beitragsbemessungsgrenze RV/ALV
  kvSatz: 0.146,
  kvZusatzbeitragDurchschnitt: 0.029,
  pvSatzBasis: 0.036,
  pvZuschlagKinderlos: 0.006, // ab 23 Jahre ohne Kinder: 3.6% -> 4.2%
  // § 58 SGB XI: Grundbeitrag paritätisch, also je 1,8 % bei 3,6 %. In Sachsen
  // trägt der AN einen Prozentpunkt allein → AG 1,3 % / AN 2,3 %. Der
  // Kinderlosenzuschlag geht immer allein zulasten des Arbeitnehmers.
  pvAgAnteil: 0.018,
  pvAgAnteilSachsen: 0.013,
  rvSatz: 0.186,
  alvSatz: 0.026,
  werbungskostenPauschale: 1230,
  sonderausgabenPauschale: 36,
};

/**
 * Gesetzliche Krankenversicherung 2026 — allgemeiner Beitragssatz und der
 * amtliche durchschnittliche Zusatzbeitrag (§ 241, § 242a SGB V). Beide Sätze
 * werden paritätisch von Arbeitnehmer und Arbeitgeber getragen; der
 * kassenindividuelle Zusatzbeitrag ersetzt dabei den Durchschnittswert.
 */
export const KV_2026 = {
  allgemeinerBeitragssatz: RECHENGROESSEN_2026.kvSatz, // 14,6 %
  durchschnittlicherZusatzbeitrag: RECHENGROESSEN_2026.kvZusatzbeitragDurchschnitt, // 2,9 %
} as const;

/**
 * Betriebliche Altersvorsorge (bAV) / Entgeltumwandlung 2026
 * (§ 3 Nr. 63 EStG, § 1 Abs. 1 Nr. 9 SvEV). Beiträge sind bis 8 % der
 * Beitragsbemessungsgrenze RV (West) steuerfrei und bis 4 % sozialabgabenfrei.
 * BBG-RV 2026: 101.400 €/Jahr → 4 % = 338 €/Monat, 8 % = 676 €/Monat.
 */
export const BAV_2026 = {
  bbgRvJahr: 101400,
  svFreiProzent: 0.04,     // sozialabgabenfrei bis 4 % BBG-RV
  steuerFreiProzent: 0.08, // steuerfrei bis 8 % BBG-RV
} as const;

/**
 * Midijob / Übergangsbereich 2026 (§ 20 Abs. 2a SGB IV).
 *
 * Für Monatsentgelte von 603,01 € bis 2.000 € werden die
 * Arbeitnehmer-Sozialversicherungsbeiträge nicht vom vollen Bruttoentgelt,
 * sondern von einer reduzierten "beitragspflichtigen Einnahme" berechnet. Das
 * entlastet Geringverdiener; der Arbeitgeber trägt den Differenzbetrag.
 *
 * Faktor F 2026: 0,6619. Die beiden linearen Formeln unten sind die amtliche
 * geschlossene Form für die 2026-Grenzen (603,01 € / 2.000 €). Amtlicher
 * Prüfpunkt bei 1.200 €: Gesamt-BE 1.083,25 €, AN-BE 854,69 €.
 * Quelle: Deutsche Rentenversicherung, Übergangsbereich/Gleitzone 2026.
 */
export const UEBERGANGSBEREICH_2026 = {
  untergrenze: 603, // Minijob-Grenze; Midijob beginnt bei 603,01 €
  obergrenze: 2000,
  faktorF: 0.6619,
} as const;

/** Ist das Monatsbrutto im Übergangsbereich (Midijob) 2026? */
export function isMidijob2026(bruttoMonat: number): boolean {
  return (
    bruttoMonat > UEBERGANGSBEREICH_2026.untergrenze &&
    bruttoMonat <= UEBERGANGSBEREICH_2026.obergrenze
  );
}

/**
 * Beitragspflichtige Einnahme des Arbeitnehmers (Bemessungsgrundlage für die
 * AN-Beiträge) im Übergangsbereich 2026.
 * Formel: 1,43163922691 × Entgelt − 863,2784538207. Bei 1.200 € = 854,69 €.
 */
export function midijobArbeitnehmerBemessungMonat(bruttoMonat: number): number {
  return 1.43163922691 * bruttoMonat - 863.2784538207;
}

/**
 * Gesamte beitragspflichtige Einnahme (AG + AN) im Übergangsbereich 2026.
 * Formel: 1,1459372226 × Entgelt − 291.8744452399. Bei 1.200 € = 1.083,25 €.
 */
export function midijobGesamtBemessungMonat(bruttoMonat: number): number {
  return 1.1459372226 * bruttoMonat - 291.8744452399;
}

export function estFormel2026(zvE: number): number {
  const x = Math.floor(zvE);
  if (x <= 12348) return 0;
  if (x <= 17799) {
    const y = (x - 12348) / 10000;
    return (914.51 * y + 1400) * y;
  }
  if (x <= 69878) {
    const z = (x - 17799) / 10000;
    return (173.1 * z + 2397) * z + 1034.87;
  }
  if (x <= 277825) {
    return 0.42 * x - 11135.63;
  }
  return 0.45 * x - 19470.38;
}

function grenzsteuersatz2026(zvE: number): number {
  const x = Math.floor(zvE);
  if (x <= 12348) return 0;
  if (x <= 17799) {
    const y = (x - 12348) / 10000;
    // Ableitung von (914.51*y + 1400)*y nach x (dy/dx = 1/10000)
    return (2 * 914.51 * y + 1400) / 10000;
  }
  if (x <= 69878) {
    const z = (x - 17799) / 10000;
    return (2 * 173.1 * z + 2397) / 10000;
  }
  if (x <= 277825) return 0.42;
  return 0.45;
}

/**
 * Tarifeckwerte des Einkommensteuertarifs nach § 32a EStG.
 * `gfb` = Grundfreibetrag, `e1`/`e2` = Ende der ersten/zweiten Progressionszone,
 * `topStart` = Beginn der Reichensteuer (45 %).
 */
export interface Tarif {
  gfb: number;
  e1: number;
  e2: number;
  topStart: number;
  a1: number; // quadratischer Koeffizient Zone 1
  b2: number; // linearer Koeffizient Zone 2 (= 10.000 × Grenzsteuersatz bei e1)
  a2: number; // quadratischer Koeffizient Zone 2
  c: number;  // ESt bei e1 (Stetigkeit Zone 1 → 2)
  c3: number; // Abzugsbetrag 42 %-Zone
  c4: number; // Abzugsbetrag 45 %-Zone
}

/**
 * Leitet einen vollständigen § 32a-Tarif aus den drei Eckwerten ab.
 *
 * Konstruktionsprinzip (entspricht der gesetzlichen Systematik): Die
 * Grenzsteuersätze an den Tarifecken bleiben fest — 14 % am Grundfreibetrag,
 * 23,97 % am Ende der ersten Zone, 42 % am Ende der zweiten Zone, 45 % ab
 * `topStart`. Verschieben sich die Eckwerte, werden die Polynomkoeffizienten
 * so nachgeführt, dass Steuerbetrag und Grenzsteuersatz stetig bleiben.
 *
 * Verifikation gegen den amtlichen Tarif 2026 — `makeTarif(12348, 17799, 69878)`
 * liefert a1 = 914,51 / a2 = 173,11 / c = 1.034,87 / c3 = 11.135,7 / c4 = 19.470,4
 * gegenüber den Gesetzeswerten 914,51 / 173,1 / 1.034,87 / 11.135,63 / 19.470,38.
 */
export function makeTarif(gfb: number, e1: number, e2: number, topStart = 277825): Tarif {
  const y1 = (e1 - gfb) / 10000;
  const z2 = (e2 - e1) / 10000;
  const b2 = 2397; // Grenzsteuersatz 23,97 % am Ende der ersten Progressionszone
  const a1 = (b2 - 1400) / (2 * y1); // Eintrittssatz 14 % → linearer Term 1400
  const a2 = (4200 - b2) / (2 * z2); // Austrittssatz 42 % am Ende der zweiten Zone
  const c = (a1 * y1 + 1400) * y1;
  const estAtE2 = (a2 * z2 + b2) * z2 + c;
  const c3 = 0.42 * e2 - estAtE2;
  const c4 = c3 + 0.03 * topStart;
  return { gfb, e1, e2, topStart, a1, b2, a2, c, c3, c4 };
}

/** Jahres-ESt für einen beliebigen abgeleiteten Tarif. */
export function estFuerTarif(t: Tarif, zvE: number): number {
  const x = Math.floor(zvE);
  if (x <= t.gfb) return 0;
  if (x <= t.e1) {
    const y = (x - t.gfb) / 10000;
    return (t.a1 * y + 1400) * y;
  }
  if (x <= t.e2) {
    const z = (x - t.e1) / 10000;
    return (t.a2 * z + t.b2) * z + t.c;
  }
  if (x <= t.topStart) return 0.42 * x - t.c3;
  return 0.45 * x - t.c4;
}

/** Grenzsteuersatz (als Dezimalwert) für einen beliebigen abgeleiteten Tarif. */
export function grenzsteuersatzFuerTarif(t: Tarif, zvE: number): number {
  const x = Math.floor(zvE);
  if (x <= t.gfb) return 0;
  if (x <= t.e1) {
    const y = (x - t.gfb) / 10000;
    return (2 * t.a1 * y + 1400) / 10000;
  }
  if (x <= t.e2) {
    const z = (x - t.e1) / 10000;
    return (2 * t.a2 * z + t.b2) / 10000;
  }
  if (x <= t.topStart) return 0.42;
  return 0.45;
}

/**
 * Grundfreibeträge der 2027-Szenarien.
 *
 * Das BMF nennt 12.900 € als Endstufe einer zweistufigen Anhebung bis 2028
 * (von 12.348 € in 2026). Die Aufteilung auf die beiden Stufen ist noch nicht
 * beziffert; "stufe1" modelliert daher die hälftige Zwischenstufe. Sobald der
 * Referentenentwurf vorliegt, wird hier der amtliche Wert eingesetzt.
 */
export const GRUNDFREIBETRAG = {
  amtlich2026: 12348,
  stufe1_2027: 12624, // modelliert: Hälfte des Weges 12.348 € → 12.900 €
  vollausbau: 12900,  // BMF, Koalitionsbeschluss vom 1.7.2026 ("voraussichtlich")
} as const;

/** Arbeitnehmer-Pauschbetrag: 1.230 € (2026) → 1.430 € (Reform ab 2027). */
export const ARBEITNEHMER_PAUSCHBETRAG = { amtlich2026: 1230, reform: 1430 } as const;

/** Kindergeld je Kind und Monat: 259 € (2026) → 272 € (Reform ab 2027). */
export const KINDERGELD = { amtlich2026: 259, reform: 272 } as const;

// Eckwerte der Szenarien: Rechtsverschiebung proportional zum Grundfreibetrag.
const SHIFT_STUFE1 = GRUNDFREIBETRAG.stufe1_2027 / GRUNDFREIBETRAG.amtlich2026;
const SHIFT_VOLL = GRUNDFREIBETRAG.vollausbau / GRUNDFREIBETRAG.amtlich2026;

export const TARIF_2027_STUFE1 = makeTarif(
  GRUNDFREIBETRAG.stufe1_2027,
  Math.round(17799 * SHIFT_STUFE1), // 18.197 €
  Math.round(69878 * SHIFT_STUFE1)  // 71.440 €
);

export const TARIF_2027_VOLLAUSBAU = makeTarif(
  GRUNDFREIBETRAG.vollausbau,
  Math.round(17799 * SHIFT_VOLL), // 18.595 €
  Math.round(69878 * SHIFT_VOLL)  // 73.002 €
);

/**
 * Auflösung von Steuerjahr + Szenario zu den steuerlich wirksamen Parametern.
 * Für 2026 gilt immer der amtliche Tarif (unveränderte Gesetzesformel).
 */
export function resolveSteuerkontext(jahr: Steuerjahr, szenario: Szenario = "stufe1") {
  const amtlich = {
    est: estFormel2026,
    grenz: grenzsteuersatz2026,
    werbungskostenPauschale: ARBEITNEHMER_PAUSCHBETRAG.amtlich2026,
    soliFaktor: 1,
    grundfreibetrag: GRUNDFREIBETRAG.amtlich2026,
    kindergeld: KINDERGELD.amtlich2026,
    istModelliert: false,
  };

  if (jahr === 2026 || szenario === "ohneReform") return amtlich;

  const tarif = szenario === "vollausbau" ? TARIF_2027_VOLLAUSBAU : TARIF_2027_STUFE1;
  return {
    est: (zvE: number) => estFuerTarif(tarif, zvE),
    grenz: (zvE: number) => grenzsteuersatzFuerTarif(tarif, zvE),
    werbungskostenPauschale: ARBEITNEHMER_PAUSCHBETRAG.reform,
    // Die Soli-Freigrenze wird traditionell mit den Tarifeckwerten verschoben.
    soliFaktor: tarif.gfb / GRUNDFREIBETRAG.amtlich2026,
    grundfreibetrag: tarif.gfb,
    kindergeld: KINDERGELD.reform,
    istModelliert: true,
  };
}

// Solidaritätszuschlag mit Milderungszone (20%-Abschmelzung)
// Freigrenze 2026: 20.350 € ESt (Einzelveranlagung) / 40.700 € (Splitting)
// — § 3 Abs. 3 SolZG, angehoben von 19.950 €/39.900 € (2025).
// `faktor` verschiebt die Freigrenze in den 2027-Szenarien mit den Tarifeckwerten.
export function soliBerechnen(estJahr: number, verheiratet: boolean, faktor = 1): number {
  const freigrenze = (verheiratet ? 40700 : 20350) * faktor;
  if (estJahr <= freigrenze) return 0;
  const voll = estJahr * 0.055;
  const abschmelzung = (estJahr - freigrenze) * 0.2;
  return Math.min(voll, abschmelzung);
}

/**
 * Jahres-Einkommensteuer für ein gegebenes zu versteuerndes Einkommen (zvE)
 * nach Steuerklasse (2026, § 32a EStG). Additive Hilfsfunktion für Tools, die
 * eine Steuer-Differenz brauchen (z. B. der Steuerrückerstattungs-Rechner:
 * ESt(zvE) − ESt(zvE − zusätzliche Werbungskosten) = Erstattung). Spiegelt die
 * Steuerklassen-Behandlung von `calculateNetto` für die relevanten Klassen.
 */
export function einkommensteuerFuerZvE(zvE: number, steuerklasse: Steuerklasse = 1): number {
  const z = Math.max(0, zvE);
  switch (steuerklasse) {
    case 3:
      return 2 * estFormel2026(z / 2); // Splitting
    case 2:
      return estFormel2026(Math.max(0, z - 4260)); // Alleinerziehenden-Entlastungsbetrag
    default:
      return estFormel2026(z); // I, IV (und Näherung für V/VI bei der Erstattungs-Differenz)
  }
}

export function calculateNetto(input: CalculatorInput): CalculatorResult {
  const bruttoJahr = input.bruttoMonat * 12;
  const r = RECHENGROESSEN_2026; // 2026-Parameter (auch als 2027-Platzhalter verwendet)

  // Sozialversicherung (Arbeitnehmeranteil).
  // Im Midijob-Übergangsbereich (603,01–2.000 €/Monat) werden die AN-Beiträge
  // von der reduzierten beitragspflichtigen Einnahme berechnet, sonst vom Brutto.
  const svBemessungMonat = isMidijob2026(input.bruttoMonat)
    ? Math.max(0, midijobArbeitnehmerBemessungMonat(input.bruttoMonat))
    : input.bruttoMonat;
  const svBemessungJahr = svBemessungMonat * 12;

  const kvPvBemessung = Math.min(svBemessungJahr, r.kvPvBbgJahr);
  const rvAlvBemessung = Math.min(svBemessungJahr, r.rvAlvBbgJahr);

  const zusatzbeitrag = input.kvZusatzbeitrag ?? r.kvZusatzbeitragDurchschnitt;
  const kvSatzAn = (r.kvSatz + zusatzbeitrag) / 2;
  const pvSatzGesamt = r.pvSatzBasis + (input.kinderlosUeber23 ? r.pvZuschlagKinderlos : 0);
  // Arbeitgeberanteil PV: die Hälfte des Grundbeitrags (1,8 % bei 3,6 %); den
  // Kinderlosenzuschlag trägt der AN allein. Sachsen-Sonderfall: der AN trägt
  // einen Prozentpunkt allein, AG daher nur 1,3 %.
  const pvAgAnteil = input.sachsen ? r.pvAgAnteilSachsen : r.pvAgAnteil;
  const pvSatzAn = pvSatzGesamt - pvAgAnteil;

  const kranken = kvPvBemessung * kvSatzAn;
  const pflege = kvPvBemessung * pvSatzAn;
  const rente = rvAlvBemessung * (r.rvSatz / 2);
  const arbeitslosen = rvAlvBemessung * (r.alvSatz / 2);

  const svSummeJahr = kranken + pflege + rente + arbeitslosen;

  // Steuerlicher Kontext: amtlicher Tarif 2026 bzw. das gewählte 2027-Szenario.
  const ctx = resolveSteuerkontext(input.jahr, input.szenario);

  // Vereinfachtes zu versteuerndes Einkommen für den Lohnsteuerabzug
  const zvE = Math.max(
    0,
    bruttoJahr - svSummeJahr - ctx.werbungskostenPauschale - r.sonderausgabenPauschale
  );

  const sk = input.steuerklasse ?? 1;

  let estJahr: number;
  if (sk === 3) {
    // Steuerklasse III: Splittingverfahren
    estJahr = 2 * ctx.est(zvE / 2);
  } else if (sk === 5) {
    // Steuerklasse V: Erhöhter Tarif — Näherung: 35 % Grenzbelastung auf gesamtes zvE
    // (Vereinfachung für Überblick; korrekte Berechnung erfolgt im Lohnsteuerjahresausgleich)
    const baseEst = ctx.est(zvE);
    estJahr = Math.min(baseEst * 1.45, zvE * 0.40);
  } else if (sk === 6) {
    // Steuerklasse VI: Keine Freibeträge, ab erstem Euro Steuer
    // Näherung: Standardformel ohne Grundfreibetrag
    const zvE6 = Math.max(0, bruttoJahr - svSummeJahr); // keine Pauschalen
    estJahr = ctx.est(zvE6) * 1.1;
  } else if (sk === 2) {
    // Steuerklasse II: Alleinerziehendenentlastungsbetrag 4.260 € (2026)
    const zvE2 = Math.max(0, zvE - 4260);
    estJahr = ctx.est(zvE2);
  } else {
    // Steuerklasse I, IV: Grundtarif
    estJahr = ctx.est(zvE);
  }

  const soliJahr = soliBerechnen(estJahr, sk === 3, ctx.soliFaktor);
  const ksSatz = input.kirchensteuerSatz ?? 0.09;
  const kirchensteuerJahr = input.kirche ? estJahr * ksSatz : 0;

  const steuerSummeJahr = estJahr + soliJahr + kirchensteuerJahr;
  const nettoJahr = bruttoJahr - svSummeJahr - steuerSummeJahr;

  const grenzsteuersatzPct = ctx.grenz(sk === 3 ? zvE / 2 : zvE) * 100;
  const durchschnittssteuersatzPct = zvE > 0 ? (estJahr / zvE) * 100 : 0;

  return {
    bruttoJahr,
    bruttoMonat: input.bruttoMonat,
    sv: {
      rente,
      arbeitslosen,
      kranken,
      pflege,
      summeMonat: svSummeJahr / 12,
      summeJahr: svSummeJahr,
      krankenSatzAnPct: kvSatzAn * 100,
      pflegeSatzAnPct: pvSatzAn * 100,
    },
    steuer: {
      zvE,
      einkommensteuerJahr: estJahr,
      soliJahr,
      kirchensteuerJahr,
      summeJahr: steuerSummeJahr,
      summeMonat: steuerSummeJahr / 12,
    },
    nettoJahr,
    nettoMonat: nettoJahr / 12,
    grenzsteuersatzPct,
    durchschnittssteuersatzPct,
  };
}

/**
 * Reverse calculation (Netto → Brutto).
 *
 * There is no closed-form inverse of the payroll calculation: the wage-tax tariff
 * (§ 32a EStG) is progressive and several contributions cap out at the
 * Beitragsbemessungsgrenzen, so `nettoMonat` is a piecewise-nonlinear function of
 * `bruttoMonat`. It is, however, monotonically increasing, so we invert it with a
 * bounded bisection that reuses the exact same forward engine (`calculateNetto`).
 *
 * Returns the lowest gross monthly amount whose net result reaches (>=) the
 * requested net, matched to within `tolerance` euro where feasible. The `reachable`
 * flag is false when the requested net exceeds what the search ceiling can produce.
 */
export interface ReverseInput extends Omit<CalculatorInput, "bruttoMonat"> {
  nettoMonatZiel: number; // gewünschtes monatliches Nettogehalt in EUR
}

export interface ReverseResult {
  bruttoMonat: number;
  reachable: boolean;
  forward: CalculatorResult; // full forward breakdown for the solved gross
}

const REVERSE_MAX_BRUTTO_MONAT = 500000; // search ceiling (matches the calculator's realistic range)

export function solveBruttoForNetto(input: ReverseInput, tolerance = 0.01): ReverseResult {
  const { nettoMonatZiel, ...rest } = input;
  const netAt = (bruttoMonat: number) =>
    calculateNetto({ ...rest, bruttoMonat }).nettoMonat;

  if (nettoMonatZiel <= 0) {
    return { bruttoMonat: 0, reachable: true, forward: calculateNetto({ ...rest, bruttoMonat: 0 }) };
  }

  // Gross is always >= net, so start the lower bound at the target itself.
  let lo = nettoMonatZiel;
  let hi = Math.max(nettoMonatZiel * 2, 1000);
  while (netAt(hi) < nettoMonatZiel && hi < REVERSE_MAX_BRUTTO_MONAT) {
    hi = Math.min(hi * 2, REVERSE_MAX_BRUTTO_MONAT);
  }

  const reachable = netAt(hi) >= nettoMonatZiel - tolerance;

  // Bisection: converge hi onto the lowest gross that still reaches the target.
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (netAt(mid) < nettoMonatZiel) lo = mid;
    else hi = mid;
    if (hi - lo < tolerance / 10) break;
  }

  const bruttoMonat = Math.round(hi * 100) / 100;
  return { bruttoMonat, reachable, forward: calculateNetto({ ...rest, bruttoMonat }) };
}

// --- Beamte (civil servants) ---
// Beamte zahlen keine Sozialversicherungsbeiträge (keine RV/ALV/GKV/SPV auf
// Dienstbezüge); sie sichern sich privat (PKV) ab und erhalten Beihilfe.
// Für den Lohnsteuerabzug gilt statt der SV-Beiträge die
// Mindestvorsorgepauschale nach § 39b Abs. 2 Satz 5 Nr. 3 EStG:
// 12 % des Arbeitslohns, höchstens 1.900 € (Steuerklassen I, II, IV–VI)
// bzw. 3.000 € (Steuerklasse III).
export interface BeamtenInput {
  bruttoMonat: number;      // Dienstbezüge (Grundgehalt + Zulagen) pro Monat
  steuerklasse?: Steuerklasse;
  kirche: boolean;
  kirchensteuerSatz?: number; // 0.08 oder 0.09, default 0.09
  pkvMonat?: number;        // private Krankenversicherung (Eigenanteil) pro Monat
}

export interface BeamtenResult {
  bruttoMonat: number;
  bruttoJahr: number;
  vorsorgepauschaleJahr: number;
  steuer: {
    zvE: number;
    einkommensteuerJahr: number;
    soliJahr: number;
    kirchensteuerJahr: number;
    summeJahr: number;
    summeMonat: number;
  };
  pkvMonat: number;
  nettoVorPkvMonat: number; // Netto nach Steuern, vor PKV-Prämie
  nettoVorPkvJahr: number;
  nettoMonat: number;       // Netto nach Steuern und PKV
  nettoJahr: number;
}

export function calculateBeamtenNetto(input: BeamtenInput): BeamtenResult {
  const sk = input.steuerklasse ?? 1;
  const bruttoJahr = input.bruttoMonat * 12;

  // Mindestvorsorgepauschale (KV/PV) für Arbeitnehmer ohne RV-Pflicht
  const vorsorgepauschaleJahr = Math.min(bruttoJahr * 0.12, sk === 3 ? 3000 : 1900);

  const r = RECHENGROESSEN_2026;
  const zvE = Math.max(
    0,
    bruttoJahr - vorsorgepauschaleJahr - r.werbungskostenPauschale - r.sonderausgabenPauschale
  );

  // Steuerklassen-Behandlung spiegelt calculateNetto (gleiche Näherungen für V/VI)
  let estJahr: number;
  if (sk === 3) {
    estJahr = 2 * estFormel2026(zvE / 2);
  } else if (sk === 5) {
    const baseEst = estFormel2026(zvE);
    estJahr = Math.min(baseEst * 1.45, zvE * 0.40);
  } else if (sk === 6) {
    const zvE6 = Math.max(0, bruttoJahr - vorsorgepauschaleJahr);
    estJahr = estFormel2026(zvE6) * 1.1;
  } else if (sk === 2) {
    estJahr = estFormel2026(Math.max(0, zvE - 4260));
  } else {
    estJahr = estFormel2026(zvE);
  }

  const soliJahr = soliBerechnen(estJahr, sk === 3);
  const ksSatz = input.kirchensteuerSatz ?? 0.09;
  const kirchensteuerJahr = input.kirche ? estJahr * ksSatz : 0;

  const steuerSummeJahr = estJahr + soliJahr + kirchensteuerJahr;
  const nettoVorPkvJahr = bruttoJahr - steuerSummeJahr;
  const pkvMonat = Math.max(0, input.pkvMonat ?? 0);
  const nettoJahr = nettoVorPkvJahr - pkvMonat * 12;

  return {
    bruttoMonat: input.bruttoMonat,
    bruttoJahr,
    vorsorgepauschaleJahr,
    steuer: {
      zvE,
      einkommensteuerJahr: estJahr,
      soliJahr,
      kirchensteuerJahr,
      summeJahr: steuerSummeJahr,
      summeMonat: steuerSummeJahr / 12,
    },
    pkvMonat,
    nettoVorPkvMonat: nettoVorPkvJahr / 12,
    nettoVorPkvJahr,
    nettoMonat: nettoJahr / 12,
    nettoJahr,
  };
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

// --- Arbeitgeberkosten (employer's share) ---
// Der Arbeitgeber zahlt on top auf das Bruttogehalt seinen Anteil zur
// Sozialversicherung. Beitragssätze/BBG identisch zum Arbeitnehmerteil oben
// (RECHENGROESSEN_2026), damit die Zahlen konsistent zum Haupt-Rechner sind.
//  - RV:  9,3 % (halber Satz), bis RV/ALV-BBG
//  - ALV: 1,3 % (halber Satz), bis RV/ALV-BBG
//  - KV:  8,75 % (halber Satz inkl. hälftigem Zusatzbeitrag), bis KV/PV-BBG
//  - PV:  1,8 % (halber Grundbeitrag), bis KV/PV-BBG (Sachsen-Sonderfall unberücksichtigt)
// Nicht enthalten sind die Umlagen U1/U2/U3 (Insolvenzgeldumlage), die je nach
// Krankenkasse/Betrieb ~1,5–2 % ausmachen — im Rechner separat ausgewiesen.
export interface ArbeitgeberkostenResult {
  bruttoMonat: number;
  bruttoJahr: number;
  ag: {
    rente: number;
    arbeitslosen: number;
    kranken: number;
    pflege: number;
    summeMonat: number;
    summeJahr: number;
  };
  umlagenMonat: number;           // geschätzte Umlagen (U1/U2/U3) — optional
  arbeitgeberbruttoMonat: number; // Bruttogehalt + AG-Anteil (ohne Umlagen)
  arbeitgeberbruttoJahr: number;
  gesamtkostenMonat: number;      // inkl. geschätzter Umlagen
  gesamtkostenJahr: number;
  agQuotePct: number;             // AG-Anteil (ohne Umlagen) in % des Bruttos
}

// Durchschnittliche Umlagen (U1 Entgeltfortzahlung, U2 Mutterschaft,
// U3 Insolvenzgeldumlage). Nur eine grobe Orientierung — kassenabhängig.
const UMLAGEN_SATZ_SCHAETZUNG = 0.019;

export function calculateArbeitgeberkosten(
  bruttoMonat: number,
  mitUmlagen: boolean = true,
  kvZusatzbeitrag?: number
): ArbeitgeberkostenResult {
  const r = RECHENGROESSEN_2026;
  const bruttoJahr = bruttoMonat * 12;

  const kvPvBemessung = Math.min(bruttoJahr, r.kvPvBbgJahr);
  const rvAlvBemessung = Math.min(bruttoJahr, r.rvAlvBbgJahr);

  // Arbeitgeber trägt den halben KV-Satz inkl. halbem Zusatzbeitrag (Parität seit 2019)
  const kvSatzAg = (r.kvSatz + (kvZusatzbeitrag ?? r.kvZusatzbeitragDurchschnitt)) / 2;

  const renteJahr = rvAlvBemessung * (r.rvSatz / 2);
  const arbeitslosenJahr = rvAlvBemessung * (r.alvSatz / 2);
  const krankenJahr = kvPvBemessung * kvSatzAg;
  const pflegeJahr = kvPvBemessung * r.pvAgAnteil; // AG-Anteil PV: halber Grundbeitrag, 1,8 %

  const agSummeJahr = renteJahr + arbeitslosenJahr + krankenJahr + pflegeJahr;
  const umlagenJahr = mitUmlagen ? kvPvBemessung * UMLAGEN_SATZ_SCHAETZUNG : 0;

  const arbeitgeberbruttoJahr = bruttoJahr + agSummeJahr;
  const gesamtkostenJahr = arbeitgeberbruttoJahr + umlagenJahr;

  return {
    bruttoMonat,
    bruttoJahr,
    ag: {
      rente: renteJahr / 12,
      arbeitslosen: arbeitslosenJahr / 12,
      kranken: krankenJahr / 12,
      pflege: pflegeJahr / 12,
      summeMonat: agSummeJahr / 12,
      summeJahr: agSummeJahr,
    },
    umlagenMonat: umlagenJahr / 12,
    arbeitgeberbruttoMonat: arbeitgeberbruttoJahr / 12,
    arbeitgeberbruttoJahr,
    gesamtkostenMonat: gesamtkostenJahr / 12,
    gesamtkostenJahr,
    agQuotePct: bruttoJahr > 0 ? (agSummeJahr / bruttoJahr) * 100 : 0,
  };
}
