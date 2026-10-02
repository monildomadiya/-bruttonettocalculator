/**
 * Brutto-Netto-Berechnung Österreich 2026 (Angestellte, laufende Bezüge plus
 * 13./14. Gehalt).
 *
 * Eigenes Modul, weil fast nichts mit Deutschland übereinstimmt: anderer Tarif
 * (§ 33 EStG 1988), Absetzbeträge statt Freibeträge, begünstigte Besteuerung
 * der Sonderzahlungen innerhalb des Jahressechstels (§ 67 EStG 1988) und eine
 * Sozialversicherung mit gemeinsamer Höchstbeitragsgrundlage.
 *
 * Werte 2026 (Inflationsanpassung um 2/3 der Inflationsrate, +1,733 %):
 *  - Tarifstufen: BMF, WKO "Aktuelle Werte Einkommensteuer 2026", AK OÖ.
 *  - SV: ÖGK "Sozialversicherungswerte 2026", Dachverband "Beitragsrechtliche
 *    Werte 2026"; Wohnbauförderungsbeitrag Wien ab 1.1.2026: ÖGK.
 *  - Sonstige Bezüge: Freigrenze 2.615 €, Einschleifgrenze 2.490 € (WKO,
 *    "Steuerliche Neuerungen 2026").
 *  - Absetzbeträge, Familienbonus Plus, Pendlerpauschale/-euro: BMF/USP.
 *  - DB 3,7 %, DZ je Bundesland, Kommunalsteuer 3 %: WKO.
 *
 * Werte 2027 (Inflationsanpassung +2,27 %, Inflationsanpassungsverordnung 2027,
 * BGBl. II Nr. 260/2026; SV-Werte 2027 laut ÖGK „Voraussichtliche Werte 2027“,
 * Budgetbegleitgesetz 2027-2028: AV-Staffel wird schrittweise abgeschafft).
 *
 * Pensionen (berechnePensionAT): 6 % Krankenversicherung auf laufende Pension
 * und Sonderzahlungen, Pensionistenabsetzbetrag statt Verkehrsabsetzbetrag,
 * keine Werbungskostenpauschale (PVA-Merkblatt „Sonderzahlungen“, BMF
 * Steuerbuch 2026).
 *
 * Geprüft gegen veröffentlichte Referenzrechnungen 2026 (scripts/oesterreich.test.mts):
 *  3.000 € → SV 542,10 €, LSt 283,82 €, netto 2.174,08 €; Urlaubsgeld netto
 *  2.375,83 €, Weihnachtsgeld netto 2.338,63 €. 4.000 € → Jahresnetto 38.971,02 €.
 *
 * Nicht abgebildet: Arbeiter-/Lehrlingssätze, Ältere (AV-Entfall ab
 * Pensionsalter), Überstundenzuschläge, Sachbezüge, Kindermehrbetrag und
 * Zuschlag zum Verkehrsabsetzbetrag (beide nur über die Arbeitnehmer-
 * veranlagung), SV-Rückerstattung, Freibeträge laut Freibetragsbescheid.
 */

export type Bundesland =
  | "burgenland"
  | "kaernten"
  | "niederoesterreich"
  | "oberoesterreich"
  | "salzburg"
  | "steiermark"
  | "tirol"
  | "vorarlberg"
  | "wien";

export const BUNDESLAENDER_AT: { id: Bundesland; name: string; dz: number }[] = [
  { id: "burgenland", name: "Burgenland", dz: 0.004 },
  { id: "kaernten", name: "Kärnten", dz: 0.0037 },
  { id: "niederoesterreich", name: "Niederösterreich", dz: 0.0033 },
  { id: "oberoesterreich", name: "Oberösterreich", dz: 0.0031 },
  { id: "salzburg", name: "Salzburg", dz: 0.0035 },
  { id: "steiermark", name: "Steiermark", dz: 0.0034 },
  { id: "tirol", name: "Tirol", dz: 0.0039 },
  { id: "vorarlberg", name: "Vorarlberg", dz: 0.0033 },
  { id: "wien", name: "Wien", dz: 0.0036 },
];

export const AT_2026 = {
  jahr: 2026,
  /** § 33 Abs. 1 EStG 1988 — Obergrenzen der Tarifstufen und Grenzsteuersätze. */
  tarif: [
    { bis: 13539, satz: 0 },
    { bis: 21992, satz: 0.2 },
    { bis: 36458, satz: 0.3 },
    { bis: 70365, satz: 0.4 },
    { bis: 104859, satz: 0.48 },
    { bis: 1000000, satz: 0.5 },
    { bis: Infinity, satz: 0.55 },
  ],
  werbungskostenPauschale: 132,
  verkehrsabsetzbetrag: 496,
  /** Erhöhter VAB bei Anspruch auf Pendlerpauschale, eingeschliffen. */
  vabErhoeht: { betrag: 853, voll: 15069, bis: 16056 },
  pendlereuroProKm: 6,
  /** Pendlerpauschale pro Jahr: kleines ab 20 km, großes ab 2 km. */
  pendlerpauschale: {
    klein: [
      { ab: 20, betrag: 696 },
      { ab: 40, betrag: 1356 },
      { ab: 60, betrag: 2016 },
    ],
    gross: [
      { ab: 2, betrag: 372 },
      { ab: 20, betrag: 1476 },
      { ab: 40, betrag: 2568 },
      { ab: 60, betrag: 3672 },
    ],
  },
  familienbonus: { unter18: 2000.16, ab18: 700.08 },
  /** Alleinverdiener-/Alleinerzieherabsetzbetrag: 1, 2, 3 Kinder, je weiteres. */
  avab: { einKind: 612, zweiKinder: 828, dreiKinder: 1101, jedesWeitere: 273 },

  sv: {
    hoechstbeitragsgrundlageMonat: 6930,
    hoechstbeitragsgrundlageSzJahr: 13860,
    geringfuegigkeitsgrenze: 551.1,
    /** Dienstnehmeranteile Angestellte. */
    an: { kv: 0.0387, pv: 0.1025, av: 0.0295, akUmlage: 0.005, wf: 0.005, wfWien: 0.0075 },
    /** AV-Verminderung bei geringem Entgelt (je Beitragszeitraum, SZ separat). */
    avStaffel: [
      { bis: 2225, satz: 0 },
      { bis: 2427, satz: 0.01 },
      { bis: 2630, satz: 0.02 },
    ],
    /** Gleiche Staffel für neue Dienstverhältnisse (Unterscheidung erst ab 2027). */
    avStaffelNeu: [
      { bis: 2225, satz: 0 },
      { bis: 2427, satz: 0.01 },
      { bis: 2630, satz: 0.02 },
    ],
    /** Dienstgeberanteile. WF auf Sonderzahlungen nicht beitragspflichtig. */
    ag: { kv: 0.0378, pv: 0.1255, av: 0.0295, uv: 0.011, iesg: 0.001, wf: 0.005, wfWien: 0.0075 },
    bv: 0.0153,
  },
  sonstigeBezuege: {
    freibetrag: 620,
    freigrenze: 2615,
    einschleifgrenze: 2490,
    /** Stufen auf die Bemessungsgrundlage nach Abzug des Freibetrags. */
    stufen: [
      { breite: 24380, satz: 0.06 },
      { breite: 25000, satz: 0.27 },
      { breite: 33333, satz: 0.3575 },
    ],
  },
  /** Pensionen: KV-Satz, Pensionistenabsetzbetrag (normal/erhöht) mit Einschleifung. */
  pension: {
    kv: 0.06,
    pab: { betrag: 1020, voll: 21614, bis: 31494 },
    pabErhoeht: { betrag: 1502, voll: 24616, bis: 31494 },
  },
  db: 0.037,
  kommunalsteuer: 0.03,
} as const;

export const AT_2027 = {
  jahr: 2027,
  /** § 33 Abs. 1 EStG 1988 — Obergrenzen der Tarifstufen und Grenzsteuersätze. */
  tarif: [
    { bis: 13846, satz: 0 },
    { bis: 22491, satz: 0.2 },
    { bis: 37285, satz: 0.3 },
    { bis: 71960, satz: 0.4 },
    { bis: 107236, satz: 0.48 },
    { bis: 1000000, satz: 0.5 },
    { bis: Infinity, satz: 0.55 },
  ],
  werbungskostenPauschale: 132,
  verkehrsabsetzbetrag: 508,
  /** Erhöhter VAB bei Anspruch auf Pendlerpauschale, eingeschliffen. */
  vabErhoeht: { betrag: 873, voll: 15411, bis: 16420 },
  pendlereuroProKm: 6,
  /** Pendlerpauschale pro Jahr: kleines ab 20 km, großes ab 2 km. */
  pendlerpauschale: {
    klein: [
      { ab: 20, betrag: 696 },
      { ab: 40, betrag: 1356 },
      { ab: 60, betrag: 2016 },
    ],
    gross: [
      { ab: 2, betrag: 372 },
      { ab: 20, betrag: 1476 },
      { ab: 40, betrag: 2568 },
      { ab: 60, betrag: 3672 },
    ],
  },
  familienbonus: { unter18: 2000.16, ab18: 700.08 },
  /** Alleinverdiener-/Alleinerzieherabsetzbetrag: 1, 2, 3 Kinder, je weiteres. */
  avab: { einKind: 626, zweiKinder: 847, dreiKinder: 1127, jedesWeitere: 280 },

  sv: {
    hoechstbeitragsgrundlageMonat: 7410,
    hoechstbeitragsgrundlageSzJahr: 14820,
    geringfuegigkeitsgrenze: 551.1,
    /** Dienstnehmeranteile Angestellte. */
    an: { kv: 0.0387, pv: 0.1025, av: 0.0295, akUmlage: 0.005, wf: 0.005, wfWien: 0.0075 },
    /** AV-Verminderung bei geringem Entgelt (je Beitragszeitraum, SZ separat). */
    /** Dienstverhältnisse, die am 31.12.2026 bereits bestanden (ÖGK). */
    avStaffel: [
      { bis: 2327, satz: 0.005 },
      { bis: 2539, satz: 0.015 },
      { bis: 2751, satz: 0.025 },
    ],
    /** Dienstverhältnisse ab 1.1.2027 (ÖGK). */
    avStaffelNeu: [
      { bis: 2327, satz: 0.01 },
      { bis: 2539, satz: 0.02 },
    ],
    /** Dienstgeberanteile. WF auf Sonderzahlungen nicht beitragspflichtig. */
    ag: { kv: 0.0378, pv: 0.1255, av: 0.0295, uv: 0.011, iesg: 0.001, wf: 0.005, wfWien: 0.0075 },
    bv: 0.0153,
  },
  sonstigeBezuege: {
    freibetrag: 620,
    /**
     * Freigrenze/Einschleifgrenze 2027: 2026er-Werte × 1,0227, gerundet —
     * die Verordnung selbst war beim Abruf (RIS) nicht lesbar. Wirkt nur bei
     * Monatsbezügen um 1.300 €.
     */
    freigrenze: 2674,
    einschleifgrenze: 2547,
    /** Stufen auf die Bemessungsgrundlage nach Abzug des Freibetrags. */
    stufen: [
      { breite: 24380, satz: 0.06 },
      { breite: 25000, satz: 0.27 },
      { breite: 33333, satz: 0.3575 },
    ],
  },
  /** Pensionen: KV-Satz, Pensionistenabsetzbetrag (normal/erhöht) mit Einschleifung. */
  pension: {
    kv: 0.06,
    pab: { betrag: 1044, voll: 22104, bis: 32208 },
    pabErhoeht: { betrag: 1537, voll: 25174, bis: 32208 },
  },
  db: 0.037,
  kommunalsteuer: 0.03,
} as const;

export type JahrAT = 2026 | 2027;
type WerteAT = typeof AT_2026 | typeof AT_2027;
export const AT_WERTE: Record<JahrAT, WerteAT> = { 2026: AT_2026, 2027: AT_2027 };

/** Tarifsteuer auf ein Jahreseinkommen (§ 33 Abs. 1 EStG 1988). */
export function tarifsteuerAT(einkommen: number, jahr: JahrAT = 2026): number {
  let steuer = 0;
  let untergrenze = 0;
  for (const stufe of AT_WERTE[jahr].tarif) {
    if (einkommen <= untergrenze) break;
    steuer += (Math.min(einkommen, stufe.bis) - untergrenze) * stufe.satz;
    untergrenze = stufe.bis;
  }
  return steuer;
}

/** Grenzsteuersatz für ein Jahreseinkommen. */
export function grenzsteuersatzAT(einkommen: number, jahr: JahrAT = 2026): number {
  for (const stufe of AT_WERTE[jahr].tarif) if (einkommen <= stufe.bis) return stufe.satz;
  return 0.55;
}

export type PendlerArt = "keine" | "klein" | "gross";

export function pendlerpauschaleJahr(art: PendlerArt, km: number): number {
  if (art === "keine") return 0;
  // Pendlerpauschale ist nicht inflationsindexiert — 2026 und 2027 gleich.
  const staffel = AT_2026.pendlerpauschale[art];
  let betrag = 0;
  for (const s of staffel) if (km >= s.ab) betrag = s.betrag;
  return betrag;
}

export function avabJahr(kinder: number, jahr: JahrAT = 2026): number {
  const a = AT_WERTE[jahr].avab;
  if (kinder <= 0) return 0;
  if (kinder === 1) return a.einKind;
  if (kinder === 2) return a.zweiKinder;
  return a.dreiKinder + (kinder - 3) * a.jedesWeitere;
}

/** Arbeitslosenversicherungs-Satz des Dienstnehmers nach Entgelthöhe. */
export function avSatzAN(entgelt: number, jahr: JahrAT = 2026, neu = false): number {
  const K = AT_WERTE[jahr];
  for (const s of neu ? K.sv.avStaffelNeu : K.sv.avStaffel) if (entgelt <= s.bis) return s.satz;
  return K.sv.an.av;
}

export interface EingabeAT {
  bruttoMonat: number;
  bundesland: Bundesland;
  /** 14 = mit Urlaubs- und Weihnachtsgeld, 12 = ohne Sonderzahlungen. */
  gehaelter: 12 | 14;
  kinderUnter18: number;
  kinderAb18: number;
  /** Familienbonus Plus zur Gänze (true) oder je zur Hälfte geteilt. */
  familienbonusVoll: boolean;
  /**
   * Anteil am Familienbonus Plus (1, 0,75, 0,5, 0,25) — überschreibt
   * `familienbonusVoll`. Ab 2027 ist für Kinder ab 4 Jahren bei zwei
   * Berechtigten nur noch 75:25 oder 50:50 möglich (Budgetbegleitgesetz 2027-2028).
   */
  familienbonusAnteil?: number;
  /** Alleinverdiener-/Alleinerzieherabsetzbetrag beanspruchen. */
  avab: boolean;
  pendler: PendlerArt;
  pendlerKm: number;
  /** Rechenjahr, Standard 2026. */
  jahr?: JahrAT;
  /** Nur 2027: Dienstverhältnis beginnt ab 1.1.2027 (andere AV-Staffel). */
  neuesDienstverhaeltnis?: boolean;
  /** AK-Umlage 0,5 % — entfällt z. B. für Vertragslehrpersonen (keine AK-Mitglieder). */
  akUmlage?: boolean;
}

export interface SonderzahlungAT {
  label: string;
  brutto: number;
  sv: number;
  lohnsteuer: number;
  netto: number;
}

export interface ErgebnisAT {
  geringfuegig: boolean;
  laufend: {
    brutto: number;
    sv: number;
    svSatz: number;
    lohnsteuer: number;
    netto: number;
    /** Aufschlüsselung der SV. */
    svTeile: { label: string; betrag: number }[];
    /** Aufschlüsselung der Lohnsteuer (Jahreswerte). */
    steuer: {
      bemessungJahr: number;
      tarifsteuerJahr: number;
      familienbonusJahr: number;
      avabJahr: number;
      vabJahr: number;
      pendlereuroJahr: number;
    };
  };
  sonderzahlungen: SonderzahlungAT[];
  jahr: { brutto: number; sv: number; lohnsteuer: number; netto: number };
  /** Netto pro Monat, wenn das Jahresnetto auf 12 Monate verteilt wird. */
  nettoMonatDurchschnitt: number;
  grenzsteuersatz: number;
  arbeitgeber: { monat: number; jahr: number; lohnnebenkostenJahr: number };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Lohnsteuer auf zwei gleich hohe Sonderzahlungen innerhalb des
 * Jahressechstels (§ 67 Abs. 1 und 2 EStG 1988): 620 € Freibetrag, dann
 * 6 % / 27 % / 35,75 %, Freigrenze auf das Jahressechstel, Einschleifregelung
 * knapp darüber. `basen` = Sonderzahlung minus darauf entfallende SV.
 */
function steuerSonderzahlungen(
  K: WerteAT,
  brutto: number[],
  basen: number[],
  jahressechstel: number,
  bemessungLaufend: number
): number[] {
  const szLst = basen.map(() => 0);
  if (jahressechstel <= K.sonstigeBezuege.freigrenze) return szLst;
  let freibetragRest: number = K.sonstigeBezuege.freibetrag;
  let genutzt = 0; // bereits verbrauchte Stufenbreite
  for (let i = 0; i < basen.length; i++) {
    let basis = Math.max(0, basen[i]);
    const fb = Math.min(basis, freibetragRest);
    freibetragRest -= fb;
    basis -= fb;
    let steuer = 0;
    let offset = 0;
    for (const st of K.sonstigeBezuege.stufen) {
      const frei = Math.max(0, offset + st.breite - genutzt);
      const teil = Math.min(basis, frei);
      steuer += teil * st.satz;
      basis -= teil;
      genutzt += teil;
      offset += st.breite;
      if (basis <= 0) break;
    }
    // Rest oberhalb von 83.333 € wie ein laufender Bezug (Grenzsteuersatz).
    if (basis > 0) steuer += basis * grenzsteuersatzAT(bemessungLaufend + basis, K.jahr);
    szLst[i] = steuer;
  }
  // Einschleifregelung knapp über der Freigrenze: höchstens 30 % des Betrags
  // über der Einschleifgrenze (vereinfacht auf die Summe angewendet, anteilig).
  const summe = szLst.reduce((a, b) => a + b, 0);
  const szSumme = brutto.reduce((a, b) => a + b, 0);
  const deckel = 0.3 * Math.max(0, szSumme - K.sonstigeBezuege.einschleifgrenze);
  if (summe > deckel && summe > 0) return szLst.map((v) => (v * deckel) / summe);
  return szLst;
}

export function berechneBruttoNettoAT(e: EingabeAT): ErgebnisAT {
  const jahrAT: JahrAT = e.jahr ?? 2026;
  const K = AT_WERTE[jahrAT];
  const neu = jahrAT === 2027 && !!e.neuesDienstverhaeltnis;
  const mitAk = e.akUmlage !== false;
  const brutto = Math.max(0, e.bruttoMonat);
  const wien = e.bundesland === "wien";
  const geringfuegig = brutto <= K.sv.geringfuegigkeitsgrenze;

  // ── Sozialversicherung laufend ──────────────────────────────────────────
  const bgl = Math.min(brutto, K.sv.hoechstbeitragsgrundlageMonat);
  const av = geringfuegig ? 0 : avSatzAN(brutto, jahrAT, neu);
  const wf = wien ? K.sv.an.wfWien : K.sv.an.wf;
  const teileSatz = geringfuegig
    ? []
    : [
        { label: "Krankenversicherung", satz: K.sv.an.kv },
        { label: "Pensionsversicherung", satz: K.sv.an.pv },
        { label: "Arbeitslosenversicherung", satz: av },
        ...(mitAk ? [{ label: "Arbeiterkammerumlage", satz: K.sv.an.akUmlage }] : []),
        { label: "Wohnbauförderungsbeitrag", satz: wf },
      ];
  const svTeile = teileSatz.map((t) => ({ label: t.label, betrag: r2(bgl * t.satz) }));
  const svSatz = teileSatz.reduce((s, t) => s + t.satz, 0);
  const svLaufend = r2(bgl * svSatz);

  // ── Lohnsteuer laufend (Jahreshochrechnung) ─────────────────────────────
  const pp = pendlerpauschaleJahr(e.pendler, e.pendlerKm);
  const bemessungJahr = Math.max(0, (brutto - svLaufend) * 12 - K.werbungskostenPauschale - pp);
  const tarifsteuerJahr = tarifsteuerAT(bemessungJahr, jahrAT);

  const kinder = Math.max(0, e.kinderUnter18) + Math.max(0, e.kinderAb18);
  const fbFaktor = e.familienbonusAnteil ?? (e.familienbonusVoll ? 1 : 0.5);
  const familienbonusJahr =
    (e.kinderUnter18 * K.familienbonus.unter18 + e.kinderAb18 * K.familienbonus.ab18) * fbFaktor;
  const avab = e.avab ? avabJahr(kinder, jahrAT) : 0;

  let vab: number = K.verkehrsabsetzbetrag;
  if (pp > 0) {
    const { betrag, voll, bis } = K.vabErhoeht;
    if (bemessungJahr <= voll) vab = betrag;
    else if (bemessungJahr < bis) vab = betrag - ((betrag - K.verkehrsabsetzbetrag) * (bemessungJahr - voll)) / (bis - voll);
  }
  const pendlereuro = pp > 0 ? K.pendlereuroProKm * Math.max(0, e.pendlerKm) : 0;

  // Familienbonus zuerst, danach die übrigen Absetzbeträge; nie unter null
  // (Negativsteuer gibt es nur über die Arbeitnehmerveranlagung).
  const nachFb = Math.max(0, tarifsteuerJahr - familienbonusJahr);
  const lstJahrLaufend = Math.max(0, nachFb - avab - vab - pendlereuro);
  const fbWirksam = tarifsteuerJahr - nachFb;
  const lstLaufend = r2(lstJahrLaufend / 12);
  const nettoLaufend = r2(brutto - svLaufend - lstLaufend);

  // ── Sonderzahlungen (13./14. Gehalt) ────────────────────────────────────
  const sonderzahlungen: SonderzahlungAT[] = [];
  if (e.gehaelter === 14 && brutto > 0) {
    const szBrutto = brutto; // je ein Monatsbezug
    const jahressechstel = (brutto * 12) / 6;

    // SV: eigene Höchstbeitragsgrundlage (Jahr), AV-Staffel je Zahlung,
    // keine AK-Umlage und kein Wohnbauförderungsbeitrag.
    let hbglRest: number = K.sv.hoechstbeitragsgrundlageSzJahr;
    const szSv = [0, 1].map(() => {
      if (geringfuegig) return 0;
      const grundlage = Math.min(szBrutto, hbglRest);
      hbglRest -= grundlage;
      return r2(grundlage * (K.sv.an.kv + K.sv.an.pv + avSatzAN(szBrutto, jahrAT, neu)));
    });

    // Standardfall: beide Sonderzahlungen liegen innerhalb des Sechstels
    // (2 Monatsbezüge = 1/6 von 12).
    const szLst = steuerSonderzahlungen(
      K,
      [szBrutto, szBrutto],
      szSv.map((sv) => szBrutto - sv),
      jahressechstel,
      bemessungJahr
    );

    ["Urlaubsgeld (14. Gehalt)", "Weihnachtsgeld (13. Gehalt)"].forEach((label, i) => {
      const lst = r2(szLst[i]);
      sonderzahlungen.push({ label, brutto: szBrutto, sv: szSv[i], lohnsteuer: lst, netto: r2(szBrutto - szSv[i] - lst) });
    });
  }

  // ── Jahreswerte ─────────────────────────────────────────────────────────
  const jahr = {
    brutto: r2(brutto * 12 + sonderzahlungen.reduce((s, z) => s + z.brutto, 0)),
    sv: r2(svLaufend * 12 + sonderzahlungen.reduce((s, z) => s + z.sv, 0)),
    lohnsteuer: r2(lstLaufend * 12 + sonderzahlungen.reduce((s, z) => s + z.lohnsteuer, 0)),
    netto: r2(nettoLaufend * 12 + sonderzahlungen.reduce((s, z) => s + z.netto, 0)),
  };

  // ── Arbeitgeber ─────────────────────────────────────────────────────────
  const ag = K.sv.ag;
  const agWf = wien ? ag.wfWien : ag.wf;
  const agSatzLaufend = geringfuegig ? ag.uv : ag.kv + ag.pv + ag.av + ag.uv + ag.iesg + agWf;
  const agSatzSz = geringfuegig ? ag.uv : ag.kv + ag.pv + ag.av + ag.uv + ag.iesg;
  const agSvLaufend = bgl * agSatzLaufend;
  const szSumme = sonderzahlungen.reduce((s, z) => s + z.brutto, 0);
  const agSvSz = Math.min(szSumme, K.sv.hoechstbeitragsgrundlageSzJahr) * agSatzSz;
  const dz = BUNDESLAENDER_AT.find((b) => b.id === e.bundesland)?.dz ?? 0;
  const lohnsummenSatz = K.sv.bv + K.db + dz + K.kommunalsteuer;
  const lohnnebenkostenJahr = agSvLaufend * 12 + agSvSz + jahr.brutto * lohnsummenSatz;

  return {
    geringfuegig,
    laufend: {
      brutto,
      sv: svLaufend,
      svSatz,
      lohnsteuer: lstLaufend,
      netto: nettoLaufend,
      svTeile,
      steuer: {
        bemessungJahr: r2(bemessungJahr),
        tarifsteuerJahr: r2(tarifsteuerJahr),
        familienbonusJahr: r2(fbWirksam),
        avabJahr: r2(Math.min(avab, nachFb)),
        vabJahr: r2(Math.min(vab, Math.max(0, nachFb - avab))),
        pendlereuroJahr: r2(Math.min(pendlereuro, Math.max(0, nachFb - avab - vab))),
      },
    },
    sonderzahlungen,
    jahr,
    nettoMonatDurchschnitt: r2(jahr.netto / 12),
    grenzsteuersatz: grenzsteuersatzAT(bemessungJahr, jahrAT),
    arbeitgeber: {
      monat: r2(brutto + agSvLaufend + brutto * lohnsummenSatz),
      jahr: r2(jahr.brutto + lohnnebenkostenJahr),
      lohnnebenkostenJahr: r2(lohnnebenkostenJahr),
    },
  };
}

// ── Pension ─────────────────────────────────────────────────────────────

export interface EingabePensionAT {
  bruttoPension: number;
  jahr?: JahrAT;
  /** Erhöhter Pensionistenabsetzbetrag (Ehe/Partnerschaft, Partner mit geringen Einkünften). */
  erhoehterPab: boolean;
  /** Alleinverdiener-/Alleinerzieherabsetzbetrag: Anzahl Kinder (0 = keiner). */
  avabKinder: number;
}

export interface ErgebnisPensionAT {
  laufend: {
    brutto: number;
    kv: number;
    lohnsteuer: number;
    netto: number;
    bemessungJahr: number;
    tarifsteuerJahr: number;
    pabJahr: number;
    avabJahr: number;
  };
  /** 13. und 14. Pension (April und Oktober). */
  sonderzahlungen: SonderzahlungAT[];
  jahr: { brutto: number; kv: number; lohnsteuer: number; netto: number };
  nettoMonatDurchschnitt: number;
  grenzsteuersatz: number;
}

/** Pensionistenabsetzbetrag nach Einschleifung (§ 33 Abs. 6 EStG 1988). */
export function pabJahr(pensionseinkuenfte: number, erhoeht: boolean, jahr: JahrAT = 2026): number {
  const P = AT_WERTE[jahr].pension;
  const { betrag, voll, bis } = erhoeht ? P.pabErhoeht : P.pab;
  if (pensionseinkuenfte <= voll) return betrag;
  if (pensionseinkuenfte >= bis) return 0;
  return (betrag * (bis - pensionseinkuenfte)) / (bis - voll);
}

/**
 * Nettopension Österreich (ASVG-Pension, 14 Auszahlungen). Abzüge: 6 %
 * Krankenversicherung, Lohnsteuer nach Tarif minus Pensionistenabsetzbetrag.
 * Keine Werbungskostenpauschale und kein Verkehrsabsetzbetrag. Geprüft: 2.000 €
 * brutto 2026 → KV 120,00 €, LSt 78,22 €, netto 1.801,78 €.
 */
export function berechnePensionAT(e: EingabePensionAT): ErgebnisPensionAT {
  const jahrAT: JahrAT = e.jahr ?? 2026;
  const K = AT_WERTE[jahrAT];
  const brutto = Math.max(0, e.bruttoPension);
  const kv = r2(brutto * K.pension.kv);

  const bemessungJahr = Math.max(0, (brutto - kv) * 12);
  const tarifsteuerJahr = tarifsteuerAT(bemessungJahr, jahrAT);
  const avab = e.avabKinder > 0 ? avabJahr(e.avabKinder, jahrAT) : 0;
  // Erhöhter PAB nur ohne Alleinverdienerabsetzbetrag.
  const pab = pabJahr(bemessungJahr, e.erhoehterPab && avab === 0, jahrAT);
  const nachAvab = Math.max(0, tarifsteuerJahr - avab);
  const lstJahr = Math.max(0, nachAvab - pab);
  const lst = r2(lstJahr / 12);
  const netto = r2(brutto - kv - lst);

  const sonderzahlungen: SonderzahlungAT[] = [];
  if (brutto > 0) {
    const szLst = steuerSonderzahlungen(K, [brutto, brutto], [brutto - kv, brutto - kv], brutto * 2, bemessungJahr);
    ["14. Pension (April)", "13. Pension (Oktober)"].forEach((label, i) => {
      const l = r2(szLst[i]);
      sonderzahlungen.push({ label, brutto, sv: kv, lohnsteuer: l, netto: r2(brutto - kv - l) });
    });
  }

  const sum = (f: (z: SonderzahlungAT) => number) => sonderzahlungen.reduce((s, z) => s + f(z), 0);
  const jahr = {
    brutto: r2(brutto * 12 + sum((z) => z.brutto)),
    kv: r2(kv * 12 + sum((z) => z.sv)),
    lohnsteuer: r2(lst * 12 + sum((z) => z.lohnsteuer)),
    netto: r2(netto * 12 + sum((z) => z.netto)),
  };

  return {
    laufend: {
      brutto,
      kv,
      lohnsteuer: lst,
      netto,
      bemessungJahr: r2(bemessungJahr),
      tarifsteuerJahr: r2(tarifsteuerJahr),
      pabJahr: r2(Math.min(pab, nachAvab)),
      avabJahr: r2(Math.min(avab, tarifsteuerJahr)),
    },
    sonderzahlungen,
    jahr,
    nettoMonatDurchschnitt: r2(jahr.netto / 12),
    grenzsteuersatz: grenzsteuersatzAT(bemessungJahr, jahrAT),
  };
}

export function formatEURat(value: number): string {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" }).format(value);
}
