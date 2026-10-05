import type { BlogPost } from "@/lib/blog";
import { calculateNetto } from "@/lib/taxCalculator";

/*
 * Stand 05.10.2026. Status der Vorhaben laut Minijob-Zentrale ("Rund um Minijobs:
 * Chronologie der aktuellen Vorhaben", Stand 01.10.2026):
 *  - KV-Pauschale 14,6 % + Ø-Zusatzbeitrag: beschlossen (GKV-Beitragssatz-
 *    stabilisierungsgesetz, BGBl. 29.07.2026), ab 1.1.2027
 *  - Pauschsteuer 2 % → 5 %: Regierungsentwurf EStRefG 2027 (02.09.2026)
 *  - PV-Pauschale 3,6 % (gewerblich) ab 1.1.2028: Regierungsentwurf
 *    Pflegeneuordnungsgesetz (30.09.2026)
 *  - Abschaffung des Sonderstatus: Empfehlung der Alterssicherungskommission (23.06.2026)
 * Midijob-Netto 2027 rechnet die Engine (Übergangsbereich 633,01–2.000 €).
 */

const GRENZE_2026 = 603;
const GRENZE_2027 = 633;
const ML_2026 = 13.9;
const ML_2027 = 14.6;
const RV_EIGEN = 0.036;
const AG_2026 = { kv: 0.13, rv: 0.15, st: 0.02 };
const AG_2027 = { kv: 0.175, rv: 0.15, st: 0.05 };

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const std = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

const stundenZeilen = [14.6, 15, 16, 18, 20, 25]
  .map((lohn) => `<tr><td>${eur(lohn)}</td><td>${std(GRENZE_2027 / lohn)} Std.</td><td>${std(GRENZE_2027 / lohn / 4.33)} Std.</td></tr>`)
  .join("\n    ");

const agKosten = (brutto: number, s: typeof AG_2026) => brutto * (s.kv + s.rv + s.st);
const ag2026 = agKosten(GRENZE_2026, AG_2026);
const ag2027 = agKosten(GRENZE_2027, AG_2027);

const netto2027 = (brutto: number) =>
  calculateNetto({ bruttoMonat: brutto, jahr: 2027, steuerklasse: 1, verheiratet: false, kinderlosUeber23: true, kirche: false }).nettoMonat;
const minijobNetto = GRENZE_2027 * (1 - RV_EIGEN);
const midiZeilen = [700, 800, 1000, 1200]
  .map((b) => `<tr><td>${eur(b)}</td><td>Midijob</td><td>${eur(netto2027(b))}</td><td>${eur(netto2027(b) - minijobNetto)}</td></tr>`)
  .join("\n    ");

export const post: BlogPost = {
  slug: "minijob-2027",
  headline: "Minijob 2027: 633-€-Grenze, 5 % Pauschsteuer & alle Änderungen",
  metaTitle: "Minijob Grenze 2027: 633 € und neue Abgaben",
  metaDescription:
    "Minijob 2027: Grenze 633 €, rund 43 Stunden bei Mindestlohn. Was höhere KV-Pauschale, geplante 5 % Pauschsteuer und die Abschaffungsdebatte bedeuten.",
  excerpt:
    "Ab Januar 2027 dürfen Minijobber 633 € im Monat verdienen. Für Beschäftigte ändert sich am Netto kaum etwas, für Arbeitgeber wird der Minijob deutlich teurer. Alle Werte, Stunden und Vorhaben im Überblick.",
  focusKeyword: "minijob grenze 2027",
  secondaryKeywords: [
    "minijob 2027",
    "minijob 633 euro",
    "minijob stunden 2027",
    "minijob rentner",
    "minijob abschaffung",
    "minijob pauschsteuer 5 prozent",
  ],
  category: "Job & Sonderfälle",
  tags: ["Minijob", "Mindestlohn", "Midijob", "Verdienstgrenze", "2027"],
  publishedISO: "2026-10-05",
  updatedISO: "2026-10-05",
  answer:
    "Die Minijob-Grenze steigt am 1. Januar 2027 von 603 € auf 633 € im Monat, also 7.596 € im Jahr. Grund ist der Mindestlohn von 14,60 €. Damit sind weiterhin rund 43 Arbeitsstunden im Monat möglich. Für Minijobber bleibt das Netto gleich, für Arbeitgeber steigen die Abgaben: Die Krankenversicherungspauschale wächst von 13 % auf voraussichtlich 17,5 %, die Pauschsteuer soll von 2 % auf 5 % steigen.",
  keyFacts: [
    { label: "Minijob-Grenze 2027", value: "633 € / Monat · 7.596 € / Jahr" },
    { label: "Mindestlohn 2027", value: "14,60 € pro Stunde" },
    { label: "Stunden bei Mindestlohn", value: `ca. ${std(GRENZE_2027 / ML_2027)} pro Monat` },
    { label: "KV-Pauschale Arbeitgeber", value: "13 % → ca. 17,5 % (beschlossen)" },
    { label: "Pauschsteuer", value: "2 % → 5 % (Gesetzentwurf)" },
    { label: "Midijob ab", value: "633,01 €" },
  ],
  content: `
<p>Der Minijob bleibt 2027 erhalten, wird aber für Arbeitgeber teurer. Drei Dinge ändern sich zum 1. Januar: die Verdienstgrenze, die Pauschalbeiträge und voraussichtlich die Pauschsteuer. Ob und wann der Sonderstatus ganz wegfällt, ist dagegen offen. Für die Werte des laufenden Jahres siehe <a href="/blog/minijob-grenze-2026">Minijob-Grenze 2026</a>.</p>

<h2>Wie hoch ist die Minijob-Grenze 2027?</h2>
<p>Die Grenze ist seit 2022 an den Mindestlohn gekoppelt: Mindestlohn × 130 ÷ 3, aufgerundet auf volle Euro (§ 8 Abs. 1a SGB IV). Mit 14,60 € ergibt das 632,67 €, aufgerundet <strong>633 €</strong>. Der Wert steht fest, weil der Mindestlohn 2027 bereits per Verordnung beschlossen ist.</p>
<table>
  <thead>
    <tr><th>Wert</th><th>2026</th><th>2027</th></tr>
  </thead>
  <tbody>
    <tr><td>Mindestlohn pro Stunde</td><td>${eur(ML_2026)}</td><td>${eur(ML_2027)}</td></tr>
    <tr><td>Minijob-Grenze pro Monat</td><td>${eur(GRENZE_2026)}</td><td>${eur(GRENZE_2027)}</td></tr>
    <tr><td>Minijob-Grenze pro Jahr</td><td>${eur(GRENZE_2026 * 12)}</td><td>${eur(GRENZE_2027 * 12)}</td></tr>
    <tr><td>Stunden im Monat bei Mindestlohn</td><td>${std(GRENZE_2026 / ML_2026)}</td><td>${std(GRENZE_2027 / ML_2027)}</td></tr>
    <tr><td>Gelegentliches Überschreiten bis</td><td>${eur(GRENZE_2026 * 2)}</td><td>${eur(GRENZE_2027 * 2)}</td></tr>
    <tr><td>Midijob (Übergangsbereich)</td><td>603,01 € – 2.000 €</td><td>633,01 € – 2.000 €</td></tr>
  </tbody>
</table>

<h2>Wie viele Stunden darf ich 2027 im Minijob arbeiten?</h2>
<p>Bei Mindestlohn sind es 633 € ÷ 14,60 € = rund <strong>43 Stunden im Monat</strong>, also etwa 10 Stunden pro Woche. Das ist dieselbe Stundenzahl wie 2026, denn genau dafür wurde die Grenze an den Mindestlohn gekoppelt. Wer mehr als den Mindestlohn verdient, darf entsprechend weniger arbeiten:</p>
<table>
  <thead>
    <tr><th>Stundenlohn</th><th>Max. Stunden pro Monat</th><th>Max. Stunden pro Woche</th></tr>
  </thead>
  <tbody>
    ${stundenZeilen}
  </tbody>
</table>
<p>Wochenwerte mit durchschnittlich 4,33 Wochen pro Monat. Ihren eigenen Verdienst prüfen Sie mit dem <a href="/minijob-rechner">Minijob-Rechner</a>, den Stundenlohn mit dem <a href="/stundenlohn-rechner">Stundenlohn-Rechner</a>.</p>

<h2>Was ändert sich für Arbeitgeber?</h2>
<p>Minijobs werden 2027 für Arbeitgeber spürbar teurer. Der Stand der einzelnen Vorhaben laut Minijob-Zentrale (1. Oktober 2026):</p>
<ul>
  <li><strong>Krankenversicherung, beschlossen:</strong> Der Pauschalbeitrag steigt von 13 % auf den allgemeinen Beitragssatz von 14,6 % plus durchschnittlichen Zusatzbeitrag. Bleibt der Durchschnitt bei 2,9 %, sind das 17,5 %. Grundlage ist das GKV-Beitragssatzstabilisierungsgesetz, verkündet am 29. Juli 2026.</li>
  <li><strong>Pauschsteuer, geplant:</strong> Die einheitliche Pauschsteuer soll von 2 % auf 5 % steigen (§ 40a Abs. 2 EStG). Das steht im Regierungsentwurf des Einkommensteuerreformgesetzes 2027 vom 2. September 2026; Bundestag und Bundesrat müssen noch zustimmen.</li>
  <li><strong>Pflegeversicherung, geplant ab 2028:</strong> Ein Gesetzentwurf vom 30. September 2026 sieht ab 2028 eine Pauschale von 3,6 % für gewerbliche Minijobs vor.</li>
</ul>
<table>
  <thead>
    <tr><th>Pauschale (gewerblicher Minijob)</th><th>2026 bei 603 €</th><th>2027 bei 633 €</th></tr>
  </thead>
  <tbody>
    <tr><td>Krankenversicherung</td><td>13 % = ${eur(GRENZE_2026 * AG_2026.kv)}</td><td>17,5 % = ${eur(GRENZE_2027 * AG_2027.kv)}</td></tr>
    <tr><td>Rentenversicherung</td><td>15 % = ${eur(GRENZE_2026 * AG_2026.rv)}</td><td>15 % = ${eur(GRENZE_2027 * AG_2027.rv)}</td></tr>
    <tr><td>Pauschsteuer</td><td>2 % = ${eur(GRENZE_2026 * AG_2026.st)}</td><td>5 % = ${eur(GRENZE_2027 * AG_2027.st)}</td></tr>
    <tr><td><strong>Summe</strong></td><td><strong>${eur(ag2026)}</strong></td><td><strong>${eur(ag2027)}</strong></td></tr>
  </tbody>
</table>
<p>Ohne Umlagen U1/U2, Insolvenzgeldumlage und Unfallversicherung. Die Werte für 2027 sind vorläufig: Der Satz der Krankenversicherung hängt am Ø-Zusatzbeitrag 2027, die Pauschsteuer am Gesetzgebungsverfahren. Pro Minijob an der Grenze steigen die Pauschalen damit um rund ${eur(ag2027 - ag2026)} im Monat.</p>

<h2>Was ändert sich für Minijobber?</h2>
<p>Am Netto fast nichts. Die Pauschalen trägt der Arbeitgeber. Minijobber zahlen weiterhin nur den Eigenanteil zur Rentenversicherung von 3,6 %, wenn sie sich nicht davon befreien lassen. Bei 633 € sind das ${eur(GRENZE_2027 * RV_EIGEN)}, es bleiben ${eur(minijobNetto)} netto. Wer sich befreien lässt, behält die vollen 633 €, verliert aber Ansprüche etwa auf Erwerbsminderungsrente und Reha-Leistungen.</p>
<p>Wichtig für alle, die 2026 knapp über der Grenze lagen: Mit 610 € oder 620 € im Monat waren Sie 2026 im Midijob. Ab 2027 ist dasselbe Entgelt ein Minijob, sofern Ihr Arbeitgeber Sie nicht anders anmeldet.</p>

<h2>Minijob oder Midijob: Was bleibt netto?</h2>
<p>Oberhalb von 633 € beginnt 2027 der Übergangsbereich. Dort zahlen Beschäftigte reduzierte Sozialabgaben, die bis 2.000 € auf den vollen Satz ansteigen. Netto 2027 in Steuerklasse I, kinderlos (vorläufige Werte):</p>
<table>
  <thead>
    <tr><th>Brutto</th><th>Art</th><th>Netto 2027</th><th>Mehr als Minijob (${eur(minijobNetto)})</th></tr>
  </thead>
  <tbody>
    <tr><td>${eur(GRENZE_2027)}</td><td>Minijob</td><td>${eur(minijobNetto)}</td><td>–</td></tr>
    ${midiZeilen}
  </tbody>
</table>
<p>Berechnet mit unserer Lohnsteuer-Engine (Steuertarif nach dem Regierungsentwurf 2027, Sozialabgaben nach § 20 SGB IV mit den Grenzen 2027). Im Midijob erwerben Sie volle Rentenansprüche und sind kranken- und pflegeversichert. Genauer rechnet der <a href="/midijob-rechner">Midijob-Rechner</a>.</p>

<h2>Minijob für Rentner</h2>
<p>Rentnerinnen und Rentner dürfen 2027 genauso 633 € im Monat im Minijob verdienen. Eine Hinzuverdienstgrenze für Altersrenten gibt es seit 2023 nicht mehr, auch nicht bei vorgezogenen Altersrenten. Wer die Regelaltersgrenze erreicht hat und eine volle Altersrente bezieht, zahlt keinen eigenen Rentenbeitrag; der Arbeitgeber zahlt seine Pauschale trotzdem. Wer neben der Rente mehr verdienen möchte, kann seit 2026 die Aktivrente nutzen: bis 2.000 € Arbeitslohn im Monat steuerfrei, allerdings nur in einer sozialversicherungspflichtigen Beschäftigung, nicht im Minijob. Mehr dazu im Beitrag <a href="/blog/aktivrente">Aktivrente</a>.</p>

<h2>Werden Minijobs abgeschafft?</h2>
<p>Nicht beschlossen. Die Alterssicherungskommission der Bundesregierung hat am 23. Juni 2026 empfohlen, die Befreiung von der Rentenversicherungspflicht zu beenden und den steuer- und sozialversicherungsrechtlichen Sonderstatus der Minijobs abzuschaffen; Ausnahmen soll es nur für Schülerinnen und Schüler geben. Das ist eine Empfehlung, kein Gesetzentwurf. Für 2027 gibt es keinen Entwurf, der Minijobs abschafft. Die beschlossenen und geplanten Änderungen betreffen die Abgaben, nicht den Minijob selbst.</p>

<h2>Grenze überschritten: Was dann?</h2>
<p>Maßgeblich ist das regelmäßige Entgelt im Jahr: 2027 höchstens 7.596 €. Ein unvorhersehbares Überschreiten ist in bis zu zwei Kalendermonaten innerhalb eines Zeitjahres erlaubt, solange der Verdienst im jeweiligen Monat höchstens doppelt so hoch ist wie die Grenze, 2027 also 1.266 € (§ 8 Abs. 1b SGB IV). Zugesichertes Weihnachts- oder Urlaubsgeld zählt mit, wie der <a href="/weihnachtsgeld-rechner">Weihnachtsgeld-Rechner</a> erklärt. Neben einer sozialversicherungspflichtigen Hauptbeschäftigung bleibt genau ein Minijob abgabenfrei.</p>

<p><em>Stand: 5. Oktober 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.</em></p>
`,
  faqs: [
    {
      question: "Wie hoch ist die Minijob-Grenze 2027?",
      answer:
        "633 € im Monat und 7.596 € im Jahr. Sie folgt aus dem Mindestlohn von 14,60 €: 14,60 € × 130 ÷ 3 = 632,67 €, aufgerundet 633 €. Der Wert ist beschlossen.",
    },
    {
      question: "Wie viele Stunden darf ich 2027 im Minijob arbeiten?",
      answer:
        "Bei Mindestlohn rund 43 Stunden im Monat, etwa 10 Stunden pro Woche. Bei 16 € Stundenlohn sind es rund 39,6 Stunden, bei 20 € rund 31,7 Stunden im Monat.",
    },
    {
      question: "Steigt die Pauschsteuer für Minijobs auf 5 %?",
      answer:
        "Das ist geplant. Der Regierungsentwurf des Einkommensteuerreformgesetzes 2027 hebt die Pauschsteuer von 2 % auf 5 % an. Bundestag und Bundesrat müssen noch zustimmen. Die Pauschsteuer zahlt in der Regel der Arbeitgeber.",
    },
    {
      question: "Was ändert sich beim Minijob 2027 für Arbeitgeber?",
      answer:
        "Der Krankenversicherungs-Pauschalbeitrag steigt beschlossen von 13 % auf 14,6 % plus Ø-Zusatzbeitrag (bei 2,9 %: 17,5 %), die Pauschsteuer soll von 2 % auf 5 % steigen. An der Grenze von 633 € summieren sich KV, RV und Pauschsteuer dann auf 237,38 € statt 180,90 € bei 603 € im Jahr 2026.",
    },
    {
      question: "Werden Minijobs 2027 abgeschafft?",
      answer:
        "Nein. Die Alterssicherungskommission hat im Juni 2026 empfohlen, den Sonderstatus abzuschaffen. Einen Gesetzentwurf dazu gibt es nicht. 2027 ändern sich nur Grenze und Abgaben.",
    },
    {
      question: "Dürfen Rentner 2027 einen Minijob haben?",
      answer:
        "Ja, mit derselben Grenze von 633 € im Monat. Für Altersrenten gibt es seit 2023 keine Hinzuverdienstgrenze mehr. Wer die Regelaltersgrenze erreicht hat und eine volle Altersrente bezieht, zahlt keinen eigenen Rentenbeitrag.",
    },
  ],
  relatedCalculators: ["/minijob-rechner", "/midijob-rechner", "/mindestlohn", "/stundenlohn-rechner"],
  sources: [
    { label: "Minijob-Zentrale — Chronologie der aktuellen Minijob-Vorhaben", url: "https://magazin.minijob-zentrale.de/aktuelle-minijob-vorhaben/" },
    { label: "Minijob-Zentrale — Empfehlung der Rentenkommission", url: "https://magazin.minijob-zentrale.de/empfehlung-der-rentenkommission-minijobs/" },
    { label: "§ 8 SGB IV — Geringfügige Beschäftigung", url: "https://www.gesetze-im-internet.de/sgb_4/__8.html" },
    { label: "§ 20 SGB IV — Übergangsbereich", url: "https://www.gesetze-im-internet.de/sgb_4/__20.html" },
    { label: "BT-Drucksache 21/8235 — Regierungsentwurf EStRefG 2027", url: "https://dserver.bundestag.de/btd/21/082/2108235.pdf" },
    { label: "BMAS — Mindestlohn", url: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html" },
  ],
};
