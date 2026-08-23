import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "mieteinnahmen-versteuern-afa",
  headline: "Mieteinnahmen versteuern: Warum die Steuer meist niedriger ausfällt als gedacht",
  metaTitle: "Mieteinnahmen versteuern: Steuer, AfA & Werbungskosten",
  metaDescription:
    "Auf Mieteinnahmen zahlen Sie nicht auf die Miete Steuer, sondern auf den Überschuss. Wie AfA und Werbungskosten ihn drücken — und wann ein Verlust die Lohnsteuer senkt.",
  excerpt:
    "12.000 € Miete im Jahr heißt nicht 12.000 € zu versteuern. Abschreibung, Zinsen und laufende Kosten senken den steuerpflichtigen Betrag oft auf einen Bruchteil — in den ersten Jahren sogar unter null.",
  focusKeyword: "mieteinnahmen versteuern",
  secondaryKeywords: [
    "steuer auf mieteinnahmen",
    "steuer bei mieteinnahmen",
    "mieteinnahmen steuer",
    "werbungskosten vermietung",
    "afa immobilie berechnen",
    "anlage v",
  ],
  category: "Freibeträge & Abzüge",
  tags: ["Vermietung", "Mieteinnahmen", "AfA", "Werbungskosten", "Anlage V"],
  publishedISO: "2026-08-23",
  updatedISO: "2026-08-23",
  answer:
    "Versteuert wird nicht die Miete, sondern der Überschuss: Mieteinnahmen minus Werbungskosten. Zu den Werbungskosten zählen vor allem die Gebäudeabschreibung (2 %, 2,5 % oder 3 % je nach Baujahr), Schuldzinsen, Grundsteuer und Instandhaltung. Der verbleibende Überschuss wird dem übrigen Einkommen zugerechnet und mit dem persönlichen Steuersatz belastet.",
  keyFacts: [
    { label: "Rechtsgrundlage", value: "§ 21 EStG" },
    { label: "AfA ab Baujahr 2023", value: "3,0 % pro Jahr" },
    { label: "AfA Baujahr 1925–2022", value: "2,0 % pro Jahr" },
    { label: "Eigener Freibetrag", value: "keiner" },
    { label: "Tilgung absetzbar?", value: "nein, nur die Zinsen" },
    { label: "Verluste", value: "senken die Steuer aufs Gehalt" },
  ],
  content: `
<p>Wer zum ersten Mal eine Wohnung vermietet, rechnet oft mit dem Schlimmsten: 12.000 € Jahresmiete, 40 % Steuersatz, also 4.800 € ans Finanzamt. Diese Rechnung ist falsch — und zwar deutlich. Versteuert wird nicht die Miete, sondern was nach Abzug aller Kosten davon übrig bleibt.</p>

<h2>Die Rechnung, die wirklich gilt</h2>
<p>Einkünfte aus Vermietung und Verpachtung ergeben sich nach § 21 EStG so:</p>

<p><strong>Mieteinnahmen − Werbungskosten = Einkünfte aus Vermietung</strong></p>

<p>Dieser Betrag — nicht die Miete — wird zu Ihrem übrigen Einkommen addiert und mit Ihrem persönlichen Steuersatz belastet. Einen gesonderten Steuersatz für Mieteinnahmen gibt es nicht, ebenso wenig einen eigenen Freibetrag.</p>

<h3>Ein realistisches Beispiel</h3>
<p>Eigentumswohnung, 300.000 € Kaufpreis, Baujahr 1998, 1.100 € Kaltmiete im Monat:</p>

<table>
  <thead>
    <tr><th>Position</th><th>Betrag pro Jahr</th></tr>
  </thead>
  <tbody>
    <tr><td>Mieteinnahmen (1.100 € × 12)</td><td>13.200 €</td></tr>
    <tr><td>− Abschreibung (2 % von 240.000 € Gebäudeanteil)</td><td>−4.800 €</td></tr>
    <tr><td>− Schuldzinsen</td><td>−3.500 €</td></tr>
    <tr><td>− Grundsteuer, Hausgeld, Instandhaltung</td><td>−2.000 €</td></tr>
    <tr><td><strong>Zu versteuernder Überschuss</strong></td><td><strong>2.900 €</strong></td></tr>
  </tbody>
</table>

<p>Statt 13.200 € sind also nur 2.900 € steuerpflichtig. Bei einem Grenzsteuersatz von rund 31 % bedeutet das etwa 900 € Steuer — nicht 4.800 €. Ihre eigenen Zahlen können Sie im <a href="/mieteinnahmen-versteuern">Rechner für Mieteinnahmen</a> durchspielen.</p>

<h2>Die Abschreibung ist der größte Posten</h2>
<p>Die AfA („Absetzung für Abnutzung“) ist meist der wirkungsvollste Abzug — und der, den Einsteiger am häufigsten falsch ansetzen. Drei Regeln sind entscheidend:</p>

<h3>1. Nur das Gebäude wird abgeschrieben</h3>
<p>Grund und Boden nutzt sich nicht ab und ist deshalb nicht abschreibbar. Vom Kaufpreis müssen Sie den Grundstücksanteil herausrechnen. Als grobe Orientierung werden oft 20 % angesetzt; in Ballungsräumen liegt der Anteil deutlich höher. Das Bundesfinanzministerium stellt eine offizielle Arbeitshilfe zur Kaufpreisaufteilung bereit. Steht im Kaufvertrag eine sachgerechte Aufteilung, erkennt das Finanzamt sie in der Regel an.</p>

<h3>2. Der Satz richtet sich nach dem Baujahr</h3>
<table>
  <thead>
    <tr><th>Fertigstellung</th><th>AfA-Satz</th><th>Dauer</th></tr>
  </thead>
  <tbody>
    <tr><td>ab 2023</td><td>3,0 %</td><td>33 Jahre</td></tr>
    <tr><td>1925 – 2022</td><td>2,0 %</td><td>50 Jahre</td></tr>
    <tr><td>vor 1925</td><td>2,5 %</td><td>40 Jahre</td></tr>
  </tbody>
</table>

<p>Maßgeblich ist das Jahr der <em>Fertigstellung</em> des Gebäudes, nicht Ihr Kaufjahr. Für neu gebaute Mietwohnungen mit Baubeginn zwischen dem 1.10.2023 und dem 30.9.2029 kommt zusätzlich eine degressive Abschreibung von 5 % in Betracht (§ 7 Abs. 5a EStG).</p>

<h3>3. Kaufnebenkosten zählen mit</h3>
<p>Grunderwerbsteuer, Notar- und Grundbuchkosten sowie Maklergebühren erhöhen die Bemessungsgrundlage — anteilig im selben Verhältnis wie der Kaufpreis auf Gebäude und Grundstück verteilt wird. Bei 300.000 € Kaufpreis kommen so schnell 25.000 € hinzu, von denen 80 % abschreibbar sind.</p>

<h2>Der teuerste Irrtum: Tilgung ist nicht absetzbar</h2>
<p>Absetzbar sind ausschließlich die <strong>Zinsen</strong> Ihres Darlehens, nicht der Tilgungsanteil. Die Tilgung ist steuerlich reine Vermögensumschichtung: Sie tauschen Bankschulden gegen Eigentum — kein Aufwand, also kein Abzug.</p>

<p>Praktisch heißt das: Prüfen Sie Ihren Tilgungsplan, nicht den Kontoauszug. Bei einer Annuität von 1.200 € im Monat können 300 € Zinsen und 900 € Tilgung stecken — in die Anlage V gehören nur die 300 €.</p>

<p>Nebeneffekt, den viele unterschätzen: Mit fortschreitender Tilgung sinkt der Zinsanteil Jahr für Jahr. Die steuerliche Belastung steigt also im Zeitverlauf, obwohl sich an der Miete nichts ändert.</p>

<h2>Was Sie sonst noch absetzen können</h2>
<ul>
  <li><strong>Grundsteuer</strong>, soweit nicht auf den Mieter umgelegt</li>
  <li><strong>Nicht umlagefähiges Hausgeld</strong> — Verwaltervergütung und Zuführung zur Instandhaltungsrücklage</li>
  <li><strong>Instandhaltung und Reparaturen</strong> — Erhaltungsaufwand ist sofort abziehbar</li>
  <li><strong>Versicherungen</strong> für das Mietobjekt</li>
  <li><strong>Fahrtkosten</strong> zum Objekt, Kontoführung, Inserate, Maklerkosten bei Neuvermietung</li>
  <li><strong>Steuerberatungskosten</strong>, soweit sie auf die Anlage V entfallen</li>
</ul>

<h3>Vorsicht bei Renovierung kurz nach dem Kauf</h3>
<p>Übersteigen Instandsetzungsmaßnahmen innerhalb der ersten drei Jahre nach Anschaffung 15 % der Gebäude-Anschaffungskosten (ohne Umsatzsteuer), gelten sie als <strong>anschaffungsnahe Herstellungskosten</strong>. Sie sind dann nicht sofort abziehbar, sondern müssen über die Nutzungsdauer abgeschrieben werden. Wer direkt nach dem Kauf umfangreich saniert, sollte diese Grenze im Blick behalten — oder die Arbeiten über die Drei-Jahres-Frist hinaus strecken.</p>

<h2>Wenn ein Verlust entsteht</h2>
<p>In den ersten Jahren übersteigen Abschreibung und Zinsen die Mieteinnahmen häufig. Dann entsteht ein <strong>Verlust aus Vermietung und Verpachtung</strong> — und der ist steuerlich ein Vorteil: Er wird mit Ihren übrigen Einkünften verrechnet und senkt die Steuer auf Ihr Gehalt.</p>

<p>Im Beispiel oben genügen 1.000 € mehr Zinsen, um aus dem Überschuss von 2.900 € einen Verlust zu machen. Bei einem Grenzsteuersatz von 31 % bekommen Sie dann rund ein Drittel des Verlusts über die Steuererklärung zurück.</p>

<p>Voraussetzung ist die <strong>Einkünfteerzielungsabsicht</strong>: die erkennbare Absicht, über die Dauer der Vermietung insgesamt einen Überschuss zu erzielen. Bei dauerhafter Vermietung zu Wohnzwecken unterstellt das Finanzamt sie grundsätzlich. Kritisch wird es bei Ferienwohnungen mit hoher Eigennutzung und bei dauerhaft verbilligter Vermietung.</p>

<h2>Vermietung an Angehörige</h2>
<p>Wer an Kinder oder Eltern günstig vermietet, muss § 21 Abs. 2 EStG beachten:</p>

<ul>
  <li><strong>Ab 66 %</strong> der ortsüblichen Marktmiete: Werbungskosten voll abziehbar.</li>
  <li><strong>Unter 50 %:</strong> Aufteilung in einen entgeltlichen und einen unentgeltlichen Teil — Kosten nur anteilig absetzbar.</li>
  <li><strong>Zwischen 50 % und 66 %:</strong> Das Finanzamt verlangt eine Totalüberschussprognose.</li>
</ul>

<p>Die 66-%-Marke ist damit eine harte Kante: Wer bei 64 % landet, verliert nicht 2 % des Abzugs, sondern muss die gesamte Prognose liefern. Ein Blick in den örtlichen Mietspiegel vor Vertragsschluss lohnt sich.</p>

<h2>Was Sie beim Finanzamt einreichen</h2>
<p>Die Einkünfte gehören in die <strong>Anlage V</strong> der Einkommensteuererklärung — pro Objekt eine eigene Anlage. Anzugeben sind auch Umlagen und Nebenkostenvorauszahlungen der Mieter; die entsprechenden Ausgaben ziehen Sie im Gegenzug als Werbungskosten wieder ab.</p>

<p>Eine Bagatellgrenze gibt es nicht: Auch kleine Mieteinnahmen sind erklärungspflichtig. Die einzige praktische Ausnahme betrifft die vorübergehende Vermietung einzelner Räume in der selbst bewohnten Wohnung — bleiben die Einnahmen unter 520 € im Jahr, verzichtet die Finanzverwaltung auf den Ansatz (R 21.2 Abs. 1 EStR).</p>

<p>Was am Ende bei Ihnen anfällt, rechnen Sie am schnellsten mit dem <a href="/mieteinnahmen-versteuern">Mieteinnahmen-Rechner</a> aus; Ihren persönlichen Steuersatz zeigt der <a href="/einkommensteuer-rechner">Einkommensteuer-Rechner</a>. Dieser Beitrag ersetzt keine steuerliche Beratung.</p>
`,
  faqs: [
    {
      question: "Wie werden Mieteinnahmen versteuert?",
      answer:
        "Versteuert wird nicht die Miete, sondern der Überschuss: Mieteinnahmen minus Werbungskosten (§ 21 EStG). Dieser Betrag wird dem übrigen Einkommen hinzugerechnet und mit dem persönlichen Steuersatz belastet. Einen gesonderten Steuersatz für Mieteinnahmen gibt es nicht.",
    },
    {
      question: "Gibt es einen Freibetrag für Mieteinnahmen?",
      answer:
        "Nein, einen eigenen Freibetrag gibt es nicht. Steuer fällt an, sobald Ihr gesamtes zu versteuerndes Einkommen über dem Grundfreibetrag liegt — 2026 sind das 12.348 € für Alleinstehende. Erklärungspflichtig sind Mieteinnahmen grundsätzlich immer.",
    },
    {
      question: "Wie hoch ist die AfA auf eine vermietete Wohnung?",
      answer:
        "3 % jährlich bei Fertigstellung ab 2023, 2 % bei Fertigstellung zwischen 1925 und 2022 und 2,5 % bei Fertigstellung vor 1925. Abgeschrieben wird nur der Gebäudeanteil des Kaufpreises samt anteiliger Kaufnebenkosten — Grund und Boden nutzt sich nicht ab.",
    },
    {
      question: "Kann ich die Kredittilgung absetzen?",
      answer:
        "Nein. Absetzbar sind nur die Zinsen, nicht der Tilgungsanteil. Die Tilgung ist steuerlich eine Vermögensumschichtung und kein Aufwand. Maßgeblich ist deshalb der Tilgungsplan der Bank, nicht die überwiesene Annuität.",
    },
    {
      question: "Was passiert bei einem Verlust aus Vermietung?",
      answer:
        "Der Verlust wird mit Ihren übrigen Einkünften verrechnet und senkt die Steuer auf Ihr Gehalt. In den ersten Jahren nach dem Kauf ist das durch hohe Zinsen und Abschreibung häufig der Fall. Voraussetzung ist die Absicht, über die Vermietungsdauer insgesamt einen Überschuss zu erzielen.",
    },
    {
      question: "Was gilt bei günstiger Vermietung an Verwandte?",
      answer:
        "Ab 66 % der ortsüblichen Miete bleiben die Werbungskosten voll abziehbar. Unter 50 % wird in einen entgeltlichen und einen unentgeltlichen Teil aufgeteilt, die Kosten sind dann nur anteilig absetzbar. Zwischen 50 % und 66 % verlangt das Finanzamt eine Totalüberschussprognose (§ 21 Abs. 2 EStG).",
    },
    {
      question: "Was sind anschaffungsnahe Herstellungskosten?",
      answer:
        "Übersteigen Instandsetzungen in den ersten drei Jahren nach dem Kauf 15 % der Gebäude-Anschaffungskosten ohne Umsatzsteuer, gelten sie als anschaffungsnahe Herstellungskosten. Sie sind dann nicht sofort abziehbar, sondern müssen über die Nutzungsdauer abgeschrieben werden.",
    },
  ],
  relatedCalculators: [
    "/mieteinnahmen-versteuern",
    "/einkommensteuer-rechner",
    "/immobilienkredit-rechner",
    "/steuerrueckerstattung-rechner",
  ],
  sources: [
    { label: "§ 21 EStG — Vermietung und Verpachtung", url: "https://www.gesetze-im-internet.de/estg/__21.html" },
    { label: "§ 7 EStG — Absetzung für Abnutzung", url: "https://www.gesetze-im-internet.de/estg/__7.html" },
    { label: "§ 9 EStG — Werbungskosten", url: "https://www.gesetze-im-internet.de/estg/__9.html" },
    { label: "§ 6 Abs. 1 Nr. 1a EStG — Anschaffungsnahe Herstellungskosten", url: "https://www.gesetze-im-internet.de/estg/__6.html" },
  ],
};
