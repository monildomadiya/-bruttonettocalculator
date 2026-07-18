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
 * Lohnabrechnung. Für 2027 liegen noch keine final beschlossenen Tarifwerte
 * vor (Stand: Juli 2026) — die Reform der Bundesregierung tritt frühestens
 * zum 1.1.2027 in Kraft und wird erst nach dem Existenzminimumbericht
 * (Herbst 2026) konkretisiert. Die 2027-Ansicht dieses Rechners verwendet
 * daher die 2026-Parameter als vorläufigen Platzhalter und weist dies aus.
 */

export type Steuerjahr = 2026 | 2027;

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
  rvSatz: 0.186,
  alvSatz: 0.026,
  werbungskostenPauschale: 1230,
  sonderausgabenPauschale: 36,
};

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

// Solidaritätszuschlag mit Milderungszone (20%-Abschmelzung)
// Freigrenze 2026: 18.130 € ESt (Einzelveranlagung) / 36.260 € (Splitting)
export function soliBerechnen(estJahr: number, verheiratet: boolean): number {
  const freigrenze = verheiratet ? 36260 : 18130;
  if (estJahr <= freigrenze) return 0;
  const voll = estJahr * 0.055;
  const abschmelzung = (estJahr - freigrenze) * 0.2;
  return Math.min(voll, abschmelzung);
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

  const kvSatzAn = (r.kvSatz + r.kvZusatzbeitragDurchschnitt) / 2;
  const pvSatzGesamt = r.pvSatzBasis + (input.kinderlosUeber23 ? r.pvZuschlagKinderlos : 0);
  // Arbeitgeberanteil PV ist regulär 1,7 % fix; AN trägt den Rest.
  // Sachsen-Sonderfall: AG trägt nur 1,2 %, AN daher 0,5 % mehr.
  const pvAgAnteil = input.sachsen ? 0.012 : 0.017;
  const pvSatzAn = pvSatzGesamt - pvAgAnteil;

  const kranken = kvPvBemessung * kvSatzAn;
  const pflege = kvPvBemessung * pvSatzAn;
  const rente = rvAlvBemessung * (r.rvSatz / 2);
  const arbeitslosen = rvAlvBemessung * (r.alvSatz / 2);

  const svSummeJahr = kranken + pflege + rente + arbeitslosen;

  // Vereinfachtes zu versteuerndes Einkommen für den Lohnsteuerabzug
  const zvE = Math.max(
    0,
    bruttoJahr - svSummeJahr - r.werbungskostenPauschale - r.sonderausgabenPauschale
  );

  const sk = input.steuerklasse ?? 1;

  let estJahr: number;
  if (sk === 3) {
    // Steuerklasse III: Splittingverfahren
    estJahr = 2 * estFormel2026(zvE / 2);
  } else if (sk === 5) {
    // Steuerklasse V: Erhöhter Tarif — Näherung: 35 % Grenzbelastung auf gesamtes zvE
    // (Vereinfachung für Überblick; korrekte Berechnung erfolgt im Lohnsteuerjahresausgleich)
    const baseEst = estFormel2026(zvE);
    estJahr = Math.min(baseEst * 1.45, zvE * 0.40);
  } else if (sk === 6) {
    // Steuerklasse VI: Keine Freibeträge, ab erstem Euro Steuer
    // Näherung: Standardformel ohne Grundfreibetrag
    const zvE6 = Math.max(0, bruttoJahr - svSummeJahr); // keine Pauschalen
    estJahr = estFormel2026(zvE6) * 1.1;
  } else if (sk === 2) {
    // Steuerklasse II: Alleinerziehendenentlastungsbetrag 4.260 € (2026)
    const zvE2 = Math.max(0, zvE - 4260);
    estJahr = estFormel2026(zvE2);
  } else {
    // Steuerklasse I, IV: Grundtarif
    estJahr = estFormel2026(zvE);
  }

  const soliJahr = soliBerechnen(estJahr, sk === 3);
  const ksSatz = input.kirchensteuerSatz ?? 0.09;
  const kirchensteuerJahr = input.kirche ? estJahr * ksSatz : 0;

  const steuerSummeJahr = estJahr + soliJahr + kirchensteuerJahr;
  const nettoJahr = bruttoJahr - svSummeJahr - steuerSummeJahr;

  const grenzsteuersatzPct = grenzsteuersatz2026(sk === 3 ? zvE / 2 : zvE) * 100;
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
//  - PV:  1,7 % fix (AG-Anteil), bis KV/PV-BBG (Sachsen-Sonderfall unberücksichtigt)
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
  mitUmlagen: boolean = true
): ArbeitgeberkostenResult {
  const r = RECHENGROESSEN_2026;
  const bruttoJahr = bruttoMonat * 12;

  const kvPvBemessung = Math.min(bruttoJahr, r.kvPvBbgJahr);
  const rvAlvBemessung = Math.min(bruttoJahr, r.rvAlvBbgJahr);

  // Arbeitgeber trägt den halben KV-Satz inkl. halbem Zusatzbeitrag (Parität seit 2019)
  const kvSatzAg = (r.kvSatz + r.kvZusatzbeitragDurchschnitt) / 2;

  const renteJahr = rvAlvBemessung * (r.rvSatz / 2);
  const arbeitslosenJahr = rvAlvBemessung * (r.alvSatz / 2);
  const krankenJahr = kvPvBemessung * kvSatzAg;
  const pflegeJahr = kvPvBemessung * 0.017; // AG-Anteil PV fix 1,7 %

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
