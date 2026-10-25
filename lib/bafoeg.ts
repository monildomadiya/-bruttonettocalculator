/**
 * BAföG für Studierende — eine Quelle für Rechner (Client), FAQ-Schema und
 * ToolContent. Geprüft am 25.10.2026 im Gesetzestext (gesetze-im-internet.de):
 *  - § 13 Abs. 1 Nr. 2, Abs. 2: Grundbedarf 475 €, Wohnen bei den Eltern 59 €,
 *    nicht bei den Eltern 380 €.
 *  - § 13a Abs. 1: Krankenversicherungszuschlag 102 €, Pflege 35 € (= 137 €).
 *    Bis 25.10.2026 stand hier 140 € — der Höchstsatz ergab dadurch 995 €.
 *  - § 25 Abs. 1, 3, 4: Elternfreibetrag 2.540 € (verheiratet) bzw. 1.690 €
 *    je Elternteil, +770 € je Kind; vom Rest bleiben 50 % + 5 % je Kind frei.
 *  - § 23 Abs. 1 Nr. 1 i. V. m. Abs. 6: Der Freibetrag aus eigenem Einkommen
 *    folgt seit dem 29. BAföGÄndG der Minijob-Grenze (§ 8 Abs. 1a SGB IV);
 *    seit 1.1.2026 also 603 € brutto im Monat (Minijob-Zentrale). Bis
 *    25.10.2026 stand hier der Wert von 2025 (556 €).
 *
 * Reform: 30. BAföGÄndG, Regierungsentwurf BT-Drs. 21/8405 vom 07.10.2026
 * (Kabinett 12.08.2026, 1. Lesung 15.10.2026) — NICHT beschlossen. Bei jedem
 * Verfahrensschritt BAFOEG_REFORM nachziehen.
 */
import { MINIJOB_GRENZE } from "@/lib/config2027";

export const BAFOEG = {
  grundbedarf: 475,
  wohnenEltern: 59,
  wohnenAuswaerts: 380,
  kvZuschlag: 102,
  pvZuschlag: 35,
  elternFreibetragVerheiratet: 2540,
  elternFreibetragJeElternteil: 1690,
  freibetragJeKind: 770,
  /** Anrechnungsfreier Anteil des Elterneinkommens über dem Freibetrag (§ 25 Abs. 4). */
  elternFreiQuote: 0.5,
  elternFreiQuoteJeKind: 0.05,
  /** Eigener Verdienst, anrechnungsfrei: Minijob-Grenze des Jahres (brutto/Monat). */
  hinzuverdienst: MINIJOB_GRENZE[2026],
  darlehenDeckel: 10010,
} as const;

export const KVPV_ZUSCHLAG = BAFOEG.kvZuschlag + BAFOEG.pvZuschlag;
export const BAFOEG_HOECHSTSATZ = BAFOEG.grundbedarf + BAFOEG.wohnenAuswaerts + KVPV_ZUSCHLAG;

export const BAFOEG_REFORM = {
  drucksache: "BT-Drs. 21/8405",
  drucksacheUrl: "https://dserver.bundestag.de/btd/21/084/2108405.pdf",
  stand: "1. Lesung im Bundestag am 15. Oktober 2026",
  quelleUrl: "https://www.bundestag.de/dokumente/textarchiv/2026/kw42-de-bafoeg-1223582",
  wohnpauschaleNeu: 440,
  wohnpauschaleAb: "Sommersemester 2027",
  /** Wohnen bei den Eltern: erst auf 41 € gesenkt, in einem zweiten Schritt gestrichen. */
  wohnenElternNeu: 41,
  grundbedarfStufe1: 503,
  grundbedarfStufe1Ab: "Wintersemester 2027/28",
  grundbedarfStufe2: 563,
  grundbedarfStufe2Ab: "Sommersemester 2029",
} as const;

const eur = (n: number) => n.toLocaleString("de-DE") + " €";

export const BAFOEG_FAQS = [
  {
    q: "Wie hoch ist der BAföG-Höchstsatz 2026?",
    a: `${eur(BAFOEG_HOECHSTSATZ)} im Monat für Studierende, die nicht bei den Eltern wohnen und selbst kranken- und pflegeversichert sind: ${eur(BAFOEG.grundbedarf)} Grundbedarf, ${eur(BAFOEG.wohnenAuswaerts)} für die Unterkunft und ${eur(KVPV_ZUSCHLAG)} Zuschlag für Kranken- und Pflegeversicherung (${eur(BAFOEG.kvZuschlag)} + ${eur(BAFOEG.pvZuschlag)}). Wer bei den Eltern wohnt, bekommt statt ${eur(BAFOEG.wohnenAuswaerts)} nur ${eur(BAFOEG.wohnenEltern)} für die Unterkunft.`,
  },
  {
    q: "Wird das Einkommen der Eltern beim BAföG angerechnet?",
    a: `Ja. Vom Einkommen der Eltern bleibt ein Freibetrag frei: ${eur(BAFOEG.elternFreibetragVerheiratet)} im Monat bei verheirateten, zusammenlebenden Eltern, sonst ${eur(BAFOEG.elternFreibetragJeElternteil)} je Elternteil, und ${eur(BAFOEG.freibetragJeKind)} mehr für jedes weitere Kind, das nicht selbst gefördert wird. Vom Rest bleibt die Hälfte frei, für jedes dieser Kinder weitere 5 %; nur der verbleibende Teil mindert das BAföG (§ 25 BAföG).`,
  },
  {
    q: "Wie viel darf ich neben dem BAföG verdienen?",
    a: `Seit dem 1. Januar 2026 bis zu ${eur(BAFOEG.hinzuverdienst)} brutto im Monat, also genau einen Minijob, ohne dass das BAföG gekürzt wird. Der Freibetrag folgt seit dem 29. BAföG-Änderungsgesetz der Minijob-Grenze und steigt mit ihr, wenn der Mindestlohn steigt. Verdienen Sie mehr, wird der übersteigende Teil angerechnet.`,
  },
  {
    q: "Muss ich BAföG zurückzahlen?",
    a: `Studierende bekommen BAföG zur Hälfte als Zuschuss und zur Hälfte als zinsloses Darlehen. Zurückgezahlt werden höchstens ${eur(BAFOEG.darlehenDeckel)}, frühestens fünf Jahre nach dem Ende der Förderungshöchstdauer.`,
  },
  {
    q: "Steigt das BAföG 2027?",
    a: `Geplant, aber noch nicht beschlossen. Der Regierungsentwurf zum 30. BAföG-Änderungsgesetz (${BAFOEG_REFORM.drucksache}) sieht eine Wohnpauschale von ${eur(BAFOEG_REFORM.wohnpauschaleNeu)} statt ${eur(BAFOEG.wohnenAuswaerts)} ab dem ${BAFOEG_REFORM.wohnpauschaleAb} vor, einen Grundbedarf von ${eur(BAFOEG_REFORM.grundbedarfStufe1)} ab dem ${BAFOEG_REFORM.grundbedarfStufe1Ab} und von ${eur(BAFOEG_REFORM.grundbedarfStufe2)} ab dem ${BAFOEG_REFORM.grundbedarfStufe2Ab}. Wer bei den Eltern wohnt, bekäme für die Unterkunft erst ${eur(BAFOEG_REFORM.wohnenElternNeu)} statt ${eur(BAFOEG.wohnenEltern)} und später gar nichts mehr. Stand: ${BAFOEG_REFORM.stand}, danach beraten die Ausschüsse; bis zur Verkündung gelten die heutigen Sätze.`,
  },
];
