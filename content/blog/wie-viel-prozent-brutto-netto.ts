import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "wie-viel-prozent-brutto-netto",
  headline: "Wie viel Prozent bleiben vom Brutto netto? Die Quote nach Gehaltsstufen 2026",
  metaTitle: "Wie viel Prozent bleiben vom Brutto? Tabelle 2026",
  metaDescription:
    "Vom Brutto bleiben 2026 je nach Gehalt 57–74 % netto. Die exakte Quote nach Gehaltsstufe, warum sie mit steigendem Gehalt sinkt — und wo die Sozialabgaben kippen.",
  excerpt:
    "Bei 2.000 € Brutto bleiben rund 74 % netto, bei 10.000 € nur noch 57 %. Warum die Netto-Quote mit steigendem Gehalt fällt, wo die Beitragsbemessungsgrenzen gegensteuern und was das für Gehaltsverhandlungen bedeutet.",
  focusKeyword: "wie viel prozent brutto netto",
  secondaryKeywords: [
    "brutto netto unterschied prozent",
    "wie viel prozent bleibt vom brutto",
    "wie viel prozent gehen vom brutto ab",
    "brutto netto unterschied gehalt",
    "wie viel netto vom brutto",
    "netto quote gehalt",
  ],
  category: "Steuerklassen & Gehalt",
  tags: ["Brutto Netto", "Gehalt", "Sozialabgaben", "Lohnsteuer", "Gehaltsverhandlung"],
  publishedISO: "2026-08-22",
  updatedISO: "2026-08-22",
  answer:
    "Vom Bruttogehalt bleiben 2026 in Steuerklasse I zwischen 57 % und 74 % netto — je nach Gehaltshöhe. Bei 2.000 € Brutto sind es rund 74 %, bei 3.000 € etwa 69 %, bei 5.000 € rund 63 % und bei 10.000 € nur noch etwa 57 %. Die Quote sinkt, weil der Einkommensteuertarif progressiv ist: Jeder zusätzliche Euro wird höher besteuert als der vorherige.",
  keyFacts: [
    { label: "2.000 € brutto", value: "1.484 € netto = 74,2 %" },
    { label: "3.000 € brutto", value: "2.067 € netto = 68,9 %" },
    { label: "4.000 € brutto", value: "2.625 € netto = 65,6 %" },
    { label: "5.000 € brutto", value: "3.157 € netto = 63,1 %" },
    { label: "10.000 € brutto", value: "5.735 € netto = 57,4 %" },
    { label: "Sozialabgaben (AN-Anteil)", value: "rund 21,8 % bis zur BBG" },
  ],
  content: `
<p>"Wie viel Prozent bleiben eigentlich übrig?" ist die häufigste Frage rund um die Gehaltsabrechnung — und eine, auf die es keine einzelne Zahl gibt. Die Antwort hängt von der Gehaltshöhe ab, und zwar systematisch: <strong>Je mehr Sie verdienen, desto kleiner wird der prozentuale Anteil, der bei Ihnen ankommt.</strong></p>

<h2>Die Netto-Quote nach Gehaltsstufen</h2>
<p>Die folgende Tabelle zeigt die tatsächlichen Werte für 2026, berechnet mit dem amtlichen Tarif nach § 32a EStG. Annahmen: Steuerklasse I, kinderlos (also mit Pflegeversicherungszuschlag), keine Kirchensteuer, durchschnittlicher Krankenkassen-Zusatzbeitrag von 2,9 %.</p>

<table>
  <thead>
    <tr><th>Brutto / Monat</th><th>Netto / Monat</th><th>Netto-Quote</th><th>Steuern</th><th>Sozialabgaben</th></tr>
  </thead>
  <tbody>
    <tr><td>2.000 €</td><td>1.484,39 €</td><td>74,2 %</td><td>4,0 %</td><td>21,7 %</td></tr>
    <tr><td>2.500 €</td><td>1.779,12 €</td><td>71,2 %</td><td>7,1 %</td><td>21,8 %</td></tr>
    <tr><td>3.000 €</td><td>2.067,43 €</td><td>68,9 %</td><td>9,3 %</td><td>21,8 %</td></tr>
    <tr><td>3.500 €</td><td>2.349,38 €</td><td>67,1 %</td><td>11,1 %</td><td>21,8 %</td></tr>
    <tr><td>4.000 €</td><td>2.624,98 €</td><td>65,6 %</td><td>12,6 %</td><td>21,8 %</td></tr>
    <tr><td>5.000 €</td><td>3.157,09 €</td><td>63,1 %</td><td>15,1 %</td><td>21,8 %</td></tr>
    <tr><td>6.000 €</td><td>3.676,98 €</td><td>61,3 %</td><td>17,3 %</td><td>21,4 %</td></tr>
    <tr><td>8.000 €</td><td>4.731,88 €</td><td>59,1 %</td><td>22,2 %</td><td>18,7 %</td></tr>
    <tr><td>10.000 €</td><td>5.735,03 €</td><td>57,4 %</td><td>27,2 %</td><td>15,4 %</td></tr>
  </tbody>
</table>

<p>Als Faustregel für Steuerklasse I gilt: <strong>Um 3.000 € Brutto bleiben rund zwei Drittel, ab 8.000 € nur noch knapp 60 %.</strong> Ihr individueller Wert weicht davon ab — Steuerklasse, Kirchensteuer, Kinder und die gewählte Krankenkasse verschieben das Ergebnis um mehrere Prozentpunkte. Für Ihr konkretes Gehalt rechnet der <a href="/">Brutto-Netto-Rechner</a> die exakte Quote aus.</p>

<h2>Warum sinkt die Quote mit steigendem Gehalt?</h2>
<p>Zwei gegenläufige Effekte bestimmen die Kurve.</p>

<h3>1. Die Steuerprogression zieht nach oben</h3>
<p>Der deutsche Einkommensteuertarif ist progressiv aufgebaut. Er beginnt oberhalb des Grundfreibetrags von 12.348 € mit einem Eingangssteuersatz von 14 % und steigt kontinuierlich bis zum Spitzensteuersatz von 42 %. Wichtig zu verstehen: Das gilt für den <strong>Grenzsteuersatz</strong> — den Satz auf den zuletzt verdienten Euro — nicht für das gesamte Einkommen.</p>

<p>In der Tabelle sieht man das deutlich: Die Steuerlast steigt von 4,0 % bei 2.000 € auf 27,2 % bei 10.000 € Brutto. Sie versiebenfacht sich, während sich das Gehalt nur verfünffacht.</p>

<h3>2. Die Sozialabgaben deckeln sich selbst</h3>
<p>Die Sozialversicherungsbeiträge wirken genau umgekehrt. Sie sind bis zu den Beitragsbemessungsgrenzen (BBG) prozentual konstant — und darüber gar nicht mehr. Für 2026:</p>

<table>
  <thead>
    <tr><th>Zweig</th><th>AN-Anteil</th><th>Beitragsbemessungsgrenze 2026</th></tr>
  </thead>
  <tbody>
    <tr><td>Rentenversicherung</td><td>9,3 %</td><td>101.400 € / Jahr (8.450 €/Monat)</td></tr>
    <tr><td>Arbeitslosenversicherung</td><td>1,3 %</td><td>101.400 € / Jahr</td></tr>
    <tr><td>Krankenversicherung</td><td>7,3 % + halber Zusatzbeitrag</td><td>69.750 € / Jahr (5.812,50 €/Monat)</td></tr>
    <tr><td>Pflegeversicherung</td><td>1,8 % (+0,6 % kinderlos)</td><td>69.750 € / Jahr</td></tr>
  </tbody>
</table>

<p>Deshalb fällt der Sozialabgaben-Anteil in der Tabelle ab 6.000 € Brutto: Über 5.812,50 € monatlich steigen KV und PV nicht mehr mit. Ab 8.450 € gilt dasselbe für Rente und Arbeitslosenversicherung. Bei 10.000 € Brutto liegt die Sozialabgabenquote nur noch bei 15,4 % statt 21,8 %.</p>

<p><strong>Netto steigt die Belastung trotzdem</strong>, weil die Steuerprogression den Deckelungseffekt überkompensiert. Details zu den Grenzwerten finden Sie auf der Seite zur <a href="/beitragsbemessungsgrenze-2026">Beitragsbemessungsgrenze 2026</a>.</p>

<h2>Was das für Gehaltsverhandlungen bedeutet</h2>
<p>Der praktisch wichtigste Punkt: <strong>Von einer Gehaltserhöhung bleibt Ihnen nicht die Netto-Quote, sondern deutlich weniger.</strong> Denn der zusätzliche Betrag wird komplett mit Ihrem Grenzsteuersatz belastet — dem höchsten Satz, den Sie zahlen, nicht dem Durchschnitt.</p>

<p>Ein Beispiel: Wer bei 4.000 € Brutto 65,6 % netto behält, bekommt von 200 € mehr Brutto nicht 131 € netto, sondern nur rund 105 € — weil auf diese 200 € ein Grenzsteuersatz von etwa 30 % plus 21,8 % Sozialabgaben entfallen. Genau das rechnet der <a href="/gehaltserhoehung-rechner">Gehaltserhöhungs-Rechner</a> exakt aus.</p>

<p>Für die Verhandlung heißt das: Argumentieren Sie in Brutto-Beträgen, aber planen Sie mit Netto. Und prüfen Sie Alternativen, die günstiger besteuert werden — Jobticket, betriebliche Altersvorsorge, Sachbezüge bis 50 € monatlich oder Zuschüsse zur Kinderbetreuung kommen oft mit deutlich höherer Netto-Ausbeute an.</p>

<h2>Was die Quote sonst noch verschiebt</h2>

<h3>Steuerklasse</h3>
<p>Der größte Hebel überhaupt. Bei gleichem Brutto von 3.500 € reicht das Netto von rund 2.760 € in Steuerklasse III bis unter 2.000 € in Steuerklasse VI. Das ist allerdings nur eine Verschiebung der monatlichen Vorauszahlung — die endgültige Jahressteuer entscheidet die Veranlagung. Der <a href="/steuerklassen">Steuerklassen-Vergleich</a> zeigt alle sechs Klassen nebeneinander.</p>

<h3>Krankenkasse</h3>
<p>Der Zusatzbeitrag variiert 2026 je nach Kasse spürbar. Zwischen der günstigsten und der teuersten Kasse liegen mehrere Zehntel Prozentpunkte — bei 4.000 € Brutto macht das im Jahr einen dreistelligen Betrag aus. Der <a href="/brutto-netto-rechner-krankenkasse">Rechner mit Krankenkassenwahl</a> vergleicht das direkt.</p>

<h3>Kirchensteuer</h3>
<p>8 % (Bayern, Baden-Württemberg) oder 9 % (übrige Länder) auf die Lohnsteuer. Bei 4.000 € Brutto sind das grob 40 bis 50 € im Monat — rund ein Prozentpunkt der Netto-Quote.</p>

<h3>Kinderlosenzuschlag in der Pflegeversicherung</h3>
<p>Wer über 23 ist und keine Kinder hat, zahlt 0,6 Prozentpunkte mehr Pflegeversicherung. Umgekehrt sinkt der Beitrag mit mehreren Kindern gestaffelt — ab zwei Kindern unter 25 Jahren um je 0,25 Prozentpunkte pro Kind, bis maximal 1,0 Prozentpunkt.</p>

<h2>Die drei Zahlen, die Sie kennen sollten</h2>
<ol>
  <li><strong>Netto-Quote</strong> — was insgesamt vom Brutto übrig bleibt. Relevant für die Haushaltsplanung.</li>
  <li><strong>Durchschnittssteuersatz</strong> — Ihre gesamte Steuer geteilt durch das zu versteuernde Einkommen. Relevant für den Vergleich über Jahre.</li>
  <li><strong>Grenzsteuersatz</strong> — was der nächste verdiente Euro kostet. Relevant für jede Entscheidung über Mehrarbeit, Nebenjob oder Gehaltserhöhung.</li>
</ol>

<p>Verwechselt werden vor allem die letzten beiden — mit dem Ergebnis, dass Menschen Gehaltserhöhungen systematisch überschätzen und Zusatzverdienste falsch bewerten.</p>
`,
  faqs: [
    {
      question: "Wie viel Prozent bleiben vom Brutto netto?",
      answer:
        "2026 bleiben in Steuerklasse I je nach Gehaltshöhe zwischen 57 % und 74 % des Bruttos übrig. Bei 2.000 € Brutto sind es rund 74 %, bei 3.000 € etwa 69 %, bei 5.000 € rund 63 % und bei 10.000 € nur noch etwa 57 %.",
    },
    {
      question: "Warum bleibt bei höherem Gehalt prozentual weniger übrig?",
      answer:
        "Weil der Einkommensteuertarif progressiv ist: Der Grenzsteuersatz steigt von 14 % oberhalb des Grundfreibetrags bis auf 42 %. Die Sozialabgaben wirken zwar gegenläufig, weil sie oberhalb der Beitragsbemessungsgrenzen nicht weiter steigen, gleichen die Progression aber nicht aus.",
    },
    {
      question: "Wie viel Prozent sind Sozialabgaben vom Brutto?",
      answer:
        "Der Arbeitnehmeranteil liegt 2026 bei rund 21,8 % des Bruttos — 9,3 % Rente, 1,3 % Arbeitslosenversicherung, 7,3 % plus halber Zusatzbeitrag Krankenversicherung und 1,8 % Pflegeversicherung (plus 0,6 % für Kinderlose ab 23). Oberhalb der Beitragsbemessungsgrenzen sinkt der prozentuale Anteil.",
    },
    {
      question: "Wie viel netto bleibt von einer Gehaltserhöhung?",
      answer:
        "Deutlich weniger als die durchschnittliche Netto-Quote. Der zusätzliche Betrag wird mit dem Grenzsteuersatz belastet. Bei 4.000 € Ausgangsgehalt bleiben von 200 € mehr Brutto nur rund 105 € netto, obwohl die durchschnittliche Netto-Quote bei 65,6 % liegt.",
    },
    {
      question: "Bei welchem Brutto bleiben 3.000 € netto?",
      answer:
        "In Steuerklasse I ohne Kirchensteuer sind dafür rund 4.700 € Bruttomonatsgehalt nötig. Der genaue Wert hängt von Steuerklasse, Krankenkasse und Kinderfreibeträgen ab und lässt sich mit dem Netto-zu-Brutto-Rechner exakt bestimmen.",
    },
  ],
  relatedCalculators: [
    "/",
    "/gehaltserhoehung-rechner",
    "/rechner/netto-zu-brutto",
    "/beitragsbemessungsgrenze-2026",
    "/brutto-netto-rechner-krankenkasse",
  ],
  sources: [
    { label: "§ 32a EStG — Einkommensteuertarif", url: "https://www.gesetze-im-internet.de/estg/__32a.html" },
    {
      label: "Sozialversicherungsrechengrößen-Verordnung 2026",
      url: "https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungsrechengroessenverordnung-2026.html",
    },
    { label: "§ 241 SGB V — Allgemeiner Beitragssatz", url: "https://www.gesetze-im-internet.de/sgb_5/__241.html" },
  ],
};
