import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "arbeitslosengeld-hoehe-dauer",
  headline: "Arbeitslosengeld I 2026: Höhe, Dauer und wie das Amt wirklich rechnet",
  metaTitle: "Arbeitslosengeld I 2026: Höhe & Dauer berechnen",
  metaDescription:
    "ALG I: 60 % (mit Kind 67 %) vom Leistungsentgelt — nicht vom Brutto. Wie die Agentur rechnet, wie lange gezahlt wird und warum die Steuerklasse alles verschiebt.",
  excerpt:
    "60 Prozent klingt eindeutig — gemeint ist aber nicht das Bruttogehalt, sondern ein eigens berechnetes Leistungsentgelt. Wie die Agentur für Arbeit tatsächlich rechnet, wie lange gezahlt wird und welcher Fehler Betroffene Tausende kostet.",
  focusKeyword: "wie hoch arbeitslosengeld 1",
  secondaryKeywords: [
    "arbeitslosengeld 1 höhe 2026",
    "wie berechnet man arbeitslosengeld",
    "wie lange arbeitslosengeld 1",
    "arbeitslosengeld 60 oder 67 prozent",
    "wie lange arbeitslosengeld mit 58",
    "leistungsentgelt arbeitslosengeld",
  ],
  category: "Sozialversicherung",
  tags: ["Arbeitslosengeld", "ALG I", "Lohnersatzleistung", "Steuerklasse", "Progressionsvorbehalt"],
  publishedISO: "2026-08-22",
  updatedISO: "2026-08-22",
  answer:
    "Das Arbeitslosengeld I beträgt 60 % des Leistungsentgelts, mit mindestens einem Kind 67 %. Das Leistungsentgelt ist nicht das Bruttogehalt: Von den letzten zwölf Monaten Bruttoverdienst zieht die Agentur pauschal 20 % Sozialversicherung sowie Lohnsteuer und Soli nach Ihrer Steuerklasse ab. Erst auf diesen Rest werden die 60 bzw. 67 % angewendet. Die Bezugsdauer reicht von 6 Monaten bis zu 24 Monaten ab dem 58. Lebensjahr.",
  keyFacts: [
    { label: "Leistungssatz ohne Kind", value: "60 % des Leistungsentgelts" },
    { label: "Leistungssatz mit Kind", value: "67 %" },
    { label: "Bemessungszeitraum", value: "letzte 12 Monate" },
    { label: "Pauschaler SV-Abzug", value: "20 % vom Bemessungsentgelt" },
    { label: "Anwartschaft", value: "12 Monate in den letzten 30" },
    { label: "Bezugsdauer", value: "6 bis 24 Monate" },
  ],
  content: `
<p>"60 Prozent vom letzten Gehalt" — so wird das Arbeitslosengeld fast überall beschrieben, und fast überall ist es damit falsch dargestellt. Die 60 % beziehen sich weder auf das Brutto noch auf das Netto, sondern auf eine dritte Größe, die es nur im Sozialrecht gibt. Wer das nicht weiß, verschätzt sich regelmäßig um mehrere hundert Euro im Monat.</p>

<h2>Wie die Agentur für Arbeit rechnet</h2>
<p>Die Berechnung läuft in drei Schritten (§§ 149 ff. SGB III):</p>

<table>
  <thead>
    <tr><th>Schritt</th><th>Was passiert</th></tr>
  </thead>
  <tbody>
    <tr><td>1. Bemessungsentgelt</td><td>Beitragspflichtiges Bruttoentgelt der letzten 12 Monate, geteilt durch 365 → Tagesentgelt</td></tr>
    <tr><td>2. Leistungsentgelt</td><td>Davon ab: pauschal <strong>20 % Sozialversicherung</strong>, dazu Lohnsteuer und Soli nach Ihrer Steuerklasse</td></tr>
    <tr><td>3. Leistungssatz</td><td><strong>60 %</strong> des Leistungsentgelts — mit mindestens einem Kind <strong>67 %</strong></td></tr>
  </tbody>
</table>

<p>Zwei Dinge sind daran wichtig. Erstens: Der Sozialversicherungsabzug ist eine <strong>Pauschale von 20 %</strong>, nicht Ihr tatsächlicher Beitrag von rund 21,8 %. Zweitens: Die Lohnsteuer wird nach der Steuerklasse abgezogen, die am <strong>1. Januar des Jahres</strong> galt, in dem der Anspruch entsteht. Nicht nach der aktuellen.</p>

<h2>Die Steuerklasse ist der größte Hebel — und die häufigste Falle</h2>
<p>Weil im Schritt 2 die Lohnsteuer nach Steuerklasse abgezogen wird, verändert die Klasse das Ergebnis erheblich. Bei gleichem Bruttogehalt fällt das ALG in Steuerklasse III deutlich höher aus als in Steuerklasse V — der Unterschied kann dreistellig pro Monat sein.</p>

<p><strong>Der entscheidende Punkt, den kaum jemand rechtzeitig erfährt:</strong> Maßgeblich ist die Steuerklasse zu <em>Jahresbeginn</em>. Wer im Herbst mit einer Kündigung rechnet und erst dann in Klasse III wechselt, ändert für das laufende Jahr nichts mehr am ALG. Der Wechsel muss vor dem 1. Januar des Anspruchsjahres wirksam sein.</p>

<p>Ein Wechsel allein zur ALG-Optimierung ist zulässig — die Agentur prüft nicht die Motive. Sie prüft nur, welche Klasse eingetragen war. Welche Kombination für Sie günstiger ist, vergleicht der <a href="/steuerklassenwechsel-rechner">Steuerklassenwechsel-Rechner</a>; die Wirkung auf das ALG selbst schätzt der <a href="/arbeitslosengeld-rechner">Arbeitslosengeld-Rechner</a> ab.</p>

<h2>Wie lange wird gezahlt?</h2>
<p>Die Bezugsdauer hängt von zwei Dingen ab: wie lange Sie versichert waren und wie alt Sie sind (§ 147 SGB III).</p>

<table>
  <thead>
    <tr><th>Versicherungspflichtzeit in den letzten 5 Jahren</th><th>Alter</th><th>Anspruchsdauer</th></tr>
  </thead>
  <tbody>
    <tr><td>12 Monate</td><td>—</td><td>6 Monate</td></tr>
    <tr><td>16 Monate</td><td>—</td><td>8 Monate</td></tr>
    <tr><td>20 Monate</td><td>—</td><td>10 Monate</td></tr>
    <tr><td>24 Monate</td><td>—</td><td>12 Monate</td></tr>
    <tr><td>30 Monate</td><td>ab 50</td><td>15 Monate</td></tr>
    <tr><td>36 Monate</td><td>ab 55</td><td>18 Monate</td></tr>
    <tr><td>48 Monate</td><td>ab 58</td><td>24 Monate</td></tr>
  </tbody>
</table>

<p>Die Altersgrenzen greifen mit dem Geburtstag: Wer bei Entstehung des Anspruchs 57 ist, bekommt maximal 18 Monate — auch wenn er zwei Wochen später 58 wird. Bei einem absehbaren Ende des Arbeitsverhältnisses kann das ein Grund sein, über den Beendigungszeitpunkt zu verhandeln.</p>

<h2>Voraussetzungen für den Anspruch</h2>
<ul>
  <li><strong>Anwartschaftszeit:</strong> mindestens 12 Monate versicherungspflichtige Beschäftigung in den letzten 30 Monaten.</li>
  <li><strong>Arbeitslosmeldung:</strong> persönlich bei der Agentur für Arbeit.</li>
  <li><strong>Verfügbarkeit:</strong> Sie können und wollen mindestens 15 Stunden pro Woche arbeiten.</li>
  <li><strong>Arbeitsuchendmeldung:</strong> spätestens <strong>drei Monate vor</strong> dem Ende des Arbeitsverhältnisses — bei kürzerer Kündigungsfrist innerhalb von drei Tagen nach Kenntnis. Versäumnis führt zu einer Sperrzeit von einer Woche.</li>
</ul>

<h2>Sperrzeiten: wann das Geld später kommt</h2>
<p>Eine Sperrzeit verschiebt nicht nur den Beginn, sie <strong>verkürzt auch den Gesamtanspruch</strong> — bei zwölf Wochen Sperrzeit um mindestens ein Viertel der Anspruchsdauer.</p>

<table>
  <thead>
    <tr><th>Anlass</th><th>Sperrzeit</th></tr>
  </thead>
  <tbody>
    <tr><td>Eigenkündigung ohne wichtigen Grund</td><td>12 Wochen</td></tr>
    <tr><td>Aufhebungsvertrag ohne wichtigen Grund</td><td>12 Wochen</td></tr>
    <tr><td>Ablehnung einer zumutbaren Arbeit</td><td>3 bis 12 Wochen</td></tr>
    <tr><td>Verspätete Arbeitsuchendmeldung</td><td>1 Woche</td></tr>
  </tbody>
</table>

<p>Bei einem Aufhebungsvertrag mit Abfindung kommt häufig noch ein <em>Ruhen</em> des Anspruchs hinzu, wenn die ordentliche Kündigungsfrist nicht eingehalten wurde. Wie die Abfindung selbst besteuert wird, rechnet der <a href="/abfindungsrechner">Abfindungsrechner</a> mit der Fünftelregelung durch.</p>

<h2>Steuern: ALG I ist steuerfrei — und erhöht trotzdem die Steuer</h2>
<p>Das ist der Punkt, der jedes Frühjahr für Nachzahlungsbescheide sorgt. Arbeitslosengeld ist <strong>steuerfrei</strong>, unterliegt aber dem <strong>Progressionsvorbehalt</strong> (§ 32b EStG): Es wird dem übrigen Einkommen fiktiv hinzugerechnet, um den Steuersatz zu bestimmen — und dieser höhere Satz gilt dann für Ihr tatsächlich steuerpflichtiges Einkommen.</p>

<p>Praktisch heißt das: Wer im selben Jahr einige Monate gearbeitet und einige Monate ALG bezogen hat, zahlt auf das Gehalt einen höheren Steuersatz, als es allein rechtfertigen würde. Eine Nachzahlung ist der Normalfall, nicht die Ausnahme.</p>

<p><strong>Wer mehr als 410 € Lohnersatzleistungen im Jahr bezogen hat, ist zur Abgabe einer Steuererklärung verpflichtet</strong> — das gilt für ALG I, Krankengeld, Elterngeld und Kurzarbeitergeld gleichermaßen. Details zu den Fristen im Beitrag zur <a href="/blog/steuererklaerung-pflicht-fristen">Steuererklärungspflicht</a>.</p>

<h2>Was daneben erlaubt ist</h2>
<ul>
  <li><strong>Nebenjob:</strong> unter 15 Stunden pro Woche zulässig. Anrechnungsfrei bleiben 165 € im Monat, darüber wird angerechnet.</li>
  <li><strong>Minijob:</strong> möglich, aber der Verdienst über 165 € mindert das ALG.</li>
  <li><strong>Ehrenamt:</strong> Aufwandsentschädigungen bleiben bis 200 € monatlich unberücksichtigt.</li>
  <li><strong>Krankenversicherung:</strong> läuft während des ALG-Bezugs weiter, die Agentur zahlt die Beiträge. Auch Renten- und Pflegeversicherung laufen weiter.</li>
</ul>

<h2>Drei Dinge, die den Betrag spürbar verändern</h2>
<ol>
  <li><strong>Steuerklasse vor dem Jahreswechsel prüfen.</strong> Der einzige Hebel mit dreistelliger Monatswirkung — und er wirkt nur, wenn er rechtzeitig gezogen wird.</li>
  <li><strong>Kindfreibetragszähler kontrollieren.</strong> Der Sprung von 60 auf 67 % setzt voraus, dass ein Kind erfasst ist. Fehlt der Eintrag, zahlt die Agentur den niedrigeren Satz.</li>
  <li><strong>Beendigungszeitpunkt verhandeln.</strong> Wenige Wochen können über eine Altersstufe und damit über sechs Monate zusätzlichen Anspruch entscheiden.</li>
</ol>
`,
  faqs: [
    {
      question: "Wie hoch ist das Arbeitslosengeld 1?",
      answer:
        "60 % des Leistungsentgelts, mit mindestens einem Kind 67 %. Das Leistungsentgelt ist das beitragspflichtige Brutto der letzten zwölf Monate abzüglich einer 20-%-Sozialversicherungspauschale sowie Lohnsteuer und Soli nach Ihrer Steuerklasse — nicht das Bruttogehalt selbst.",
    },
    {
      question: "Wie berechnet man das Arbeitslosengeld?",
      answer:
        "In drei Schritten: Zuerst wird aus dem beitragspflichtigen Brutto der letzten zwölf Monate ein Tagesentgelt gebildet. Davon werden pauschal 20 % Sozialversicherung sowie Lohnsteuer und Soli nach Steuerklasse abgezogen — das ergibt das Leistungsentgelt. Darauf werden 60 bzw. 67 % angewendet.",
    },
    {
      question: "Wie lange bekomme ich Arbeitslosengeld 1?",
      answer:
        "Zwischen 6 und 24 Monaten. Bei 12 Monaten Versicherungszeit sind es 6 Monate, bei 24 Monaten sind es 12. Ab 50 Jahren steigt die Höchstdauer stufenweise: 15 Monate ab 50, 18 Monate ab 55 und 24 Monate ab 58 — jeweils mit entsprechend längerer Versicherungszeit.",
    },
    {
      question: "Wie lange bekomme ich Arbeitslosengeld mit 58?",
      answer:
        "Bis zu 24 Monate, sofern in den letzten fünf Jahren mindestens 48 Monate Versicherungspflicht bestanden. Entscheidend ist das Alter bei Entstehung des Anspruchs — wer bei Ende des Arbeitsverhältnisses erst 57 ist, erhält maximal 18 Monate.",
    },
    {
      question: "Welche Steuerklasse ist beim Arbeitslosengeld am besten?",
      answer:
        "Steuerklasse III führt zum höchsten Leistungsentgelt und damit zum höchsten ALG. Maßgeblich ist allerdings die Steuerklasse, die am 1. Januar des Jahres eingetragen war, in dem der Anspruch entsteht — ein Wechsel im Herbst wirkt für dieses Jahr nicht mehr.",
    },
    {
      question: "Muss ich für Arbeitslosengeld Steuern zahlen?",
      answer:
        "Das Arbeitslosengeld selbst ist steuerfrei, unterliegt aber dem Progressionsvorbehalt: Es erhöht den Steuersatz auf Ihr übriges Einkommen. Ab 410 € Lohnersatzleistungen im Jahr besteht Pflicht zur Abgabe einer Steuererklärung, und eine Nachzahlung ist dabei der Regelfall.",
    },
  ],
  relatedCalculators: [
    "/arbeitslosengeld-rechner",
    "/steuerklassenwechsel-rechner",
    "/abfindungsrechner",
    "/buergergeld-rechner",
  ],
  sources: [
    { label: "§ 149 SGB III — Höhe des Arbeitslosengeldes", url: "https://www.gesetze-im-internet.de/sgb_3/__149.html" },
    { label: "§ 147 SGB III — Dauer des Anspruchs", url: "https://www.gesetze-im-internet.de/sgb_3/__147.html" },
    { label: "§ 32b EStG — Progressionsvorbehalt", url: "https://www.gesetze-im-internet.de/estg/__32b.html" },
  ],
};
