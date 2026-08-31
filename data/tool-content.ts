import { eur, eur2, pct, netto, LADDER } from "@/data/tool-content-shared";
import { TOOL_CONTENT_EXTRA } from "@/data/tool-content-extra";
import { TOOL_CONTENT_MORE } from "@/data/tool-content-more";
import { TOOL_CONTENT_FINAL } from "@/data/tool-content-final";
import type { ToolContentConfig } from "@/components/ToolContent";

/**
 * Long-form content for the calculator pages, keyed by route.
 *
 * Server-only by construction: consumed by `page.tsx` server components via
 * `<ToolContent>`, so none of this prose — nor the tax engine it calls — is
 * shipped to the browser.
 *
 * The example tables are **computed by the live tax engine at build time**, not
 * typed out by hand. That matters twice over. They can never drift away from
 * what the calculator on the same page returns, which is the failure mode of
 * hand-maintained tables; and the numbers are genuinely this site's own, so the
 * pages carry substance no competitor's page duplicates — which is the whole
 * point of the exercise.
 *
 * Every figure quoted in the copy is traceable to a constant in
 * `lib/taxCalculator.ts` or to the FAQ already rendered on the same page. See
 * `components/ToolContent.tsx` for why these blocks exist at all.
 */

/* ── shared helpers ──────────────────────────────────────────────────── */

/* ── /gehaltserhoehung-rechner ───────────────────────────────────────── */

const RAISE = 200;

const gehaltserhoehung: ToolContentConfig = {
  heading: "Gehaltserhöhung netto berechnen: Was von der Erhöhung wirklich ankommt",
  answer:
    "Von einer Bruttogehaltserhöhung bleiben 2026 je nach Einkommen zwischen gut 40 und rund 60 Prozent netto übrig. Ausschlaggebend ist der Grenzsteuersatz — der Steuersatz auf den zuletzt verdienten Euro — zuzüglich 21,15 Prozent Arbeitnehmer-Sozialabgaben, solange die Beitragsbemessungsgrenzen noch nicht erreicht sind.",
  facts: [
    { label: "Sozialabgaben Arbeitnehmer (bis BBG)", value: "21,15 %" },
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Spitzensteuersatz 42 % ab zvE", value: "69.878 €" },
    { label: "BBG Kranken-/Pflegeversicherung", value: "5.812,50 € / Monat" },
    { label: "BBG Renten-/Arbeitslosenversicherung", value: "8.450 € / Monat" },
    { label: "Soli-Freigrenze (Einzelveranlagung)", value: "20.350 € ESt" },
  ],
  steps: [
    {
      title: "Netto vor der Erhöhung ermitteln",
      text: "Aus dem bisherigen Bruttomonatsgehalt werden Lohnsteuer, Solidaritätszuschlag, gegebenenfalls Kirchensteuer und die vier Sozialversicherungsbeiträge abgezogen.",
    },
    {
      title: "Netto nach der Erhöhung ermitteln",
      text: "Dieselbe Rechnung noch einmal — diesmal mit dem erhöhten Bruttogehalt. Weil der Steuertarif progressiv verläuft, steigt die Steuerlast überproportional.",
    },
    {
      title: "Differenz bilden",
      text: "Die Differenz beider Nettobeträge ist das, was tatsächlich mehr auf dem Konto landet. Der Anteil am Bruttoplus ist die Quote, die im Rechner als Behaltensquote ausgewiesen wird.",
    },
    {
      title: "Beitragsbemessungsgrenzen prüfen",
      text: "Oberhalb von 5.812,50 € beziehungsweise 8.450 € brutto im Monat fallen auf den übersteigenden Teil keine weiteren Sozialabgaben an — die Behaltensquote steigt dort wieder spürbar an.",
    },
  ],
  table: {
    caption: "Beispiel: 200 € mehr brutto im Monat (Steuerklasse 1, 2026)",
    head: ["Brutto / Monat", "Netto vorher", "Netto nachher", "Netto-Plus", "davon behalten"],
    rows: LADDER.map((b) => {
      const a = netto(b);
      const c = netto(b + RAISE);
      const plus = c.nettoMonat - a.nettoMonat;
      return [
        eur(b),
        eur(a.nettoMonat),
        eur(c.nettoMonat),
        "+" + eur(plus),
        pct((plus / RAISE) * 100, 0),
      ];
    }),
    note: "Berechnet mit der Steuerformel nach § 32a EStG, Steuerklasse 1, ohne Kirchensteuer, mit Kinderlosenzuschlag in der Pflegeversicherung und dem durchschnittlichen Zusatzbeitrag von 2,9 %.",
  },
  sections: [
    {
      h3: "Warum der Grenzsteuersatz und nicht der Durchschnittssteuersatz zählt",
      body: [
        "Der deutsche Einkommensteuertarif ist ein **Progressionstarif**: Jeder zusätzlich verdiente Euro wird höher besteuert als der vorherige. Wer 3.000 € brutto verdient, zahlt im Durchschnitt vielleicht 15 Prozent Steuern — auf die Erhöhung fallen aber bereits deutlich über 25 Prozent an. Genau diese Differenz erklärt das verbreitete Gefühl, von einer Gehaltserhöhung komme nichts an.",
        "Ein zweiter, oft übersehener Punkt: Die Erhöhung wird zusätzlich mit den vollen Sozialabgaben belastet, solange die [Beitragsbemessungsgrenzen](/beitragsbemessungsgrenze-2026) nicht überschritten sind. Erst oberhalb dieser Grenzen kehrt sich der Effekt um — dort steigt die Behaltensquote sprunghaft, weil Renten- und Arbeitslosenversicherung nicht weiter mitwachsen.",
      ],
    },
    {
      h3: "Gehaltsverhandlung: brutto fordern, netto rechnen",
      body: [
        "Für eine Verhandlung ist die interessantere Frage meist die umgekehrte: Welches Brutto brauche ich, damit ein bestimmter Nettobetrag herauskommt? Diese Richtung rechnet der [Netto-zu-Brutto-Rechner](/rechner/netto-zu-brutto), der die Steuerformel iterativ auflöst.",
        "Lohnend ist außerdem der Blick auf Gehaltsbestandteile, die nicht dem vollen Steuer- und Abgabenzugriff unterliegen. Eine [betriebliche Altersvorsorge per Entgeltumwandlung](/bav-rechner) ist bis 676 € monatlich steuerfrei und bis 338 € sozialabgabenfrei; ein [Firmenwagen](/firmenwagenrechner) wird nach der 1-%-Regelung bewertet. Beides verschiebt das Verhältnis von Bruttoaufwand zu Nettonutzen oft deutlich günstiger als eine reine Gehaltserhöhung.",
        "Wer die Erhöhung als Einmalzahlung erhält, rechnet mit dem [Bonus-Steuerrechner](/bonus-steuerrechner); wird sie rückwirkend gezahlt, lohnt sich zusätzlich der Blick auf die [Steuerrückerstattung](/steuerrueckerstattung-rechner).",
      ],
    },
    {
      h3: "Was die höhere Bruttozahl sonst noch bewirkt",
      body: [
        "Die Behaltensquote ist nicht der ganze Nutzen einer Erhöhung. Ein höheres Bruttoentgelt erhöht die Entgeltpunkte in der gesetzlichen Rentenversicherung und damit die spätere Rente — nachrechnen lässt sich das im [Rentenpunkte-Rechner](/rentenpunkte-rechner). Ebenso steigen die Bemessungsgrundlagen für [Arbeitslosengeld](/arbeitslosengeld-rechner), [Krankengeld](/krankengeld-rechner) und [Elterngeld](/elterngeld-rechner).",
        "Für die vollständige Aufschlüsselung aller Abzüge auf das neue Gehalt eignet sich der [Brutto-Netto-Rechner 2026](/brutto-netto-rechner-2026); die Werte für das kommende Jahr zeigt die [Vorschau auf 2027](/brutto-netto-rechner-2027).",
      ],
    },
  ],
  source: "§ 32a EStG · § 3 SolZG · SGB IV/V/VI/XI",
};

/* ── /minijob-rechner ────────────────────────────────────────────────── */

const MINIJOB_LEVELS = [300, 450, 538, 603];

const minijob: ToolContentConfig = {
  heading: "Minijob 2026: Verdienstgrenze, Abgaben und Auszahlung",
  answer:
    "Die Minijob-Grenze liegt seit dem 1. Januar 2026 bei 603 € im Monat, also 7.236 € im Jahr; zum 1. Januar 2027 steigt sie auf 633 €. Vom Verdienst geht allein der Rentenversicherungs-Eigenanteil von 3,6 % ab. Lohnsteuer und Beiträge zur Kranken-, Pflege- und Arbeitslosenversicherung fallen für Minijobber nicht an.",
  facts: [
    { label: "Minijob-Grenze 2026", value: "603 € / Monat" },
    { label: "Jahresgrenze 2026", value: "7.236 €" },
    { label: "Minijob-Grenze ab 2027", value: "633 € / Monat" },
    { label: "Rentenversicherung Eigenanteil", value: "3,6 %" },
    { label: "Kranken-, Pflege-, Arbeitslosenvers.", value: "0 %" },
    { label: "Midijob beginnt ab", value: "603,01 € / Monat" },
  ],
  steps: [
    {
      title: "Monatsverdienst gegen die Grenze prüfen",
      text: "Maßgeblich ist der regelmäßige Monatsverdienst. Bis einschließlich 603 € liegt ein Minijob vor; ab 603,01 € beginnt der Übergangsbereich, den der [Midijob-Rechner](/midijob-rechner) abbildet.",
    },
    {
      title: "Rentenversicherungsbeitrag abziehen",
      text: "Minijobber sind rentenversicherungspflichtig und tragen 3,6 % des Verdienstes selbst. Den weit größeren Teil trägt der Arbeitgeber pauschal.",
    },
    {
      title: "Befreiung abwägen",
      text: "Auf schriftlichen Antrag beim Arbeitgeber ist eine Befreiung von der Rentenversicherungspflicht möglich. Der Verdienst steigt dann um 3,6 %, es werden aber keine vollwertigen Beitragsmonate mehr erworben.",
    },
    {
      title: "Jahresgrenze im Blick behalten",
      text: "Ein gelegentliches unvorhersehbares Überschreiten ist in bis zu zwei Kalendermonaten pro Jahr zulässig. Wird die Jahresgrenze planmäßig überschritten, entfällt der Minijob-Status rückwirkend.",
    },
  ],
  table: {
    caption: "Minijob 2026: Auszahlung nach Rentenversicherungsbeitrag",
    head: ["Verdienst / Monat", "RV-Eigenanteil 3,6 %", "Auszahlung", "Auszahlung / Jahr"],
    rows: MINIJOB_LEVELS.map((v) => {
      const rv = v * 0.036;
      return [eur(v), "−" + eur2(rv), eur2(v - rv), eur((v - rv) * 12)];
    }),
    note: "Bei Befreiung von der Rentenversicherungspflicht wird der volle Verdienst ausgezahlt. Der Arbeitgeber führt in beiden Fällen seine Pauschalabgaben ab.",
  },
  sections: [
    {
      h3: "Minijob, Midijob oder reguläre Beschäftigung?",
      body: [
        "Die Minijob-Grenze ist seit 2022 an den [gesetzlichen Mindestlohn](/mindestlohn) gekoppelt: Sie entspricht dem Verdienst aus zehn Wochenstunden zum jeweiligen Mindestlohn. Weil dieser zum 1. Januar 2026 auf 13,90 € gestiegen ist, liegt die Grenze bei 603 € — und steigt mit der nächsten Mindestlohnstufe 2027 auf 633 €.",
        "Direkt oberhalb der Grenze beginnt der **Übergangsbereich** (Midijob) von 603,01 € bis 2.000 €. Dort werden die Arbeitnehmerbeiträge nicht vom vollen Entgelt, sondern von einer reduzierten beitragspflichtigen Einnahme berechnet, sodass die Abgabenlast gleitend ansteigt statt an der Grenze zu springen. Der [Midijob-Rechner](/midijob-rechner) zeigt diesen Verlauf.",
      ],
    },
    {
      h3: "Steuern: warum Minijobber in der Regel nichts zahlen",
      body: [
        "Der Arbeitgeber versteuert den Minijob üblicherweise pauschal mit 2 %, die er selbst trägt. Der Verdienst bleibt dann in der Steuererklärung des Beschäftigten vollständig unberücksichtigt — er erhöht weder das zu versteuernde Einkommen noch den Steuersatz auf andere Einkünfte.",
        "Wird stattdessen individuell nach Lohnsteuerkarte abgerechnet, zählt der Verdienst regulär mit. Bei [Steuerklasse](/steuerklassen) 1 bis 4 fällt bis zum Grundfreibetrag von 12.348 € ohnehin keine Steuer an; in Steuerklasse 6 — also beim zweiten Arbeitsverhältnis — wird dagegen ab dem ersten Euro einbehalten. Was dabei zurückkommt, zeigt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
      ],
    },
    {
      h3: "Minijob neben Hauptjob, Studium oder Rente",
      body: [
        "Neben einer sozialversicherungspflichtigen Hauptbeschäftigung bleibt **ein** Minijob abgabenfrei. Jeder weitere wird mit dem Hauptjob zusammengerechnet und voll beitragspflichtig. Wie sich der Hauptjob auswirkt, rechnet der [Brutto-Netto-Rechner](/) durch.",
        "Studierende fahren mit einer [Werkstudentenstelle](/werkstudent-rechner) oft besser: Dort gilt zwar der volle Rentenbeitrag von 9,3 %, dafür ist der Verdienst nicht gedeckelt. Wer Bürgergeld bezieht, sollte die Anrechnungsfreibeträge im [Bürgergeld-Rechner](/buergergeld-rechner) prüfen — vom Minijob-Verdienst bleibt dort nur ein Teil anrechnungsfrei.",
      ],
    },
  ],
  source: "§ 8 SGB IV · § 20 Abs. 2a SGB IV · § 40a EStG",
};

/* ── /midijob-rechner ────────────────────────────────────────────────── */

const midijob: ToolContentConfig = {
  heading: "Midijob 2026: Übergangsbereich von 603,01 € bis 2.000 €",
  answer:
    "Im Übergangsbereich — dem Midijob — zahlen Beschäftigte zwischen 603,01 € und 2.000 € Monatsentgelt reduzierte Sozialversicherungsbeiträge. Die Arbeitnehmerbeiträge werden nicht vom vollen Entgelt berechnet, sondern von einer verminderten beitragspflichtigen Einnahme; den Differenzbetrag trägt der Arbeitgeber. Der volle Rentenanspruch bleibt dabei erhalten.",
  facts: [
    { label: "Untergrenze Übergangsbereich", value: "603,01 € / Monat" },
    { label: "Obergrenze Übergangsbereich", value: "2.000 € / Monat" },
    { label: "Faktor F 2026", value: "0,6619" },
    { label: "Amtlicher Prüfpunkt bei 1.200 €", value: "854,69 € AN-Bemessung" },
    { label: "Beitragssatz Arbeitnehmer oberhalb", value: "21,15 %" },
    { label: "Rentenanspruch", value: "aus vollem Entgelt" },
  ],
  steps: [
    {
      title: "Prüfen, ob der Übergangsbereich greift",
      text: "Er gilt für regelmäßige Monatsentgelte über 603 € und bis einschließlich 2.000 €. Darunter liegt ein [Minijob](/minijob-rechner), darüber die reguläre Beitragspflicht.",
    },
    {
      title: "Beitragspflichtige Einnahme berechnen",
      text: "Aus dem tatsächlichen Entgelt wird über die amtliche Formel mit dem Faktor F von 0,6619 eine reduzierte Bemessungsgrundlage abgeleitet. Bei 1.200 € Entgelt sind das 854,69 € für den Arbeitnehmeranteil.",
    },
    {
      title: "Arbeitnehmerbeiträge anwenden",
      text: "Auf diese reduzierte Bemessungsgrundlage werden die üblichen Arbeitnehmersätze angewandt — zusammen 21,15 % inklusive des halben durchschnittlichen Zusatzbeitrags von 2,9 %.",
    },
    {
      title: "Lohnsteuer separat ermitteln",
      text: "Die Steuer richtet sich unverändert nach [Steuerklasse](/steuerklassen) und Bruttoentgelt — der Übergangsbereich entlastet nur bei den Sozialabgaben, nicht bei der Lohnsteuer.",
    },
  ],
  sections: [
    {
      h3: "Warum der Übergangsbereich überhaupt existiert",
      body: [
        "Ohne ihn gäbe es an der Minijob-Grenze eine harte Kante: Bei 603 € wären keine Arbeitnehmerbeiträge fällig, bei 604 € sofort die vollen 21,15 %. Netto käme aus dem höheren Brutto weniger heraus als vorher — ein klassischer Fehlanreiz. Der Übergangsbereich glättet diesen Sprung, indem die Belastung von null an der Untergrenze gleitend auf den vollen Satz an der Obergrenze ansteigt.",
        "Wichtig für die Altersvorsorge: Trotz der reduzierten Beiträge werden die Entgeltpunkte aus dem **vollen** Bruttoentgelt ermittelt. Ein Midijob mindert die spätere Rente also nicht — was ihn deutlich attraktiver macht als einen Minijob mit Befreiung. Nachrechnen lässt sich das im [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
      ],
    },
    {
      h3: "Midijob in Teilzeit, im Studium und neben der Rente",
      body: [
        "Viele Midijobs entstehen aus reduzierter Arbeitszeit. Wie sich eine bestimmte Stundenzahl auf das Bruttoentgelt auswirkt, zeigt der [Teilzeitrechner](/teilzeitrechner); den Weg von der Stundenzahl zum Monatsbrutto rechnet der [Stundenlohn-Rechner](/stundenlohn-rechner).",
        "Für Studierende ist meist die [Werkstudentenregelung](/werkstudent-rechner) günstiger, weil dort ausschließlich der Rentenbeitrag anfällt und die Verdiensthöhe nicht gedeckelt ist. Oberhalb von 2.000 € gilt wieder die normale Beitragspflicht — die vollständige Abrechnung liefert dann der [Brutto-Netto-Rechner](/).",
      ],
    },
  ],
  source: "§ 20 Abs. 2a SGB IV · Übergangsbereichsformel 2026",
};

/* ── /werkstudent-rechner ────────────────────────────────────────────── */

const WERKSTUDENT_LEVELS = [600, 800, 1000, 1200, 1500];

const werkstudent: ToolContentConfig = {
  heading: "Werkstudent 2026: Abgaben, 20-Stunden-Regel und Netto",
  answer:
    "Werkstudierende zahlen dank des Werkstudentenprivilegs nur den Rentenversicherungsbeitrag von 9,3 %. Beiträge zur Kranken-, Pflege- und Arbeitslosenversicherung entfallen, solange während der Vorlesungszeit höchstens 20 Stunden pro Woche gearbeitet wird. Lohnsteuer fällt erst an, wenn das Jahreseinkommen den Grundfreibetrag von 12.348 € übersteigt.",
  facts: [
    { label: "Rentenversicherung Arbeitnehmeranteil", value: "9,3 %" },
    { label: "Kranken-, Pflege-, Arbeitslosenvers.", value: "0 %" },
    { label: "Höchstarbeitszeit Vorlesungszeit", value: "20 Std. / Woche" },
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Arbeitnehmer-Pauschbetrag", value: "1.230 €" },
    { label: "Steuerfrei bis rund", value: "1.131 € / Monat" },
  ],
  steps: [
    {
      title: "Werkstudentenstatus prüfen",
      text: "Voraussetzung ist eine ordentliche Immatrikulation und die Einhaltung der 20-Stunden-Grenze während der Vorlesungszeit. In den Semesterferien darf mehr gearbeitet werden, ohne den Status zu verlieren.",
    },
    {
      title: "Rentenbeitrag abziehen",
      text: "Vom Bruttoverdienst gehen 9,3 % Rentenversicherung ab. Die übrigen Sozialversicherungszweige bleiben beitragsfrei — das ist der eigentliche finanzielle Kern des Werkstudentenprivilegs.",
    },
    {
      title: "Lohnsteuer nach Steuerklasse ermitteln",
      text: "In den [Steuerklassen](/steuerklassen) 1 und 2 bleibt der Verdienst bis zum Grundfreibetrag steuerfrei. Wird dennoch Lohnsteuer einbehalten, holt die Steuererklärung sie zurück.",
    },
    {
      title: "Krankenversicherung klären",
      text: "Bis 25 Jahre besteht häufig Familienversicherung, sonst greift die studentische Krankenversicherung. Beide sind vom Arbeitsverhältnis unabhängig, solange die 20-Stunden-Grenze eingehalten wird.",
    },
  ],
  table: {
    caption: "Werkstudent 2026: Netto nach Rentenbeitrag (Steuerklasse 1)",
    head: ["Brutto / Monat", "RV-Beitrag 9,3 %", "Netto / Monat", "Brutto / Jahr"],
    rows: WERKSTUDENT_LEVELS.map((b) => {
      const rv = b * 0.093;
      return [eur(b), "−" + eur2(rv), eur2(b - rv), eur(b * 12)];
    }),
    note: "Ohne Lohnsteuer gerechnet — bis zu einem Jahresbrutto von 12.348 € zuzüglich Arbeitnehmer-Pauschbetrag fällt in Steuerklasse 1 keine Einkommensteuer an. Darüber greift der Tarif nach § 32a EStG.",
  },
  sections: [
    {
      h3: "Was die 20-Stunden-Regel genau bedeutet",
      body: [
        "Die Grenze gilt nur während der **Vorlesungszeit**. In den Semesterferien ist Vollzeitarbeit möglich, ohne dass das Privileg entfällt. Auch Arbeit überwiegend am Abend, am Wochenende oder in der Nacht kann die Grenze zulässig überschreiten, weil das Studium dann weiterhin die Hauptsache bleibt.",
        "Wird die Grenze dauerhaft in der Vorlesungszeit überschritten, entfällt die Beitragsfreiheit und es gelten die regulären Sätze — die Abgabenlast springt dann von 9,3 % auf 21,15 %. Wie sich das auswirkt, zeigt der [Brutto-Netto-Rechner](/).",
      ],
    },
    {
      h3: "Werkstudent, Minijob oder Midijob — was lohnt sich?",
      body: [
        "Der [Minijob](/minijob-rechner) ist bis 603 € abgabengünstiger, weil dort nur 3,6 % Rentenbeitrag anfallen — dafür ist der Verdienst gedeckelt. Zwischen 603,01 € und 2.000 € greift der [Übergangsbereich](/midijob-rechner) mit gleitend steigenden Beiträgen. Oberhalb davon ist die Werkstudentenstelle mit ihren konstanten 9,3 % klar die günstigste Variante.",
        "Wer BAföG bezieht, muss zusätzlich den Anrechnungsfreibetrag beachten — dafür ist der [BAföG-Rechner](/bafoeg-rechner) da, die spätere Tilgung rechnet der [BAföG-Rückzahlungsrechner](/bafoeg-rueckzahlung-rechner).",
      ],
    },
    {
      h3: "Steuererklärung lohnt sich fast immer",
      body: [
        "Wurde während des Jahres Lohnsteuer einbehalten, das Jahreseinkommen bleibt aber unter dem Grundfreibetrag, wird die gesamte einbehaltene Steuer erstattet. Zusätzlich lassen sich Semesterbeiträge, Fachliteratur, Arbeitsmittel und Fahrtkosten geltend machen — Letztere über die [Pendlerpauschale](/pendlerpauschale-rechner) mit 0,38 € je Entfernungskilometer.",
        "Die Größenordnung der Erstattung schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner) ab.",
      ],
    },
  ],
  source: "§ 6 Abs. 1 Nr. 3 SGB V · § 5 Abs. 3 SGB VI · § 32a EStG",
};

/* ── /pendlerpauschale-rechner ───────────────────────────────────────── */

const PENDLER_KM = [10, 20, 30, 50, 80];
const PENDLER_TAGE = 220;

const pendlerpauschale: ToolContentConfig = {
  heading: "Pendlerpauschale 2026: 0,38 € ab dem ersten Kilometer",
  answer:
    "Seit dem 1. Januar 2026 beträgt die Entfernungspauschale einheitlich 0,38 € je Entfernungskilometer — und zwar ab dem ersten Kilometer. Die frühere Staffelung mit 0,30 € für die ersten 20 Kilometer ist entfallen. Angesetzt wird die einfache Strecke pro Arbeitstag, nicht Hin- und Rückweg.",
  facts: [
    { label: "Entfernungspauschale 2026", value: "0,38 € / km" },
    { label: "Gilt ab", value: "dem 1. Kilometer" },
    { label: "Bis 2025: erste 20 km", value: "0,30 € / km" },
    { label: "Berücksichtigte Strecke", value: "einfache Strecke" },
    { label: "Arbeitnehmer-Pauschbetrag", value: "1.230 € / Jahr" },
    { label: "Wirkung", value: "erst oberhalb des Pauschbetrags" },
  ],
  steps: [
    {
      title: "Entfernung bestimmen",
      text: "Maßgeblich ist die einfache Entfernung zwischen Wohnung und erster Tätigkeitsstätte, auf volle Kilometer abgerundet. In der Regel ist die kürzeste Straßenverbindung anzusetzen.",
    },
    {
      title: "Arbeitstage zählen",
      text: "Angesetzt werden nur Tage mit tatsächlicher Fahrt zur Arbeit. Üblich sind 220 bis 230 Tage im Jahr; Urlaubs-, Krankheits- und Homeoffice-Tage zählen nicht mit.",
    },
    {
      title: "Pauschale berechnen",
      text: "Entfernung × Arbeitstage × 0,38 € ergibt die Werbungskosten aus dem Arbeitsweg.",
    },
    {
      title: "Gegen den Pauschbetrag rechnen",
      text: "Das Finanzamt berücksichtigt ohne Nachweis bereits 1.230 € Arbeitnehmer-Pauschbetrag. Steuerlich wirkt sich nur aus, was diesen Betrag übersteigt.",
    },
  ],
  table: {
    caption: "Entfernungspauschale 2026 bei 220 Arbeitstagen",
    head: ["Entfernung", "Pauschale / Jahr", "über dem Pauschbetrag", "Steuerersparnis bei 30 %"],
    rows: PENDLER_KM.map((km) => {
      const total = km * PENDLER_TAGE * 0.38;
      const ueber = Math.max(0, total - 1230);
      return [
        km + " km",
        eur(total),
        ueber > 0 ? eur(ueber) : "—",
        ueber > 0 ? "rund " + eur(ueber * 0.3) : "—",
      ];
    }),
    note: "Die Steuerersparnis hängt vom persönlichen Grenzsteuersatz ab; 30 % ist ein typischer Wert für mittlere Einkommen. Den eigenen Grenzsteuersatz zeigt der [Gehaltserhöhung-Rechner](/gehaltserhoehung-rechner).",
  },
  sections: [
    {
      h3: "Was sich zum 1. Januar 2026 geändert hat",
      body: [
        "Bis 2025 galt eine Staffelung: 0,30 € für die ersten 20 Kilometer, 0,38 € ab dem 21. Kilometer. Seit 2026 gilt der höhere Satz **einheitlich ab dem ersten Kilometer**. Die Reform begünstigt vor allem Kurz- und Mittelstreckenpendler — bei 20 Kilometern Entfernung und 220 Arbeitstagen steigt die Pauschale um 352 € im Jahr.",
        "Unverändert bleibt: Es zählt die einfache Strecke, nicht die Gesamtfahrleistung. Wer 30 Kilometer zur Arbeit und wieder zurück fährt, setzt 30 Kilometer an, nicht 60.",
      ],
    },
    {
      h3: "Verkehrsmittel, Homeoffice und Fahrgemeinschaften",
      body: [
        "Die Entfernungspauschale ist **verkehrsmittelunabhängig**. Sie steht auch zu, wer zu Fuß, mit dem Fahrrad, dem Bus oder der Bahn fährt — bei öffentlichen Verkehrsmitteln dürfen alternativ die tatsächlichen Kosten angesetzt werden, wenn sie höher sind. Auch Mitfahrer in einer Fahrgemeinschaft erhalten die volle Pauschale.",
        "Homeoffice-Tage sind keine Fahrttage und dürfen nicht mitgezählt werden. Für sie kommt stattdessen die Tagespauschale für das häusliche Arbeiten in Betracht — beide Pauschalen sind für denselben Tag jedoch nicht kombinierbar.",
      ],
    },
    {
      h3: "Wann sich der Aufwand steuerlich wirklich lohnt",
      body: [
        "Weil der Arbeitnehmer-Pauschbetrag von 1.230 € automatisch angesetzt wird, wirkt sich die Pendlerpauschale erst darüber hinaus aus. Diese Schwelle ist 2026 bei rund 15 Kilometern und 220 Arbeitstagen erreicht. Wer darunter liegt, profitiert nur, wenn weitere Werbungskosten hinzukommen — Fachliteratur, Arbeitsmittel, Fortbildungen oder ein Arbeitszimmer.",
        "Wie stark sich zusätzliche Werbungskosten auf die Erstattung auswirken, schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner). Die Jahressteuer insgesamt rechnet der [Einkommensteuer-Rechner](/einkommensteuer-rechner); wer stattdessen einen [Firmenwagen](/firmenwagenrechner) nutzt, rechnet nach der 1-%-Regelung und setzt den Arbeitsweg gesondert an.",
      ],
    },
  ],
  source: "§ 9 Abs. 1 Satz 3 Nr. 4 EStG · § 9a EStG",
};

/* ── /krankengeld-rechner ────────────────────────────────────────────── */

const krankengeld: ToolContentConfig = {
  heading: "Krankengeld 2026: Höhe, Dauer und Abzüge",
  answer:
    "Das Krankengeld beträgt 70 % des Bruttoarbeitsentgelts, höchstens jedoch 90 % des Nettoarbeitsentgelts. Von diesem Betrag gehen noch die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab — zusammen rund 12,5 %. Gezahlt wird es ab der siebten Woche der Arbeitsunfähigkeit, wenn die Entgeltfortzahlung des Arbeitgebers endet.",
  facts: [
    { label: "Krankengeld", value: "70 % vom Brutto" },
    { label: "Obergrenze", value: "90 % vom Netto" },
    { label: "Abzüge vom Krankengeld", value: "rund 12,5 %" },
    { label: "Entgeltfortzahlung Arbeitgeber", value: "6 Wochen" },
    { label: "Höchstdauer je Krankheit", value: "78 Wochen in 3 Jahren" },
    { label: "Steuerpflicht", value: "steuerfrei, Progressionsvorbehalt" },
  ],
  steps: [
    {
      title: "Regelentgelt ermitteln",
      text: "Grundlage ist das im letzten abgerechneten Monat erzielte Bruttoarbeitsentgelt, umgerechnet auf einen Kalendertag.",
    },
    {
      title: "Beide Obergrenzen vergleichen",
      text: "Berechnet werden 70 % des Bruttoregelentgelts und 90 % des Nettoarbeitsentgelts. Der niedrigere der beiden Beträge ist das Brutto-Krankengeld.",
    },
    {
      title: "Sozialabgaben abziehen",
      text: "Vom Brutto-Krankengeld gehen die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab. Beiträge zur Krankenversicherung fallen nicht an — die Kasse zahlt ja selbst.",
    },
    {
      title: "Auf Kalendertage umrechnen",
      text: "Krankengeld wird je Kalendertag gezahlt, ein voller Monat also mit 30 Tagen. Auch Wochenenden und Feiertage werden vergütet.",
    },
  ],
  table: {
    caption: "Krankengeld 2026 im Beispiel (Steuerklasse 1, kinderlos)",
    head: ["Brutto / Monat", "Netto / Monat", "Krankengeld brutto", "Auszahlung / Monat"],
    rows: [2000, 3000, 4000, 5000].map((b) => {
      const n = netto(b).nettoMonat;
      const bruttoTag = b / 30;
      const nettoTag = n / 30;
      const kgTag = Math.min(bruttoTag * 0.7, nettoTag * 0.9);
      const kgMonat = kgTag * 30;
      return [eur(b), eur(n), eur(kgMonat), eur(kgMonat * 0.875)];
    }),
    note: "Die Auszahlung ist das Brutto-Krankengeld abzüglich rund 12,5 % Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung.",
  },
  sections: [
    {
      h3: "Der Progressionsvorbehalt — die häufigste Überraschung",
      body: [
        "Krankengeld ist **steuerfrei**, unterliegt aber dem Progressionsvorbehalt. Es erhöht also nicht das zu versteuernde Einkommen selbst, wohl aber den Steuersatz, der auf das übrige Einkommen angewandt wird. Wer im selben Jahr längere Zeit Krankengeld bezogen hat, muss deshalb häufig mit einer Nachzahlung rechnen — und ist zur Abgabe einer Steuererklärung verpflichtet, sobald die Lohnersatzleistungen 410 € im Jahr übersteigen.",
        "Wie stark der Effekt ausfällt, hängt vom übrigen Jahreseinkommen ab; die Jahressteuer darauf rechnet der [Einkommensteuer-Rechner](/einkommensteuer-rechner). Dasselbe gilt für [Arbeitslosengeld](/arbeitslosengeld-rechner), [Kurzarbeitergeld](/kurzarbeitergeld-rechner) und [Elterngeld](/elterngeld-rechner).",
      ],
    },
    {
      h3: "Ablauf: Entgeltfortzahlung, dann Krankengeld",
      body: [
        "In den ersten sechs Wochen einer Arbeitsunfähigkeit zahlt der Arbeitgeber das Entgelt in voller Höhe fort. Erst danach springt die Krankenkasse ein — mit dem spürbar niedrigeren Krankengeld. Für dieselbe Erkrankung wird es längstens 78 Wochen innerhalb von drei Jahren gezahlt, abzüglich der sechs Wochen Entgeltfortzahlung.",
        "Die Differenz zum gewohnten Nettoeinkommen ist erheblich: Wer 3.000 € brutto verdient, verliert im Krankengeldbezug typischerweise rund ein Fünftel seines Nettos. Den Ausgangswert liefert der [Brutto-Netto-Rechner](/); bei privater Absicherung lohnt der Vergleich im [PKV-vs-GKV-Rechner](/private-krankenversicherung-vs-gesetzlich).",
      ],
    },
  ],
  source: "§ 47 SGB V · § 32b EStG",
};

/* ── /kurzarbeitergeld-rechner ───────────────────────────────────────── */

const kurzarbeitergeld: ToolContentConfig = {
  heading: "Kurzarbeitergeld 2026: 60 % oder 67 % der Nettoentgeltdifferenz",
  answer:
    "Kurzarbeitergeld ersetzt 60 % der Nettoentgeltdifferenz, mit mindestens einem Kind im Haushalt 67 %. Die Nettoentgeltdifferenz ist der Unterschied zwischen dem pauschalierten Netto beim vollen Soll-Entgelt und dem Netto beim tatsächlich gezahlten Ist-Entgelt. Gezahlt wird die Leistung von der Bundesagentur für Arbeit über den Arbeitgeber.",
  facts: [
    { label: "Leistungssatz ohne Kind", value: "60 %" },
    { label: "Leistungssatz mit Kind", value: "67 %" },
    { label: "Bemessungsgrundlage", value: "Nettoentgeltdifferenz" },
    { label: "Auszahlung durch", value: "Arbeitgeber" },
    { label: "Steuerpflicht", value: "steuerfrei, Progressionsvorbehalt" },
    { label: "Sozialabgaben", value: "keine auf das KUG" },
  ],
  steps: [
    {
      title: "Soll-Entgelt bestimmen",
      text: "Das Bruttoentgelt, das ohne Arbeitsausfall angefallen wäre — die Bemessungsgrundlage für den Vergleich.",
    },
    {
      title: "Ist-Entgelt bestimmen",
      text: "Das Bruttoentgelt, das während der Kurzarbeit tatsächlich gezahlt wird. Bei 50 % Arbeitsausfall also die Hälfte des Soll-Entgelts.",
    },
    {
      title: "Nettoentgeltdifferenz bilden",
      text: "Beide Beträge werden in pauschaliertes Netto umgerechnet; die Differenz ist die Bemessungsgrundlage für das Kurzarbeitergeld.",
    },
    {
      title: "Leistungssatz anwenden",
      text: "Auf die Nettoentgeltdifferenz werden 60 % gezahlt, mit mindestens einem Kind im Haushalt 67 %.",
    },
  ],
  table: {
    caption: "Kurzarbeitergeld bei 50 % Arbeitsausfall (Steuerklasse 1, 2026)",
    head: ["Soll-Brutto", "Netto voll", "Netto bei 50 %", "KUG 60 %", "Gesamt netto"],
    rows: [2500, 3000, 3500, 4500].map((b) => {
      const voll = netto(b).nettoMonat;
      const halb = netto(b / 2).nettoMonat;
      const kug = (voll - halb) * 0.6;
      return [eur(b), eur(voll), eur(halb), eur(kug), eur(halb + kug)];
    }),
    note: "Vereinfachte Darstellung mit dem Netto aus dem Brutto-Netto-Rechner. Die Bundesagentur für Arbeit rechnet mit pauschalierten Nettoentgelten nach amtlicher Tabelle, weshalb der amtliche Bescheid geringfügig abweichen kann.",
  },
  sections: [
    {
      h3: "Warum netto weniger als 60 % verloren gehen",
      body: [
        "Kurzarbeitergeld wird nicht auf das entfallene Brutto, sondern auf die **Nettoentgeltdifferenz** gezahlt. Weil der Steuertarif progressiv ist, sinkt mit dem Bruttoentgelt auch die Steuerbelastung überproportional — das reduzierte Ist-Entgelt wird also milder besteuert. Unterm Strich fällt der Nettoverlust dadurch geringer aus als der Bruttoausfall vermuten lässt.",
        "Auf das Kurzarbeitergeld selbst fallen weder Lohnsteuer noch Arbeitnehmer-Sozialabgaben an. Der Arbeitgeber führt allerdings weiterhin Sozialversicherungsbeiträge auf ein fiktives Entgelt ab, sodass der Rentenanspruch weitgehend erhalten bleibt.",
      ],
    },
    {
      h3: "Progressionsvorbehalt und Steuererklärung",
      body: [
        "Wie [Krankengeld](/krankengeld-rechner) und [Arbeitslosengeld](/arbeitslosengeld-rechner) unterliegt auch das Kurzarbeitergeld dem Progressionsvorbehalt: Es bleibt steuerfrei, erhöht aber den Steuersatz auf das übrige Einkommen. Ab 410 € Lohnersatzleistungen im Jahr besteht Pflicht zur Steuererklärung, und eine Nachzahlung ist der Regelfall.",
        "Die Größenordnung lässt sich vorab abschätzen: Der [Einkommensteuer-Rechner](/einkommensteuer-rechner) zeigt die Jahressteuer, der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner) die Gegenrichtung. Wer während der Kurzarbeit einen Nebenjob aufnimmt, sollte beachten, dass dieser auf das Kurzarbeitergeld angerechnet werden kann — die Grenzen zeigt der [Minijob-Rechner](/minijob-rechner).",
      ],
    },
  ],
  source: "§§ 95 ff. SGB III · § 32b EStG",
};

/* ── /jahresgehalt-rechner ───────────────────────────────────────────── */

const jahresgehalt: ToolContentConfig = {
  heading: "Jahresgehalt 2026: von brutto zu netto im Jahr",
  answer:
    "Das Bruttojahresgehalt ist die Summe aller Bruttobezüge eines Kalenderjahres — einschließlich Weihnachts- und Urlaubsgeld sowie Boni. Netto bleiben davon 2026 je nach Steuerklasse und Einkommenshöhe rund 55 bis 70 Prozent. Bei zwölf gleichen Monatsgehältern entspricht das Jahresbrutto dem Zwölffachen des Monatsbruttos.",
  facts: [
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Arbeitnehmer-Pauschbetrag", value: "1.230 €" },
    { label: "Sozialabgaben Arbeitnehmer", value: "21,15 % bis BBG" },
    { label: "BBG Kranken-/Pflegeversicherung", value: "69.750 € / Jahr" },
    { label: "BBG Renten-/Arbeitslosenvers.", value: "101.400 € / Jahr" },
    { label: "Spitzensteuersatz 42 % ab zvE", value: "69.878 €" },
  ],
  steps: [
    {
      title: "Alle Bruttobezüge summieren",
      text: "Zwölf Monatsgehälter plus Sonderzahlungen wie Weihnachts- und Urlaubsgeld, Boni, Provisionen und geldwerte Vorteile.",
    },
    {
      title: "Sozialabgaben ermitteln",
      text: "21,15 % Arbeitnehmeranteil, jedoch nur bis zu den Beitragsbemessungsgrenzen von 69.750 € beziehungsweise 101.400 € im Jahr.",
    },
    {
      title: "Zu versteuerndes Einkommen bilden",
      text: "Vom Bruttojahreslohn werden Arbeitnehmer-Pauschbetrag, Vorsorgeaufwendungen und Sonderausgaben abgezogen.",
    },
    {
      title: "Jahressteuer nach § 32a EStG berechnen",
      text: "Auf das zu versteuernde Einkommen wird der Einkommensteuertarif angewandt, dazu kommen gegebenenfalls Solidaritätszuschlag und Kirchensteuer.",
    },
  ],
  table: {
    caption: "Jahresgehalt brutto zu netto 2026 (Steuerklasse 1, ohne Kirchensteuer)",
    head: ["Brutto / Jahr", "Netto / Jahr", "Netto / Monat", "Abgabenquote"],
    rows: LADDER.map((m) => {
      const r = netto(m);
      const quote = (1 - r.nettoJahr / r.bruttoJahr) * 100;
      return [eur(r.bruttoJahr), eur(r.nettoJahr), eur(r.nettoMonat), pct(quote, 1)];
    }),
    note: "Steuerklasse 1, kinderlos über 23 Jahre, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag 2,9 %. Die Abgabenquote umfasst Lohnsteuer, Solidaritätszuschlag und Arbeitnehmer-Sozialabgaben.",
  },
  sections: [
    {
      h3: "13. und 14. Monatsgehalt richtig einordnen",
      body: [
        "Sonderzahlungen zählen steuerlich als **sonstige Bezüge** und werden nicht wie laufender Arbeitslohn besteuert, sondern nach der Jahreslohnsteuertabelle. Praktisch bedeutet das einen hohen Abzug im Auszahlungsmonat — ausgeglichen wird das spätestens über den Lohnsteuerjahresausgleich oder die Steuererklärung.",
        "Bei den Sozialabgaben gilt eine Besonderheit: Beiträge fallen nur an, soweit die Jahres-Beitragsbemessungsgrenze noch nicht ausgeschöpft ist. Wer mit dem laufenden Gehalt bereits darüber liegt, erhält Weihnachts- und Urlaubsgeld sozialabgabenfrei. Die Einzelrechnung dazu leisten der [Weihnachtsgeld-Rechner](/weihnachtsgeld-rechner), der [Urlaubsgeld-Rechner](/urlaubsgeld-rechner) und der [Bonus-Steuerrechner](/bonus-steuerrechner).",
      ],
    },
    {
      h3: "Wo das Jahresbrutto sonst noch gebraucht wird",
      body: [
        "Das Bruttojahresgehalt ist die Bezugsgröße für zahlreiche Schwellen: die Versicherungspflichtgrenze für den Wechsel in die [private Krankenversicherung](/private-krankenversicherung-vs-gesetzlich), die Beitragsbemessungsgrenzen der [Sozialversicherung](/beitragsbemessungsgrenze-2026), die steuerfreien Höchstbeträge der [betrieblichen Altersvorsorge](/bav-rechner) und die Bonitätsprüfung bei der [Immobilienfinanzierung](/immobilienkredit-rechner).",
        "Zur Einordnung des eigenen Gehalts im Bundesvergleich dient die Übersicht [Durchschnittsgehalt Deutschland](/durchschnittsgehalt-deutschland); wie sich die Zahlen zwischen den Steuerklassen unterscheiden, zeigt die [Brutto-Netto-Tabelle](/brutto-netto-gehaltstabelle).",
      ],
    },
  ],
  source: "§ 32a EStG · § 39b EStG · SGB IV",
};

/* ── /teilzeitrechner ────────────────────────────────────────────────── */

const teilzeit: ToolContentConfig = {
  heading: "Teilzeit 2026: Netto bei reduzierter Arbeitszeit",
  answer:
    "Bei Teilzeit sinkt das Bruttogehalt proportional zur Arbeitszeit, das Netto jedoch unterproportional. Grund ist der progressive Steuertarif: Ein halbiertes Bruttogehalt wird mit einem deutlich niedrigeren Durchschnittssteuersatz belastet, sodass anteilig mehr netto übrig bleibt als bei Vollzeit.",
  facts: [
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Sozialabgaben Arbeitnehmer", value: "21,15 %" },
    { label: "Minijob-Grenze", value: "603 € / Monat" },
    { label: "Übergangsbereich (Midijob)", value: "603,01 – 2.000 €" },
    { label: "Anspruch auf Teilzeit ab", value: "6 Monaten Betriebszugehörigkeit" },
    { label: "Betriebsgröße für Rechtsanspruch", value: "über 15 Beschäftigte" },
  ],
  steps: [
    {
      title: "Teilzeitquote bestimmen",
      text: "Die vereinbarte Wochenstundenzahl geteilt durch die betriebsübliche Vollzeit — etwa 20 von 40 Stunden entsprechen einer Quote von 50 %.",
    },
    {
      title: "Bruttogehalt anteilig kürzen",
      text: "Das Vollzeit-Bruttogehalt wird mit der Teilzeitquote multipliziert. Bei tariflicher Bindung gilt die jeweilige Entgeltgruppe anteilig.",
    },
    {
      title: "Netto neu berechnen",
      text: "Auf das reduzierte Brutto werden Lohnsteuer und Sozialabgaben angewandt. Wegen der Steuerprogression sinkt die Abgabenquote spürbar.",
    },
    {
      title: "Schwellenwerte prüfen",
      text: "Unterhalb von 2.000 € greift der [Übergangsbereich](/midijob-rechner) mit reduzierten Arbeitnehmerbeiträgen, unterhalb von 603 € die [Minijob-Regelung](/minijob-rechner).",
    },
  ],
  sections: [
    {
      h3: "Warum Teilzeit netto besser dasteht als erwartet",
      body: [
        "Wer die Arbeitszeit halbiert, verliert nicht die Hälfte des Nettos. Der Grundfreibetrag von 12.348 € bleibt unverändert erhalten, und der progressive Tarif belastet das niedrigere Einkommen mit einem geringeren Durchschnittssteuersatz. In der Tabelle oben ist das gut sichtbar: Die Abgabenquote sinkt mit jeder reduzierten Stunde.",
        "Umgekehrt gilt dasselbe beim Aufstocken — der zusätzliche Verdienst wird mit dem höheren Grenzsteuersatz belastet. Diesen Effekt zeigt der [Gehaltserhöhung-Rechner](/gehaltserhoehung-rechner).",
      ],
    },
    {
      h3: "Steuerklassenwahl bei Paaren mit ungleichen Einkommen",
      body: [
        "Arbeitet ein Partner in Teilzeit, ist die Kombination der [Steuerklassen](/steuerklassen) der größte Stellhebel für das gemeinsame Monatsnetto. Die Kombination 3/5 verschiebt Netto zum besser verdienenden Partner, 4/4 mit Faktor verteilt die Last verursachungsgerecht. Am Jahresende gleicht die gemeinsame Veranlagung ohnehin alles aus — die Wahl beeinflusst also die Liquidität während des Jahres, nicht die Gesamtsteuer.",
        "Beide Varianten vergleicht der [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner). Wichtig ist zudem die Wirkung auf Lohnersatzleistungen: [Elterngeld](/elterngeld-rechner), [Arbeitslosengeld](/arbeitslosengeld-rechner) und [Krankengeld](/krankengeld-rechner) bemessen sich am Nettoentgelt und damit indirekt an der Steuerklasse.",
      ],
    },
    {
      h3: "Was bei Teilzeit sonst anteilig gilt",
      body: [
        "Der [Urlaubsanspruch](/urlaubsanspruch-rechner) richtet sich nach der Zahl der Arbeitstage pro Woche, nicht nach den Stunden: Wer an fünf Tagen kürzer arbeitet, behält den vollen Urlaubsanspruch in Tagen. Rentenansprüche entstehen anteilig zum tatsächlichen Verdienst — die Auswirkung zeigt der [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
        "Wer aus der Teilzeit heraus in eine Vollzeitstelle zurückkehrt, prüft die Gegenrichtung am besten mit dem [Brutto-Netto-Rechner](/) oder dem [Stundenlohn-Rechner](/stundenlohn-rechner).",
      ],
    },
  ],
  source: "§ 8 TzBfG · § 32a EStG · § 20 Abs. 2a SGB IV",
};

/* ── /lohnsteuerrechner ──────────────────────────────────────────────── */

const lohnsteuer: ToolContentConfig = {
  heading: "Lohnsteuer 2026 berechnen: Tarif, Steuerklassen und Abzüge",
  answer:
    "Die Lohnsteuer ist keine eigene Steuerart, sondern die Vorauszahlung auf die Einkommensteuer, die der Arbeitgeber direkt vom Bruttolohn einbehält. Ihre Höhe folgt dem Tarif nach § 32a EStG und hängt von Bruttolohn, Steuerklasse, Kinderfreibeträgen und Kirchensteuerpflicht ab. Der Grundfreibetrag liegt 2026 bei 12.348 €.",
  facts: [
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "Eingangssteuersatz", value: "14 %" },
    { label: "Spitzensteuersatz 42 % ab zvE", value: "69.878 €" },
    { label: "Reichensteuer 45 % ab zvE", value: "277.825 €" },
    { label: "Solidaritätszuschlag", value: "5,5 % über der Freigrenze" },
    { label: "Soli-Freigrenze (Einzelveranlagung)", value: "20.350 € ESt" },
  ],
  steps: [
    {
      title: "Bruttoarbeitslohn feststellen",
      text: "Laufender Arbeitslohn zuzüglich geldwerter Vorteile wie Dienstwagen oder Sachbezüge.",
    },
    {
      title: "Freibeträge abziehen",
      text: "Arbeitnehmer-Pauschbetrag von 1.230 €, Sonderausgaben-Pauschbetrag, Vorsorgepauschale und je nach [Steuerklasse](/steuerklassen) weitere Freibeträge.",
    },
    {
      title: "Tarif anwenden",
      text: "Auf das verbleibende zu versteuernde Einkommen wird die Formel nach § 32a EStG angewandt — in Steuerklasse 3 auf den halbierten Betrag mit anschließender Verdopplung (Splittingverfahren).",
    },
    {
      title: "Zuschläge aufschlagen",
      text: "Solidaritätszuschlag von 5,5 % oberhalb der Freigrenze von 20.350 € Jahressteuer, dazu bei Kirchenmitgliedschaft 8 % oder 9 % Kirchensteuer.",
    },
  ],
  sections: [
    {
      h3: "Lohnsteuer und Einkommensteuer sind nicht dasselbe",
      body: [
        "Die Lohnsteuer ist eine **Erhebungsform** der Einkommensteuer, keine eigene Steuer. Der Arbeitgeber behält sie monatlich ein und führt sie ans Finanzamt ab — auf Basis einer Hochrechnung des Jahreseinkommens aus dem aktuellen Monatslohn. Diese Hochrechnung ist naturgemäß ungenau, sobald das Einkommen im Jahresverlauf schwankt.",
        "Genau daraus entstehen Erstattungen: Wer unterjährig Sonderzahlungen erhalten, die Stelle gewechselt oder in Teilzeit gearbeitet hat, hat meist zu viel Lohnsteuer gezahlt. Die endgültige Abrechnung leistet erst die Steuererklärung — die Jahressteuer rechnet der [Einkommensteuer-Rechner](/einkommensteuer-rechner), die Erstattungshöhe schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
      ],
    },
    {
      h3: "Die Steuerklasse verschiebt Liquidität, nicht Steuerlast",
      body: [
        "Alle sechs [Steuerklassen](/steuerklassen) führen bei gleichem Jahreseinkommen zur gleichen Jahressteuer. Was sie verändern, ist die Verteilung über das Jahr — und bei Ehepaaren die Verteilung zwischen den Partnern. Die Kombination 3/5 maximiert das laufende Netto des besser verdienenden Partners, 4/4 mit Faktor verteilt verursachungsgerecht; verglichen werden beide im [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner).",
        "Steuerklasse 6 gilt für jedes zweite und weitere Arbeitsverhältnis und kennt keine Freibeträge — der Abzug beginnt beim ersten Euro. Wer unsicher ist, welche Klasse zutrifft, nutzt den [Steuerklassen-Finder](/welche-steuerklasse-bin-ich).",
      ],
    },
    {
      h3: "Was die Lohnsteuer wirksam senkt",
      body: [
        "Ein beim Finanzamt eingetragener **Lohnsteuerfreibetrag** wirkt sofort im Monatsnetto, statt erst über die Erstattung im Folgejahr. Eintragen lassen sich hohe Werbungskosten — etwa eine große Entfernung zur Arbeit, die der [Pendlerpauschale-Rechner](/pendlerpauschale-rechner) beziffert —, außergewöhnliche Belastungen oder Unterhaltsleistungen. Welche Freibeträge es gibt, führt die Übersicht [Steuerfreibetrag 2026](/steuerfreibetrag-2026) auf.",
        "Steuerlich günstiger als eine reine Gehaltserhöhung sind oft Entgeltbestandteile mit eigener Begünstigung: die [betriebliche Altersvorsorge](/bav-rechner) mit 676 € steuerfrei und 338 € sozialabgabenfrei im Monat oder ein [Firmenwagen](/firmenwagenrechner) nach der 1-%-Regelung.",
      ],
    },
  ],
  source: "§ 32a EStG · § 38 ff. EStG · § 3 SolZG",
};

/* ── /steuerklassenwechsel-rechner ───────────────────────────────────── */

const SK_PAAR_A = 4500;
const SK_PAAR_B = 2000;

const steuerklassenwechsel: ToolContentConfig = {
  heading: "Steuerklassenwechsel 2026: 3/5, 4/4 oder Faktorverfahren",
  answer:
    "Ehepaare und eingetragene Lebenspartner können zwischen den Kombinationen 4/4, 3/5 und 4/4 mit Faktor wählen. Die Wahl ändert nicht die Jahressteuer, sondern nur deren Verteilung über das Jahr und zwischen den Partnern. Ein Wechsel ist mehrfach im Jahr möglich; maßgeblich für das Folgejahr ist der Stand zum 30. November.",
  facts: [
    { label: "Kombination bei ähnlichem Einkommen", value: "4 / 4" },
    { label: "Kombination bei großem Unterschied", value: "3 / 5" },
    { label: "Verursachungsgerecht", value: "4 / 4 mit Faktor" },
    { label: "Wechsel pro Jahr", value: "mehrfach möglich" },
    { label: "Stichtag für das Folgejahr", value: "30. November" },
    { label: "Wirkung auf die Jahressteuer", value: "keine" },
  ],
  steps: [
    {
      title: "Bruttoeinkommen beider Partner erfassen",
      text: "Maßgeblich ist das Verhältnis der Einkommen zueinander, nicht deren absolute Höhe.",
    },
    {
      title: "Kombinationen gegenüberstellen",
      text: "Für 4/4 und 3/5 wird jeweils das gemeinsame Monatsnetto berechnet und verglichen.",
    },
    {
      title: "Lohnersatzleistungen mitdenken",
      text: "Elterngeld, Arbeitslosengeld, Kranken- und Mutterschaftsgeld bemessen sich am Nettoentgelt — die Steuerklasse wirkt hier indirekt, aber erheblich.",
    },
    {
      title: "Wechsel beantragen",
      text: "Der Antrag geht gemeinsam an das Wohnsitzfinanzamt und gilt ab dem Folgemonat.",
    },
  ],
  table: {
    caption: "Beispiel: 4.500 € und 2.000 € Monatsbrutto im Vergleich (2026)",
    head: ["Kombination", "Netto Partner A", "Netto Partner B", "Gemeinsam / Monat"],
    rows: (() => {
      const v44a = netto(SK_PAAR_A, { steuerklasse: 4 }).nettoMonat;
      const v44b = netto(SK_PAAR_B, { steuerklasse: 4 }).nettoMonat;
      const v3 = netto(SK_PAAR_A, { steuerklasse: 3 }).nettoMonat;
      const v5 = netto(SK_PAAR_B, { steuerklasse: 5 }).nettoMonat;
      return [
        ["4 / 4", eur(v44a), eur(v44b), eur(v44a + v44b)],
        ["3 / 5", eur(v3), eur(v5), eur(v3 + v5)],
        [
          "Differenz",
          eur(v3 - v44a),
          eur(v5 - v44b),
          (v3 + v5 - (v44a + v44b) >= 0 ? "+" : "") + eur(v3 + v5 - (v44a + v44b)),
        ],
      ];
    })(),
    note: "Berechnet für Partner A mit 4.500 € und Partner B mit 2.000 € Monatsbrutto, kinderlos, ohne Kirchensteuer. Die Jahressteuer ist in beiden Varianten identisch — die Differenz betrifft ausschließlich den unterjährigen Abzug.",
  },
  sections: [
    {
      h3: "Wann sich 3/5 lohnt — und wann nicht",
      body: [
        "Die Kombination 3/5 bringt dann das höchste gemeinsame Monatsnetto, wenn ein Partner deutlich mehr verdient — als Faustregel ab etwa 60 zu 40. Der Preis ist eine hohe Belastung in Klasse 5 und in aller Regel eine **Nachzahlung** bei der Pflichtveranlagung, weil unterjährig zu wenig einbehalten wurde. Wer diese Nachzahlung nicht einkalkuliert, verliert den Liquiditätsvorteil im Folgejahr wieder.",
        "Bei annähernd gleichen Einkommen ist 4/4 die bessere Wahl. Wer die verursachungsgerechte Verteilung will, ohne auf den Splittingvorteil zu verzichten, wählt **4/4 mit Faktor**: Das Finanzamt ermittelt einen Faktor kleiner eins, der den Splittingvorteil bereits im Monatsabzug berücksichtigt.",
      ],
    },
    {
      h3: "Der wichtigste Nebeneffekt: Lohnersatzleistungen",
      body: [
        "Elterngeld, Arbeitslosengeld, Kranken- und Mutterschaftsgeld werden aus dem **Nettoentgelt** der Vormonate berechnet. Wer eine dieser Leistungen erwartet, sollte rechtzeitig in die günstigere Klasse wechseln — beim [Elterngeld](/elterngeld-rechner) ist der Bemessungszeitraum die zwölf Monate vor der Geburt, weshalb der Wechsel früh erfolgen muss.",
        "Dasselbe gilt vor absehbarer Arbeitslosigkeit ([Arbeitslosengeld-Rechner](/arbeitslosengeld-rechner)), vor längerer Krankheit ([Krankengeld-Rechner](/krankengeld-rechner)) und bei angekündigter [Kurzarbeit](/kurzarbeitergeld-rechner). Die Finanzverwaltung erkennt den Wechsel an, solange er nicht ausschließlich missbräuchlich unmittelbar vor Leistungsbeginn erfolgt.",
      ],
    },
    {
      h3: "Wechsel beantragen und Klasse prüfen",
      body: [
        "Der Wechsel wird gemeinsam beim Wohnsitzfinanzamt beantragt und ist mehrfach im Jahr möglich. Für die Wirkung im Folgejahr ist der Stand zum 30. November maßgeblich. Nach Heirat werden beide Partner automatisch in Klasse 4 eingestuft — jede andere Kombination ist ein aktiver Antrag.",
        "Welche Klasse überhaupt in Frage kommt, klärt der [Steuerklassen-Finder](/welche-steuerklasse-bin-ich); die Merkmale aller sechs Klassen stellt die [Steuerklassen-Übersicht](/steuerklassen) gegenüber. Die vollständige Abrechnung für ein einzelnes Gehalt liefert der [Brutto-Netto-Rechner](/).",
      ],
    },
  ],
  source: "§ 38b EStG · § 39 EStG · § 39f EStG",
};

/* ── registry ────────────────────────────────────────────────────────── */

/**
 * Route → long-form content block. Add an entry to give a page its section.
 * Split across four modules purely for file size; `tool-content-extra.ts`,
 * `tool-content-more.ts` and `tool-content-final.ts` hold the later batches and
 * are merged in here so there stays exactly one registry.
 */
export const TOOL_CONTENT: Record<string, ToolContentConfig> = {
  ...TOOL_CONTENT_EXTRA,
  ...TOOL_CONTENT_MORE,
  ...TOOL_CONTENT_FINAL,
  "/gehaltserhoehung-rechner": gehaltserhoehung,
  "/minijob-rechner": minijob,
  "/midijob-rechner": midijob,
  "/werkstudent-rechner": werkstudent,
  "/pendlerpauschale-rechner": pendlerpauschale,
  "/krankengeld-rechner": krankengeld,
  "/kurzarbeitergeld-rechner": kurzarbeitergeld,
  "/jahresgehalt-rechner": jahresgehalt,
  "/teilzeitrechner": teilzeit,
  "/lohnsteuerrechner": lohnsteuer,
  "/steuerklassenwechsel-rechner": steuerklassenwechsel,
};
