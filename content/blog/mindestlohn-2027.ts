import type { BlogPost } from "@/lib/blog";
import { calculateNetto, type Steuerjahr } from "@/lib/taxCalculator";

/*
 * Mindestlohn 2026 = 13,90 €, 2027 = 14,60 € (Fünfte Mindestlohnanpassungs-
 * verordnung, beschlossen). Monatslohn = Stundenlohn × Wochenstunden × 4,33.
 * Netto: Engine, Steuerklasse I, kinderlos, ohne Kirchensteuer. 2027 mit dem
 * Steuertarif des Regierungsentwurfs EStRefG 2027 und Sozialabgaben 2026
 * (vorläufig). Bis 603 € (2026) bzw. 633 € (2027) Minijob: netto = brutto
 * minus 3,6 % RV-Eigenanteil.
 */

const ML = { 2026: 13.9, 2027: 14.6 } as const;
const MINIJOB = { 2026: 603, 2027: 633 } as const;
const WOCHEN = 4.33;

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

function monat(jahr: Steuerjahr, stunden: number) {
  const brutto = Math.round(ML[jahr] * stunden * WOCHEN * 100) / 100;
  if (brutto <= MINIJOB[jahr]) return { brutto, netto: brutto * (1 - 0.036), art: "Minijob" };
  const r = calculateNetto({ bruttoMonat: brutto, jahr, steuerklasse: 1, verheiratet: false, kinderlosUeber23: true, kirche: false });
  return { brutto, netto: r.nettoMonat, art: brutto <= 2000 ? "Midijob" : "regulär" };
}

const STUNDEN = [10, 20, 30, 40];
const zeilen = STUNDEN.map((h) => {
  const a = monat(2026, h);
  const b = monat(2027, h);
  return { h, a, b };
});
const vollzeit = zeilen.find((z) => z.h === 40)!;

export const post: BlogPost = {
  slug: "mindestlohn-2027",
  headline: "Mindestlohn 2027: 14,60 € – so viel bleibt netto",
  metaTitle: "Mindestlohn 2027: 14,60 € – so viel bleibt netto",
  metaDescription:
    "Mindestlohn 2027: 14,60 € pro Stunde ab 1. Januar. Netto-Tabelle für 10 bis 40 Wochenstunden, Vergleich mit 13,90 € in 2026, Minijob- und Midijob-Grenzen.",
  excerpt:
    "Zum 1. Januar 2027 steigt der Mindestlohn auf 14,60 € brutto pro Stunde. Was das in Vollzeit, Teilzeit und im Minijob netto bedeutet, zeigt die Tabelle.",
  focusKeyword: "mindestlohn 2027",
  secondaryKeywords: [
    "mindestlohn 2027 netto",
    "mindestlohn 2027 minijob grenze",
    "mindestlohn 2027 deutschland",
    "mindestlohn 14,60",
    "mindestlohn 2027 brutto netto",
  ],
  category: "Job & Sonderfälle",
  tags: ["Mindestlohn", "Minijob", "Midijob", "Stundenlohn", "2027"],
  publishedISO: "2026-10-05",
  updatedISO: "2026-10-05",
  answer: `Der gesetzliche Mindestlohn steigt am 1. Januar 2027 von 13,90 € auf 14,60 € brutto pro Stunde, ein Plus von gut 5 %. In Vollzeit mit 40 Wochenstunden sind das ${eur(vollzeit.b.brutto)} brutto im Monat. In Steuerklasse I bleiben davon voraussichtlich rund ${eur(vollzeit.b.netto)} netto, ${eur(vollzeit.b.netto - vollzeit.a.netto)} mehr als 2026. Die Minijob-Grenze steigt mit dem Mindestlohn auf 633 €.`,
  keyFacts: [
    { label: "Mindestlohn 2027", value: "14,60 € pro Stunde" },
    { label: "Mindestlohn 2026", value: "13,90 € pro Stunde" },
    { label: "Vollzeit (40 Std.) brutto", value: `${eur(vollzeit.b.brutto)} / Monat` },
    { label: "Vollzeit netto (SK I, vorläufig)", value: `${eur(vollzeit.b.netto)} / Monat` },
    { label: "Minijob-Grenze 2027", value: "633 € / Monat" },
    { label: "Gilt ab", value: "1. Januar 2027" },
  ],
  content: `
<p>Der Mindestlohn steigt 2027 zum zweiten Mal in Folge deutlich. Die Mindestlohnkommission hatte im Juni 2025 zwei Stufen empfohlen, die Bundesregierung hat beide per Verordnung verbindlich gemacht: 13,90 € ab 2026 und 14,60 € ab 2027. Der Wert für 2027 ist damit beschlossen.</p>

<h2>Wie hoch ist der Mindestlohn 2027?</h2>
<p>Ab dem 1. Januar 2027 beträgt der gesetzliche Mindestlohn <strong>14,60 € brutto pro Stunde</strong>. Das sind 70 Cent oder 5,0 % mehr als 2026. Er gilt für fast alle Beschäftigten ab 18 Jahren, auch für Minijobber, Teilzeitkräfte und Rentner.</p>

<h2>Mindestlohn 2027 netto: Die Tabelle</h2>
<p>So viel bleibt bei Mindestlohn je nach Wochenstunden im Monat, Steuerklasse I, kinderlos, ohne Kirchensteuer:</p>
<table>
  <thead>
    <tr><th>Wochenstunden</th><th>Brutto 2026</th><th>Netto 2026</th><th>Brutto 2027</th><th>Netto 2027*</th></tr>
  </thead>
  <tbody>
    ${zeilen
      .map(
        (z) =>
          `<tr><td>${z.h} Std.</td><td>${eur(z.a.brutto)}</td><td>${eur(z.a.netto)} (${z.a.art})</td><td>${eur(z.b.brutto)}</td><td>${eur(z.b.netto)} (${z.b.art})</td></tr>`,
      )
      .join("\n    ")}
  </tbody>
</table>
<p>* Vorläufig: Lohnsteuer 2027 nach dem Regierungsentwurf zur Steuerreform 2027, Sozialabgaben mit den Werten 2026. Monatslohn = Stundenlohn × Wochenstunden × 4,33. Minijob mit 3,6 % Rentenversicherungs-Eigenanteil. Gerechnet mit derselben Engine wie der <a href="/">Brutto-Netto-Rechner</a>.</p>

<p>Auffällig: Bei 10 Wochenstunden bleibt der Verdienst auch 2027 ein Minijob, weil die Minijob-Grenze mitwächst. Mit 20 und 30 Stunden liegen Sie im Midijob mit reduzierten Sozialabgaben. In Vollzeit zahlen Sie volle Abgaben, aber dank Grundfreibetrag nur wenig Lohnsteuer.</p>

<h2>Wie viel mehr ist das als 2026?</h2>
<p>In Vollzeit steigt der Bruttolohn um ${eur(vollzeit.b.brutto - vollzeit.a.brutto)} im Monat. Netto kommen davon voraussichtlich ${eur(vollzeit.b.netto - vollzeit.a.netto)} an. Ein kleiner Teil des Netto-Plus stammt aus der Steuerreform 2027 (höherer Grundfreibetrag, höherer Arbeitnehmer-Pauschbetrag), der Großteil aus dem höheren Stundenlohn. Wie sich die Reform für jedes Gehalt auswirkt, zeigt der <a href="/brutto-netto-rechner-2027">Steuerreform-Rechner 2027</a>.</p>

<h2>Mindestlohn 2027 und Minijob-Grenze</h2>
<p>Die Minijob-Grenze ist an den Mindestlohn gekoppelt: Mindestlohn × 130 ÷ 3, aufgerundet. 2027 sind das <strong>633 €</strong> im Monat statt 603 €. Wer Mindestlohn verdient, kann so weiterhin rund 43 Stunden im Monat im Minijob arbeiten. Alle Änderungen für Minijobs, auch die höheren Arbeitgeberabgaben, stehen im Beitrag <a href="/blog/minijob-2027">Minijob 2027</a>.</p>

<h2>Für wen gilt der Mindestlohn nicht?</h2>
<p>Das Mindestlohngesetz nimmt einige Gruppen aus (§ 22 MiLoG):</p>
<ul>
  <li>Jugendliche unter 18 Jahren ohne abgeschlossene Berufsausbildung</li>
  <li>Auszubildende; für sie gilt die Mindestausbildungsvergütung nach dem Berufsbildungsgesetz</li>
  <li>Pflichtpraktika und freiwillige Orientierungspraktika bis drei Monate</li>
  <li>Langzeitarbeitslose in den ersten sechs Monaten einer neuen Beschäftigung</li>
  <li>Ehrenamtlich Tätige</li>
</ul>
<p>In einigen Branchen liegen tarifliche Branchenmindestlöhne über dem gesetzlichen Mindestlohn, etwa in der Pflege.</p>

<h2>Wie geht es nach 2027 weiter?</h2>
<p>Über die nächste Anpassung ab 2028 entscheidet wieder die Mindestlohnkommission. Ihr nächster Beschluss wird bis Mitte 2027 erwartet. Bis dahin gibt es keinen beschlossenen Wert für 2028; Prognosen dazu sind Spekulation.</p>

<h2>Ihren Lohn selbst berechnen</h2>
<p>Den Monatslohn aus einem Stundenlohn und umgekehrt rechnet der <a href="/stundenlohn-rechner">Stundenlohn-Rechner</a> mit Mindestlohn-Check. Für Teilzeitjobs zwischen 633 € und 2.000 € zeigt der <a href="/midijob-rechner">Midijob-Rechner</a> die reduzierten Abgaben, und der <a href="/mindestlohn">Mindestlohn-Rechner</a> rechnet Ihren Mindestlohn für 2026 und 2027 mit allen Steuerklassen.</p>

<p><em>Stand: 5. Oktober 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.</em></p>
`,
  faqs: [
    {
      question: "Wie hoch ist der Mindestlohn 2027?",
      answer: "14,60 € brutto pro Stunde ab dem 1. Januar 2027. Das sind 70 Cent mehr als 2026 (13,90 €). Der Wert ist per Verordnung beschlossen.",
    },
    {
      question: "Wie viel ist der Mindestlohn 2027 netto?",
      answer: `In Vollzeit mit 40 Wochenstunden sind es ${eur(vollzeit.b.brutto)} brutto im Monat. In Steuerklasse I, kinderlos und ohne Kirchensteuer bleiben voraussichtlich rund ${eur(vollzeit.b.netto)} netto. Der Wert ist vorläufig, weil die Steuerreform 2027 noch nicht beschlossen ist.`,
    },
    {
      question: "Wie hoch ist die Minijob-Grenze mit dem Mindestlohn 2027?",
      answer: "633 € im Monat und 7.596 € im Jahr. Sie berechnet sich als Mindestlohn × 130 ÷ 3, aufgerundet auf volle Euro.",
    },
    {
      question: "Was verdient man im Monat mit Mindestlohn 2027?",
      answer: `Bei 40 Wochenstunden ${eur(vollzeit.b.brutto)} brutto, bei 30 Stunden ${eur(zeilen[2].b.brutto)}, bei 20 Stunden ${eur(zeilen[1].b.brutto)} (Wochenstunden × 4,33 × 14,60 €).`,
    },
    {
      question: "Gilt der Mindestlohn 2027 auch für Minijobber und Rentner?",
      answer: "Ja. Der Mindestlohn gilt unabhängig vom Umfang der Beschäftigung, also auch im Minijob, in Teilzeit und für Rentner. Ausnahmen gibt es etwa für Jugendliche unter 18 ohne Berufsabschluss, Auszubildende und bestimmte Praktika.",
    },
  ],
  relatedCalculators: ["/mindestlohn", "/stundenlohn-rechner", "/midijob-rechner", "/minijob-rechner"],
  sources: [
    { label: "BMAS — Mindestlohn", url: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html" },
    { label: "§ 22 MiLoG — Persönlicher Anwendungsbereich", url: "https://www.gesetze-im-internet.de/milog/__22.html" },
    { label: "§ 8 SGB IV — Geringfügige Beschäftigung", url: "https://www.gesetze-im-internet.de/sgb_4/__8.html" },
    { label: "BT-Drucksache 21/8235 — Regierungsentwurf EStRefG 2027", url: "https://dserver.bundestag.de/btd/21/082/2108235.pdf" },
  ],
};
