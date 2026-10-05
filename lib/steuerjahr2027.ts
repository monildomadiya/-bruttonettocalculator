/**
 * Steuerjahr-Umschaltung und Status-Register der Werte 2027.
 *
 * ── Standard-Steuerjahr ─────────────────────────────────────────────────
 * Bis 31.12.2026 rechnet der Hauptrechner standardmäßig mit 2026, ab dem
 * 1.1.2027 mit 2027. Die Startseite ruft `standardSteuerjahr()` serverseitig
 * auf; das Root-Layout revalidiert stündlich (`revalidate = 3600`, ISR).
 * Der Wechsel passiert damit spätestens eine Stunde nach Neujahr ohne Deploy.
 * Dasselbe gilt für den saisonalen Weihnachtsgeld-Hinweis (`istWeihnachtsgeldSaison`).
 *
 * ── Status-Register ─────────────────────────────────────────────────────
 * Die Zahlen selbst stehen weiterhin dort, wo die Engine sie braucht
 * (`lib/taxCalculator.ts`, `data/krankenkassen.ts`). Dieses Register
 * verweist nur auf sie und hält für jeden 2027-Wert fest, ob er endgültig
 * oder vorläufig ist und woher er stammt. Daraus speisen sich der
 * „vorläufig“-Hinweis im Rechner und die Statustabelle auf den 2027-Seiten.
 * Wird ein Wert endgültig: hier `status: "final"` setzen und `quelle` auf das
 * Gesetzblatt bzw. die verkündete Verordnung umstellen.
 */
import {
  ARBEITNEHMER_PAUSCHBETRAG,
  BETREUUNGSFREIBETRAG,
  ENTWURF,
  GRUNDFREIBETRAG,
  KINDERFREIBETRAG,
  KINDERGELD,
  SV_RECHENGROESSEN_2027_ENTWURF,
  type Steuerjahr,
} from "@/lib/taxCalculator";

/** Ab diesem Tag (deutsche Zeit) ist 2027 das Standard-Steuerjahr. */
export const JAHRESWECHSEL_2027 = new Date("2027-01-01T00:00:00+01:00");

export function standardSteuerjahr(jetzt: Date = new Date()): Steuerjahr {
  return jetzt >= JAHRESWECHSEL_2027 ? 2027 : 2026;
}

/**
 * Weihnachtsgeld-Saison: Oktober bis Dezember. Suchinteresse „Weihnachtsgeld“
 * erreicht jedes Jahr im November das 8- bis 10-Fache des Normalniveaus.
 */
export function istWeihnachtsgeldSaison(jetzt: Date = new Date()): boolean {
  const monat = Number(
    new Intl.DateTimeFormat("de-DE", { month: "numeric", timeZone: "Europe/Berlin" }).format(jetzt),
  );
  return monat >= 10;
}

export type WertStatus = "final" | "provisional";

export interface Parameter2027 {
  label: string;
  wert: string;
  status: WertStatus;
  /** Was noch aussteht, damit der Wert endgültig wird. */
  hinweis?: string;
  quelle: string;
}

const de = (n: number) => n.toLocaleString("de-DE");

const BMAS_ENTWURF = SV_RECHENGROESSEN_2027_ENTWURF.quelle;
const BT_DRUCKSACHE = ENTWURF.quelle;

export const PARAMETER_2027: Parameter2027[] = [
  {
    label: "Mindestlohn",
    wert: "14,60 € pro Stunde",
    status: "final",
    quelle: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html",
  },
  {
    label: "Minijob-Grenze",
    wert: "633 € im Monat",
    status: "final",
    hinweis: "folgt aus dem Mindestlohn (§ 8 Abs. 1a SGB IV)",
    quelle: "https://www.minijob-zentrale.de/",
  },
  {
    label: "Übergangsbereich (Midijob)",
    wert: "633,01 € bis 2.000 €",
    status: "final",
    quelle: "https://www.gesetze-im-internet.de/sgb_4/__20.html",
  },
  {
    label: "Minijob: Pauschalbeitrag Krankenversicherung (Arbeitgeber)",
    wert: "14,6 % + Ø-Zusatzbeitrag 2027 (bei 2,9 %: 17,5 %) statt 13 %",
    status: "final",
    hinweis: "GKV-Beitragssatzstabilisierungsgesetz, BGBl. vom 29.07.2026; die genaue Höhe hängt am Ø-Zusatzbeitrag 2027",
    quelle: "https://magazin.minijob-zentrale.de/aktuelle-minijob-vorhaben/",
  },
  {
    label: "Minijob: Pauschsteuer",
    wert: "5 % statt 2 %",
    status: "provisional",
    hinweis: "Regierungsentwurf EStRefG 2027 (§ 40a Abs. 2 EStG)",
    quelle: BT_DRUCKSACHE,
  },
  {
    label: "Faktor F (Midijob)",
    wert: "noch nicht veröffentlicht",
    status: "provisional",
    hinweis: "Bekanntgabe nach dem Ø-Zusatzbeitrag 2027, meist im Dezember",
    quelle: "https://www.deutsche-rentenversicherung.de/",
  },
  {
    label: "Grundfreibetrag",
    wert: `${de(GRUNDFREIBETRAG.entwurf2027)} €`,
    status: "provisional",
    hinweis: "Regierungsentwurf EStRefG 2027, Bundestag und Bundesrat stehen aus",
    quelle: BT_DRUCKSACHE,
  },
  {
    label: "Einkommensteuertarif",
    wert: "42 % ab 70.601 €, 45 % ab 250.000 €, neu 47 % ab 280.000 €",
    status: "provisional",
    hinweis: "Regierungsentwurf EStRefG 2027 (BT-Drs. 21/8235)",
    quelle: BT_DRUCKSACHE,
  },
  {
    label: "Arbeitnehmer-Pauschbetrag",
    wert: `${de(ARBEITNEHMER_PAUSCHBETRAG.reform)} €`,
    status: "provisional",
    hinweis: "Regierungsentwurf EStRefG 2027",
    quelle: BT_DRUCKSACHE,
  },
  {
    label: "Kindergeld / Kinderfreibetrag",
    wert: `${KINDERGELD.entwurf2027} € im Monat / ${de((KINDERFREIBETRAG.entwurf2027 + BETREUUNGSFREIBETRAG) * 2)} € je Kind (inkl. Betreuungsfreibetrag)`,
    status: "provisional",
    hinweis: "Regierungsentwurf EStRefG 2027",
    quelle: BT_DRUCKSACHE,
  },
  {
    label: "Beitragsbemessungsgrenze KV/PV",
    wert: `${de(SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat)} € im Monat`,
    status: "provisional",
    hinweis: "Referentenentwurf der Rechengrößen-Verordnung 2027",
    quelle: BMAS_ENTWURF,
  },
  {
    label: "Beitragsbemessungsgrenze RV/ALV",
    wert: `${de(SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgMonat)} € im Monat`,
    status: "provisional",
    hinweis: "Referentenentwurf der Rechengrößen-Verordnung 2027",
    quelle: BMAS_ENTWURF,
  },
  {
    label: "Versicherungspflichtgrenze",
    wert: `${de(SV_RECHENGROESSEN_2027_ENTWURF.versicherungspflichtgrenzeJahr)} € im Jahr`,
    status: "provisional",
    hinweis: "Referentenentwurf der Rechengrößen-Verordnung 2027",
    quelle: BMAS_ENTWURF,
  },
  {
    label: "Ø-Zusatzbeitrag Krankenversicherung",
    wert: "2,9 % (Wert 2026 als Platzhalter)",
    status: "provisional",
    hinweis: "das BMG gibt den Wert 2027 bis zum 1.11.2026 bekannt",
    quelle: "https://www.bundesgesundheitsministerium.de/",
  },
  {
    label: "Pflegeversicherung, Kinderlosenzuschlag",
    wert: "3,6 % / 0,6 % (Werte 2026)",
    status: "provisional",
    hinweis: "keine beschlossene Änderung für 2027 bekannt",
    quelle: "https://www.bundesgesundheitsministerium.de/",
  },
  {
    label: "Solidaritätszuschlag-Freigrenze",
    wert: "20.350 € / 40.700 € (Wert 2026)",
    status: "provisional",
    hinweis: "der Entwurf EStRefG 2027 ändert das SolzG nicht",
    quelle: BT_DRUCKSACHE,
  },
];

export const VORLAEUFIGE_WERTE_2027 = PARAMETER_2027.filter((p) => p.status === "provisional");
