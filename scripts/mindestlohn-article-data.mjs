/**
 * Rewritten content for the "brutto-netto-rechner-2026-mindestlohn-2027"
 * article (Task 5). Shared by:
 *   - scripts/fix-mindestlohn-article.mjs  (applies it directly via MySQL —
 *     run this on the production server where localhost:3306 is the DB)
 *   - scripts/apply-mindestlohn-via-api.mjs (applies it through the running
 *     app's admin API — useful when the DB is only reachable by the app process)
 *
 * Clean, consistent, professional German. No editorial placeholders, no mixed
 * language, one language throughout. The FAQ is kept as structured data (not an
 * <h2> in the body) so the template renders a single FAQ block + FAQPage schema.
 */
export const SLUG = "brutto-netto-rechner-2026-mindestlohn-2027";
export const CANONICAL = `https://bruttonettocalculator.com/blog/${SLUG}`;

const BMAS =
  "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/Informationen-zum-Mindestlohn/informationen-zum-mindestlohn-deutsch.html";

export const HEADLINE = "Brutto-Netto-Rechner 2026: Mindestlohn 2027 und neue Beitragsgrenzen";
export const META_TITLE = "Brutto-Netto-Rechner 2026: Mindestlohn 2027";
export const META_DESCRIPTION =
  "Was bleibt 2026 vom Bruttogehalt? Mindestlohn 2027, Steuerklassen, Beitragsgrenzen und konkrete Netto-Beispiele verständlich erklärt.";
export const EXCERPT =
  "Mindestlohn 2026 (13,90 €) und 2027 (14,60 €), neue Beitragsbemessungsgrenzen und der Einfluss der Steuerklasse — verständlich erklärt, mit konkreten Brutto-Netto-Beispielen.";
export const FOCUS_KEYWORD = "brutto netto rechner 2026";
export const TAGS = "Mindestlohn 2027,Brutto Netto 2026,Steuerklassen,Beitragsbemessungsgrenze";
export const CATEGORY = "Ratgeber";
export const READ_TIME = "6 min read";

export const FAQS = [
  {
    question: "Wie hoch ist der Mindestlohn 2026 und 2027?",
    answer:
      "Der gesetzliche Mindestlohn beträgt seit dem 1. Januar 2026 13,90 € brutto pro Stunde. Zum 1. Januar 2027 steigt er auf 14,60 € brutto pro Stunde. Beide Werte wurden von der Mindestlohnkommission bereits verbindlich festgelegt.",
  },
  {
    question: "Was bleibt beim Mindestlohn netto übrig?",
    answer:
      "Bei einer Vollzeitstelle mit 40 Wochenstunden entspricht der Mindestlohn 2026 rund 2.409 € brutto im Monat. Dank des Grundfreibetrags von 12.348 € (2026, Ledige) fällt darauf nur wenig Lohnsteuer an; den größten Abzug bilden die Sozialversicherungsbeiträge. Wie viel exakt übrig bleibt, hängt von Steuerklasse, Kirchensteuer und Bundesland ab.",
  },
  {
    question: "Ist die Mindestlohnerhöhung 2027 schon beschlossen?",
    answer:
      "Ja. Die Erhöhung auf 14,60 € zum 1. Januar 2027 ist bereits formell beschlossen und nicht mehr nur in der Diskussion. Sie wurde gemeinsam mit dem Schritt für 2026 in einer Anpassungsverordnung festgelegt.",
  },
  {
    question: "Ab welchem Verdienst greift die Beitragsbemessungsgrenze?",
    answer:
      "2026 liegt die Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung bei 5.812,50 € im Monat, die der Renten- und Arbeitslosenversicherung bei 8.450 € im Monat. Oberhalb dieser Grenzen steigen die jeweiligen Beiträge nicht weiter an.",
  },
  {
    question: "Wie berechne ich mein Netto genau?",
    answer:
      "Am einfachsten mit dem Brutto-Netto-Rechner: Bruttogehalt eingeben, Steuerklasse, Bundesland und Steuerjahr wählen. Das Ergebnis zeigt Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und alle Sozialabgaben getrennt an.",
  },
];

export const CONTENT = `
<p><strong>Kurz erklärt:</strong> 2026 gilt in Deutschland ein gesetzlicher Mindestlohn von <strong>13,90 € pro Stunde</strong>, zum 1. Januar 2027 steigt er auf <strong>14,60 € pro Stunde</strong>. Zusätzlich ändern sich die Beitragsbemessungsgrenzen der Sozialversicherung. Mit unserem <a href="/">Brutto-Netto-Rechner</a> sehen Sie in Sekunden, wie viel von Ihrem Bruttogehalt 2026 und 2027 tatsächlich als Netto übrig bleibt.</p>

<h2>Was ändert sich 2026 und 2027?</h2>
<p>Für Arbeitnehmerinnen und Arbeitnehmer stehen in den beiden Jahren mehrere Änderungen an, die sich direkt auf das Nettogehalt auswirken:</p>
<ul>
  <li><strong>Mindestlohn:</strong> Anstieg auf 13,90 € (2026) und anschließend auf 14,60 € (2027) pro Stunde.</li>
  <li><strong>Grundfreibetrag:</strong> 2026 bleiben 12.348 € im Jahr für Ledige steuerfrei (24.696 € für zusammen veranlagte Ehepaare).</li>
  <li><strong>Beitragsbemessungsgrenzen:</strong> Die Grenzen der Sozialversicherung steigen, sodass höhere Einkommen anteilig etwas stärker belastet werden.</li>
</ul>
<p>Alle folgenden Berechnungen beruhen auf diesen offiziellen Werten für 2026 und den bereits festgelegten Werten für 2027.</p>

<h2>Mindestlohn 2026 und 2027</h2>
<p>Der gesetzliche Mindestlohn steigt in zwei Stufen:</p>
<ul>
  <li><strong>Ab 1. Januar 2026:</strong> 13,90 € brutto pro Stunde.</li>
  <li><strong>Ab 1. Januar 2027:</strong> 14,60 € brutto pro Stunde.</li>
</ul>
<p>Beide Stufen sind bereits verbindlich beschlossen — die Erhöhung für 2027 ist also nicht mehr nur in der Diskussion, sondern formell festgelegt. Die offiziellen Informationen dazu veröffentlicht das Bundesministerium für Arbeit und Soziales unter <a href="${BMAS}" target="_blank" rel="noopener noreferrer">bmas.de – Informationen zum Mindestlohn</a>.</p>
<p>Bei einer Vollzeitstelle mit 40 Wochenstunden (rund 173 Stunden im Monat) ergibt der Mindestlohn 2026 etwa <strong>2.409 € brutto</strong> im Monat. Wie viel davon netto bleibt, können Sie im <a href="/mindestlohn">Mindestlohn-Rechner</a> nachvollziehen. Wer geringfügig beschäftigt ist, prüft die Verdienstgrenze am besten mit dem <a href="/minijob-rechner">Minijob-Rechner</a>.</p>

<h2>Beitragsbemessungsgrenzen</h2>
<p>Die Beitragsbemessungsgrenze legt fest, bis zu welchem Bruttolohn Sozialversicherungsbeiträge erhoben werden. Für 2026 gelten:</p>
<ul>
  <li><strong>Kranken- und Pflegeversicherung:</strong> 5.812,50 € im Monat (69.750 € im Jahr).</li>
  <li><strong>Renten- und Arbeitslosenversicherung:</strong> 8.450 € im Monat (101.400 € im Jahr).</li>
</ul>
<p>Verdienen Sie mehr als diese Grenzen, steigen die jeweiligen Beiträge nicht weiter an. Für hohe Einkommen bedeutet das: Der Anteil der Sozialabgaben am Bruttogehalt sinkt oberhalb der Grenzen, während für die Lohnsteuer weiterhin der progressive Tarif nach § 32a EStG gilt.</p>

<h2>Einfluss der Steuerklasse</h2>
<p>Die Steuerklasse bestimmt, wie viel Lohnsteuer monatlich einbehalten wird. An der tatsächlichen Jahressteuer ändert sie nichts, wohl aber am monatlichen Netto:</p>
<ul>
  <li><strong>Steuerklasse I</strong> gilt für Ledige.</li>
  <li><strong>Steuerklasse III/V</strong> nutzen Ehepaare mit unterschiedlich hohen Einkommen.</li>
  <li><strong>Steuerklasse IV (mit Faktor)</strong> verteilt die Last gleichmäßiger.</li>
  <li><strong>Steuerklasse VI</strong> gilt für einen Zweitjob und führt zu den höchsten Abzügen.</li>
</ul>
<p>Einen ausführlichen Überblick über alle sechs Klassen finden Sie auf der Seite <a href="/steuerklassen">Steuerklassen im Vergleich</a>. Ehepaare können mit dem Wechsel der Kombination oft mehr monatliches Netto erreichen.</p>

<h2>Konkrete Brutto-Netto-Beispiele</h2>
<p>Die folgende Übersicht zeigt gängige Bruttogehälter und das ungefähre monatliche Netto in Steuerklasse I (ledig, ohne Kirchensteuer, Steuerjahr 2026). Es handelt sich um Näherungswerte — Ihr genaues Ergebnis berechnen Sie mit dem <a href="/rechner/brutto-zu-netto">Brutto-zu-Netto-Rechner</a>.</p>
<table>
  <thead>
    <tr><th>Brutto / Monat</th><th>ca. Netto (Steuerklasse I)</th><th>Detailseite</th></tr>
  </thead>
  <tbody>
    <tr><td>2.000 €</td><td>ca. 1.483 €</td><td><a href="/rechner/2000-euro-brutto-netto">2.000 € Brutto Netto</a></td></tr>
    <tr><td>2.500 €</td><td>ca. 1.777 €</td><td><a href="/rechner/2500-euro-brutto-netto">2.500 € Brutto Netto</a></td></tr>
    <tr><td>3.000 €</td><td>ca. 2.065 €</td><td><a href="/rechner/3000-euro-brutto-netto">3.000 € Brutto Netto</a></td></tr>
    <tr><td>4.000 €</td><td>ca. 2.610 €</td><td><a href="/rechner/4000-euro-brutto-netto">4.000 € Brutto Netto</a></td></tr>
    <tr><td>5.000 €</td><td>ca. 3.130 €</td><td><a href="/rechner/5000-euro-brutto-netto">5.000 € Brutto Netto</a></td></tr>
  </tbody>
</table>
<p>Wer aus einem gewünschten Nettobetrag das nötige Brutto ableiten möchte — etwa für Gehaltsverhandlungen — nutzt den <a href="/rechner/netto-zu-brutto">Netto-zu-Brutto-Rechner</a>.</p>

<h2>Sonderfälle</h2>
<p>Einige Situationen weichen von der Standardberechnung ab:</p>
<ul>
  <li><strong>Minijob:</strong> Bis zur Verdienstgrenze bleibt der Lohn für Beschäftigte in der Regel abgabenfrei; nur ein geringer Rentenversicherungsbeitrag ist möglich.</li>
  <li><strong>Kirchensteuer:</strong> Sie beträgt je nach Bundesland 8 % oder 9 % der Lohnsteuer und mindert das Netto entsprechend.</li>
  <li><strong>Sachsen:</strong> Bei der Pflegeversicherung tragen Beschäftigte hier einen um 0,5 Prozentpunkte höheren Eigenanteil.</li>
  <li><strong>Kinderlosenzuschlag:</strong> Kinderlose ab 23 Jahren zahlen einen Zuschlag zur Pflegeversicherung.</li>
</ul>

<h2>Fazit</h2>
<p>2026 und 2027 bringen einen höheren Mindestlohn (13,90 € bzw. 14,60 € pro Stunde) und angepasste Beitragsbemessungsgrenzen. Wie viel davon netto ankommt, hängt vor allem von Steuerklasse, Kirchensteuer und Bundesland ab. Die verlässlichste Antwort liefert eine individuelle Berechnung: Geben Sie Ihr Bruttogehalt in den <a href="/">Brutto-Netto-Rechner</a> ein und vergleichen Sie die Steuerjahre 2026 und 2027 direkt miteinander. Dieser Ratgeber ersetzt keine Steuerberatung.</p>
`.trim();
