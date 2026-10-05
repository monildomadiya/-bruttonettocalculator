import type { BlogPost } from "@/lib/blog";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import type { Steuerklasse } from "@/lib/taxCalculator";

/*
 * Rechtsstand geprüft am 05.10.2026: § 4a EntgFG (gesetze-im-internet.de),
 * § 4 TzBfG, BAG 13.11.2013 – 10 AZR 848/12 (Stichtag bei Mischcharakter),
 * BAG 18.01.2012 – 10 AZR 612/10 (Stichtag bei reiner Betriebstreue zulässig),
 * BAG 14.09.2011 – 10 AZR 526/10 (Freiwilligkeits- + Widerrufsvorbehalt
 * intransparent), Rückzahlungs-Staffel der BAG-Rechtsprechung (100 € / 31.3. / 30.6.).
 * Die Tabelle rechnet lib/einmalzahlung.ts — dieselbe Funktion wie der
 * Weihnachtsgeld-Rechner.
 */

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const zeile = (brutto: number) => {
  const wg = brutto / 2;
  const nach = (sk: Steuerklasse) =>
    nettoEinmalzahlung({ bruttoMonat: brutto, einmal: wg, steuerklasse: sk, kirche: false, kinderlosUeber23: true, auszahlungsMonat: 11 }).netto;
  return `<tr><td>${eur(brutto)}</td><td>${eur(wg)}</td><td>${eur(nach(1))}</td><td>${eur(nach(3))}</td></tr>`;
};
const beispiel = nettoEinmalzahlung({ bruttoMonat: 3000, einmal: 1500, steuerklasse: 1, kirche: false, kinderlosUeber23: true });

export const post: BlogPost = {
  slug: "weihnachtsgeld-anspruch",
  headline: "Weihnachtsgeld 2026: Anspruch, Auszahlung, Kündigung & Rückzahlung",
  metaTitle: "Weihnachtsgeld Anspruch 2026: Wer bekommt es wann?",
  metaDescription:
    "Weihnachtsgeld: Wann besteht ein Anspruch, wann wird es gezahlt, und was gilt bei Kündigung, Elternzeit, Krankheit und Rückzahlung? Mit Netto-Tabelle 2026.",
  excerpt:
    "Ein Gesetz, das Weihnachtsgeld vorschreibt, gibt es nicht. Ein Anspruch entsteht aus Vertrag, Tarif, Betriebsvereinbarung oder betrieblicher Übung. Was bei Kündigung, Elternzeit und Krankheit gilt und wann Sie es zurückzahlen müssen.",
  focusKeyword: "weihnachtsgeld anspruch",
  secondaryKeywords: [
    "wann weihnachtsgeld",
    "weihnachtsgeld kündigung",
    "weihnachtsgeld zurückzahlen",
    "weihnachtsgeld elternzeit",
    "weihnachtsgeld krankengeld",
    "betriebliche übung weihnachtsgeld",
  ],
  category: "Job & Sonderfälle",
  tags: ["Weihnachtsgeld", "Sonderzahlung", "Arbeitsrecht", "Kündigung", "Elternzeit"],
  publishedISO: "2026-10-05",
  updatedISO: "2026-10-05",
  answer:
    "Einen gesetzlichen Anspruch auf Weihnachtsgeld gibt es nicht. Er entsteht nur aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung, dem Gleichbehandlungsgrundsatz oder betrieblicher Übung, etwa nach drei Jahren vorbehaltloser Zahlung. Wer einen Anspruch hat, bekommt das Weihnachtsgeld meist mit dem November- oder Dezembergehalt. Ob es bei Kündigung, Elternzeit oder Krankheit gekürzt oder zurückgefordert werden darf, hängt von der Klausel ab, die es regelt.",
  keyFacts: [
    { label: "Gesetzlicher Anspruch", value: "keiner" },
    { label: "Anspruchsgrundlagen", value: "Vertrag, Tarif, Betriebsvereinbarung, betriebliche Übung" },
    { label: "Betriebliche Übung", value: "i. d. R. nach 3 vorbehaltlosen Zahlungen" },
    { label: "Kürzung bei Krankheit", value: "max. ¼ Tagesverdienst je Krankheitstag (§ 4a EntgFG)" },
    { label: "Rückzahlung bis 100 €", value: "nicht zulässig" },
    { label: "Netto bei 1.500 € (3.000 € brutto, SK I)", value: eur(beispiel.netto) },
  ],
  content: `
<p>Ob es Weihnachtsgeld gibt, entscheidet nicht das Gesetz, sondern der eigene Vertrag. Dieser Beitrag erklärt, woraus ein Anspruch entsteht, wann das Geld kommt und was in den typischen Streitfällen gilt. Wie viel netto übrig bleibt, rechnet der <a href="/weihnachtsgeld-rechner">Weihnachtsgeld-Rechner</a> für Ihr Gehalt aus.</p>

<h2>Gibt es einen gesetzlichen Anspruch auf Weihnachtsgeld?</h2>
<p>Nein. Kein Gesetz verpflichtet Arbeitgeber, Weihnachtsgeld zu zahlen. Ein Anspruch kann sich aber aus fünf Quellen ergeben:</p>
<ul>
  <li><strong>Arbeitsvertrag:</strong> Steht das Weihnachtsgeld dort ohne wirksamen Vorbehalt, ist es geschuldet.</li>
  <li><strong>Tarifvertrag:</strong> Viele Tarifverträge regeln eine Jahressonderzahlung, im öffentlichen Dienst etwa § 20 TVöD und § 20 TV-L. Er gilt, wenn Sie Gewerkschaftsmitglied sind und der Arbeitgeber tarifgebunden ist oder der Vertrag auf den Tarif verweist.</li>
  <li><strong>Betriebsvereinbarung:</strong> Arbeitgeber und Betriebsrat können eine Sonderzahlung für alle vereinbaren.</li>
  <li><strong>Betriebliche Übung:</strong> Zahlt der Arbeitgeber mehrere Jahre hintereinander vorbehaltlos in gleicher Weise, dürfen die Beschäftigten darauf vertrauen. Die Rechtsprechung nimmt das in der Regel nach drei Zahlungen an.</li>
  <li><strong>Gleichbehandlung:</strong> Wer vergleichbaren Kollegen Weihnachtsgeld zahlt, darf Einzelne nicht ohne sachlichen Grund ausnehmen.</li>
</ul>

<h3>Freiwilligkeitsvorbehalt: Wann er trägt und wann nicht</h3>
<p>Arbeitgeber verhindern eine betriebliche Übung meist mit dem Hinweis, die Zahlung sei freiwillig und begründe keinen Anspruch für die Zukunft. Ein solcher Vorbehalt muss klar und verständlich sein. Das Bundesarbeitsgericht hat Klauseln verworfen, die eine Leistung zugleich als freiwillig und als widerruflich bezeichnen, weil unklar bleibt, ob überhaupt ein Anspruch entsteht (BAG, 14.09.2011, 10 AZR 526/10). Ist der Vorbehalt unwirksam, kann trotzdem ein Anspruch entstanden sein.</p>

<h2>Wann wird Weihnachtsgeld ausgezahlt?</h2>
<p>Auch dafür gibt es keinen gesetzlichen Termin. Der Zeitpunkt steht im Vertrag, im Tarifvertrag oder in der Betriebsvereinbarung. Üblich ist die Auszahlung mit dem November- oder Dezembergehalt. Im TVöD kommt die Jahressonderzahlung mit dem Novemberentgelt.</p>

<h2>Wie viel Weihnachtsgeld bleibt netto?</h2>
<p>Weihnachtsgeld ist ein sonstiger Bezug: Die Lohnsteuer darauf ist die Differenz der Jahreslohnsteuer mit und ohne Weihnachtsgeld, dazu kommen Sozialabgaben. Von 1.500 € Weihnachtsgeld bleiben bei 3.000 € Monatsbrutto in Steuerklasse I rund <strong>${eur(beispiel.netto)}</strong>. Die Tabelle zeigt ein halbes Monatsgehalt als Weihnachtsgeld:</p>
<table>
  <thead>
    <tr><th>Monatsbrutto</th><th>Weihnachtsgeld (½ Gehalt)</th><th>Netto Klasse I</th><th>Netto Klasse III</th></tr>
  </thead>
  <tbody>
    ${[2500, 3000, 3500, 4000, 5000].map(zeile).join("\n    ")}
  </tbody>
</table>
<p>Gerechnet mit den Werten 2026, Auszahlung im November, kinderlos, ohne Kirchensteuer, Ø-Zusatzbeitrag 2,9 %. Für Ihre eigenen Angaben nutzen Sie den <a href="/weihnachtsgeld-rechner">Weihnachtsgeld-Rechner</a>; das laufende Netto zeigt der <a href="/">Brutto-Netto-Rechner</a>.</p>

<h2>Weihnachtsgeld bei Kündigung</h2>
<p>Ob Sie nach einer Kündigung noch Weihnachtsgeld bekommen, hängt vom Zweck der Zahlung ab. Die Gerichte unterscheiden drei Fälle:</p>
<ul>
  <li><strong>Vergütung für geleistete Arbeit:</strong> Ist das Weihnachtsgeld Teil des Lohns, etwa ein 13. Monatsgehalt, steht es Ihnen bei Ausscheiden im Lauf des Jahres anteilig zu.</li>
  <li><strong>Reine Belohnung der Betriebstreue:</strong> Hier darf der Arbeitgeber verlangen, dass das Arbeitsverhältnis an einem Stichtag im Bezugsjahr noch besteht oder ungekündigt ist (BAG, 18.01.2012, 10 AZR 612/10).</li>
  <li><strong>Mischcharakter:</strong> Belohnt die Zahlung sowohl die Arbeit als auch die Treue, ist eine Stichtagsklausel im Formularvertrag regelmäßig unwirksam, wenn sie auf das Jahresende oder später abstellt (BAG, 13.11.2013, 10 AZR 848/12). Dann besteht der Anspruch anteilig.</li>
</ul>
<p>Entscheidend ist also der genaue Wortlaut. Lassen Sie eine Klausel im Zweifel von der Gewerkschaft, dem Betriebsrat oder einer Fachanwältin für Arbeitsrecht prüfen.</p>

<h2>Muss ich Weihnachtsgeld zurückzahlen?</h2>
<p>Nur, wenn eine wirksame Rückzahlungsklausel vereinbart ist. Die Rechtsprechung begrenzt, wie lange eine solche Klausel binden darf:</p>
<table>
  <thead>
    <tr><th>Höhe des Weihnachtsgelds</th><th>Rückzahlung bei Ausscheiden</th></tr>
  </thead>
  <tbody>
    <tr><td>bis 100 €</td><td>nicht zulässig</td></tr>
    <tr><td>über 100 €, unter einem Monatsgehalt</td><td>nur bei Ausscheiden vor dem 31. März des Folgejahres</td></tr>
    <tr><td>ab einem Monatsgehalt</td><td>Bindung bis höchstens 30. Juni des Folgejahres</td></tr>
  </tbody>
</table>
<p>Klauseln, die länger binden, sind insgesamt unwirksam: Der Arbeitgeber kann dann gar nichts zurückfordern. Bei Zahlungen, die reine Vergütung für geleistete Arbeit sind, ist eine Rückzahlung grundsätzlich ausgeschlossen.</p>

<h2>Weihnachtsgeld in Elternzeit und Mutterschutz</h2>
<p>Während der Elternzeit ruht das Arbeitsverhältnis. Ist das Weihnachtsgeld Vergütung für geleistete Arbeit, darf der Arbeitgeber es für die Monate der Elternzeit anteilig kürzen, wenn das vereinbart ist. Belohnt es dagegen nur die Betriebstreue, besteht der Anspruch ohne eine ausdrückliche Kürzungsregel auch in der Elternzeit. Zeiten des Mutterschutzes dürfen nicht anspruchsmindernd angerechnet werden; das wäre eine Benachteiligung wegen des Geschlechts.</p>

<h2>Weihnachtsgeld bei Krankheit und Krankengeld</h2>
<p>Eine Kürzung wegen Krankheit erlaubt das Gesetz ausdrücklich, aber nur, wenn sie vereinbart ist, und begrenzt: Je Krankheitstag darf höchstens ein Viertel des durchschnittlichen Tagesverdienstes abgezogen werden (§ 4a EntgFG). Ohne eine solche Vereinbarung bleibt der Anspruch auch bei längerer Krankheit bestehen. Umgekehrt erhöht beitragspflichtiges Weihnachtsgeld aus den letzten zwölf Monaten sogar das Krankengeld: Die Kasse rechnet ein 360stel davon dem täglichen Regelentgelt hinzu (§ 47 Abs. 2 SGB V). Wie hoch Ihr Krankengeld ist, zeigt der <a href="/krankengeld-rechner">Krankengeld-Rechner</a>.</p>

<h2>Teilzeit, Minijob und Probezeit</h2>
<ul>
  <li><strong>Teilzeit:</strong> Teilzeitkräfte bekommen Weihnachtsgeld mindestens im Verhältnis ihrer Arbeitszeit (§ 4 Abs. 1 TzBfG).</li>
  <li><strong>Minijob:</strong> Auch Minijobber haben Anspruch, wenn vergleichbare Vollzeitkräfte Weihnachtsgeld bekommen. Ist es zugesichert, zählt es zur Jahresgrenze von 7.236 € (2026). Mehr dazu im Beitrag <a href="/blog/minijob-2027">Minijob 2027</a>.</li>
  <li><strong>Probezeit und Eintritt im Lauf des Jahres:</strong> Viele Regelungen sehen eine anteilige Zahlung vor. Im TVöD etwa mindert sich die Jahressonderzahlung für jeden Monat ohne Entgeltanspruch um ein Zwölftel.</li>
</ul>

<h2>Bis wann kann ich fehlendes Weihnachtsgeld einfordern?</h2>
<p>Die gesetzliche Verjährungsfrist beträgt drei Jahre zum Jahresende (§ 195 BGB). Viele Arbeits- und Tarifverträge enthalten aber Ausschlussfristen von drei bis sechs Monaten. Wer sie verpasst, verliert den Anspruch. Machen Sie fehlendes Weihnachtsgeld deshalb früh und schriftlich geltend.</p>

<p><em>Stand: 5. Oktober 2026. Alle Angaben ohne Gewähr, keine Rechts- oder Steuerberatung.</em></p>
`,
  faqs: [
    {
      question: "Habe ich einen gesetzlichen Anspruch auf Weihnachtsgeld?",
      answer:
        "Nein. Ein Anspruch entsteht nur aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung, dem Gleichbehandlungsgrundsatz oder betrieblicher Übung. Eine betriebliche Übung nehmen Gerichte in der Regel an, wenn der Arbeitgeber drei Jahre hintereinander vorbehaltlos gezahlt hat.",
    },
    {
      question: "Wann wird Weihnachtsgeld ausgezahlt?",
      answer:
        "Meist mit dem November- oder Dezembergehalt. Einen gesetzlichen Termin gibt es nicht, maßgeblich ist der Vertrag. Im TVöD kommt die Jahressonderzahlung mit dem Novemberentgelt.",
    },
    {
      question: "Bekomme ich Weihnachtsgeld, wenn ich gekündigt habe?",
      answer:
        "Das hängt vom Zweck ab. Ist das Weihnachtsgeld Vergütung für geleistete Arbeit, steht es Ihnen anteilig zu. Belohnt es nur die Betriebstreue, darf der Arbeitgeber ein ungekündigtes Arbeitsverhältnis an einem Stichtag im Jahr verlangen. Bei Mischcharakter ist eine Stichtagsklausel im Formularvertrag meist unwirksam.",
    },
    {
      question: "Muss ich Weihnachtsgeld zurückzahlen, wenn ich kündige?",
      answer:
        "Nur bei einer wirksamen Rückzahlungsklausel. Beträge bis 100 € müssen nie zurückgezahlt werden. Bis unter einem Monatsgehalt darf die Klausel höchstens bis zum 31. März des Folgejahres binden, ab einem Monatsgehalt bis zum 30. Juni. Längere Bindungen machen die Klausel insgesamt unwirksam.",
    },
    {
      question: "Gibt es Weihnachtsgeld in der Elternzeit?",
      answer:
        "Ist das Weihnachtsgeld Vergütung für Arbeit und eine Kürzung vereinbart, darf es für die Elternzeit anteilig gekürzt werden. Belohnt es nur die Betriebstreue, besteht der Anspruch ohne ausdrückliche Kürzungsregel weiter. Mutterschutzzeiten dürfen nicht anspruchsmindernd wirken.",
    },
    {
      question: "Darf Weihnachtsgeld wegen Krankheit gekürzt werden?",
      answer:
        "Ja, aber nur, wenn das vereinbart ist, und höchstens um ein Viertel des durchschnittlichen Tagesverdienstes je Krankheitstag (§ 4a EntgFG). Ohne Vereinbarung bleibt der volle Anspruch.",
    },
  ],
  relatedCalculators: ["/weihnachtsgeld-rechner", "/jahressonderzahlung-rechner", "/", "/krankengeld-rechner"],
  sources: [
    { label: "§ 4a EntgFG — Kürzung von Sondervergütungen", url: "https://www.gesetze-im-internet.de/entgfg/__4a.html" },
    { label: "§ 4 TzBfG — Verbot der Diskriminierung", url: "https://www.gesetze-im-internet.de/tzbfg/__4.html" },
    { label: "§ 195 BGB — Regelmäßige Verjährungsfrist", url: "https://www.gesetze-im-internet.de/bgb/__195.html" },
    { label: "§ 47 SGB V — Höhe und Berechnung des Krankengeldes", url: "https://www.gesetze-im-internet.de/sgb_5/__47.html" },
    { label: "BAG, Urteil vom 13.11.2013 – 10 AZR 848/12 (Stichtagsklausel)", url: "https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BAG&Datum=13.11.2013&Aktenzeichen=10+AZR+848%2F12" },
    { label: "§ 23a SGB IV — Einmalig gezahltes Arbeitsentgelt", url: "https://www.gesetze-im-internet.de/sgb_4/__23a.html" },
    { label: "Minijob-Zentrale — Urlaubs- und Weihnachtsgeld im Minijob", url: "https://magazin.minijob-zentrale.de/einmalzahlungen-minijob/" },
  ],
};
