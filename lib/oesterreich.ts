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
  db: 0.037,
  kommunalsteuer: 0.03,
} as const;

/** Tarifsteuer auf ein Jahreseinkommen (§ 33 Abs. 1 EStG 1988). */
export function tarifsteuerAT(einkommen: number): number {
  let steuer = 0;
  let untergrenze = 0;
  for (const stufe of AT_2026.tarif) {
    if (einkommen <= untergrenze) break;
    steuer += (Math.min(einkommen, stufe.bis) - untergrenze) * stufe.satz;
    untergrenze = stufe.bis;
  }
  return steuer;
}

/** Grenzsteuersatz für ein Jahreseinkommen. */
export function grenzsteuersatzAT(einkommen: number): number {
  for (const stufe of AT_2026.tarif) if (einkommen <= stufe.bis) return stufe.satz;
  return 0.55;
}

export type PendlerArt = "keine" | "klein" | "gross";

export function pendlerpauschaleJahr(art: PendlerArt, km: number): number {
  if (art === "keine") return 0;
  const staffel = AT_2026.pendlerpauschale[art];
  let betrag = 0;
  for (const s of staffel) if (km >= s.ab) betrag = s.betrag;
  return betrag;
}

export function avabJahr(kinder: number): number {
  const a = AT_2026.avab;
  if (kinder <= 0) return 0;
  if (kinder === 1) return a.einKind;
  if (kinder === 2) return a.zweiKinder;
  return a.dreiKinder + (kinder - 3) * a.jedesWeitere;
}

/** Arbeitslosenversicherungs-Satz des Dienstnehmers nach Entgelthöhe. */
function avSatzAN(entgelt: number): number {
  for (const s of AT_2026.sv.avStaffel) if (entgelt <= s.bis) return s.satz;
  return AT_2026.sv.an.av;
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
  /** Alleinverdiener-/Alleinerzieherabsetzbetrag beanspruchen. */
  avab: boolean;
  pendler: PendlerArt;
  pendlerKm: number;
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

export function berechneBruttoNettoAT(e: EingabeAT): ErgebnisAT {
  const K = AT_2026;
  const brutto = Math.max(0, e.bruttoMonat);
  const wien = e.bundesland === "wien";
  const geringfuegig = brutto <= K.sv.geringfuegigkeitsgrenze;

  // ── Sozialversicherung laufend ──────────────────────────────────────────
  const bgl = Math.min(brutto, K.sv.hoechstbeitragsgrundlageMonat);
  const av = geringfuegig ? 0 : avSatzAN(brutto);
  const wf = wien ? K.sv.an.wfWien : K.sv.an.wf;
  const teileSatz = geringfuegig
    ? []
    : [
        { label: "Krankenversicherung", satz: K.sv.an.kv },
        { label: "Pensionsversicherung", satz: K.sv.an.pv },
        { label: "Arbeitslosenversicherung", satz: av },
        { label: "Arbeiterkammerumlage", satz: K.sv.an.akUmlage },
        { label: "Wohnbauförderungsbeitrag", satz: wf },
      ];
  const svTeile = teileSatz.map((t) => ({ label: t.label, betrag: r2(bgl * t.satz) }));
  const svSatz = teileSatz.reduce((s, t) => s + t.satz, 0);
  const svLaufend = r2(bgl * svSatz);

  // ── Lohnsteuer laufend (Jahreshochrechnung) ─────────────────────────────
  const pp = pendlerpauschaleJahr(e.pendler, e.pendlerKm);
  const bemessungJahr = Math.max(0, (brutto - svLaufend) * 12 - K.werbungskostenPauschale - pp);
  const tarifsteuerJahr = tarifsteuerAT(bemessungJahr);

  const kinder = Math.max(0, e.kinderUnter18) + Math.max(0, e.kinderAb18);
  const fbFaktor = e.familienbonusVoll ? 1 : 0.5;
  const familienbonusJahr =
    (e.kinderUnter18 * K.familienbonus.unter18 + e.kinderAb18 * K.familienbonus.ab18) * fbFaktor;
  const avab = e.avab ? avabJahr(kinder) : 0;

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
      return r2(grundlage * (K.sv.an.kv + K.sv.an.pv + avSatzAN(szBrutto)));
    });

    // Lohnsteuer: 620 € Freibetrag, dann 6 % / 27 % / 35,75 %; Freigrenze
    // auf das Jahressechstel. Standardfall: beide Sonderzahlungen liegen
    // innerhalb des Sechstels (2 Monatsbezüge = 1/6 von 12).
    const szLst = [0, 0];
    if (jahressechstel > K.sonstigeBezuege.freigrenze) {
      let freibetragRest: number = K.sonstigeBezuege.freibetrag;
      let genutzt = 0; // bereits verbrauchte Stufenbreite
      for (let i = 0; i < 2; i++) {
        let basis = Math.max(0, szBrutto - szSv[i]);
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
        if (basis > 0) steuer += basis * grenzsteuersatzAT(bemessungJahr + basis);
        szLst[i] = steuer;
      }
      // Einschleifregelung knapp über der Freigrenze: höchstens 30 % des
      // Betrags über der Einschleifgrenze (vereinfacht auf die Summe der
      // Sonderzahlungen angewendet, anteilig verteilt).
      const summe = szLst[0] + szLst[1];
      const deckel = 0.3 * Math.max(0, 2 * szBrutto - K.sonstigeBezuege.einschleifgrenze);
      if (summe > deckel && summe > 0) {
        szLst[0] *= deckel / summe;
        szLst[1] *= deckel / summe;
      }
    }

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
    grenzsteuersatz: grenzsteuersatzAT(bemessungJahr),
    arbeitgeber: {
      monat: r2(brutto + agSvLaufend + brutto * lohnsummenSatz),
      jahr: r2(jahr.brutto + lohnnebenkostenJahr),
      lohnnebenkostenJahr: r2(lohnnebenkostenJahr),
    },
  };
}

export function formatEURat(value: number): string {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" }).format(value);
}
