import type { BlogPost } from "@/lib/blog";
import { vergleichePaar, arbeitslosengeldMonat } from "@/lib/steuerklassenPaar";

/*
 * Geprüft 05.10.2026: automatische Einreihung IV/IV bei Heirat seit 1.1.2018
 * (Länder-Serviceportale, § 39e Abs. 3 EStG), III/V auf Antrag, Rückkehr zu IV/IV
 * auch auf Antrag nur eines Ehegatten, Faktor bis zu zwei Jahre gültig, Wechsel
 * mehrmals im Jahr seit 2020. Die geplante Abschaffung von III/V ab 2030 wurde im
 * Dezember 2024 aus dem Steuerfortentwicklungsgesetz gestrichen.
 * Tabelle: lib/steuerklassenPaar.ts (Faktor nach § 39f EStG).
 */

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
const PAARE: [number, number][] = [
  [3500, 3500],
  [4200, 2800],
  [5250, 1750],
];
const zeilen = PAARE.map(([a, b]) => {
  const r = vergleichePaar({ bruttoA: a, bruttoB: b, kirche: false, kinderlosUeber23: true });
  const k = Object.fromEntries(r.kombinationen.map((x) => [x.key, x]));
  return { a, b, k, faktor: r.faktor };
});
const ausgl = (n: number) => (Math.abs(n) < 0.5 ? "± 0 €" : n > 0 ? `+${eur(n)}` : `−${eur(-n)}`);
const alg5 = arbeitslosengeldMonat(1750, 5);
const alg3 = arbeitslosengeldMonat(1750, 3);
const alg4 = arbeitslosengeldMonat(1750, 4);

export const post: BlogPost = {
  slug: "steuerklasse-nach-heirat",
  headline: "Welche Steuerklasse nach der Heirat? 3/5, 4/4 oder Faktor",
  metaTitle: "Steuerklasse nach der Heirat: 3/5, 4/4 oder Faktor?",
  metaDescription:
    "Nach der Hochzeit gilt Steuerklasse 4/4. Wann sich 3/5 oder der Faktor lohnt, wie Sie per ELSTER wechseln und was Alleinerziehende wissen müssen.",
  excerpt:
    "Wer heiratet, landet automatisch in Steuerklasse IV. Ob 3/5 oder IV mit Faktor besser ist, hängt vom Gehaltsunterschied ab, und von Elterngeld oder Arbeitslosengeld, die absehbar kommen.",
  focusKeyword: "steuerklasse nach heirat",
  secondaryKeywords: [
    "welche steuerklasse nach heirat",
    "steuerklasse wechseln nach heirat",
    "steuerklasse ändern",
    "alleinerziehend steuerklasse",
    "steuerklasse verheiratet",
  ],
  category: "Steuerklassen & Gehalt",
  tags: ["Steuerklasse", "Heirat", "Ehegattensplitting", "Faktorverfahren", "ELSTER"],
  publishedISO: "2026-10-05",
  updatedISO: "2026-10-05",
  answer:
    "Nach der Heirat bekommen beide Partner automatisch Steuerklasse IV. Verdienen beide etwa gleich viel, ist das richtig. Liegen die Gehälter weit auseinander, bringt III/V mehr Netto im Monat, oft aber eine Nachzahlung. IV mit Faktor trifft die Jahressteuer am genauesten. Die Steuerlast des Jahres ist in allen Fällen gleich; einen Wechsel beantragen Sie beim Finanzamt, auch online über ELSTER.",
  keyFacts: [
    { label: "Nach der Heirat automatisch", value: "Steuerklasse IV / IV" },
    { label: "Auf Antrag", value: "III / V oder IV / IV mit Faktor" },
    { label: "Faktor gültig", value: "bis zu 2 Jahre" },
    { label: "Wechsel", value: "mehrmals im Jahr, ab Folgemonat" },
    { label: "Jahressteuer", value: "in allen Kombinationen gleich" },
    { label: "Abschaffung III/V", value: "nicht beschlossen" },
  ],
  content: `
<p>Mit der Hochzeit ändert sich die Lohnsteuer: Ehepaare und eingetragene Lebenspartner werden gemeinsam veranlagt und profitieren vom Ehegattensplitting. Welche Steuerklassen Sie wählen, entscheidet darüber, wie viel davon schon jeden Monat auf dem Konto ankommt. Den Vergleich für Ihr eigenes Gehalt rechnet der <a href="/steuerklassenwechsel-rechner">Steuerklassen-Rechner</a>.</p>

<h2>Welche Steuerklasse bekommen wir nach der Heirat?</h2>
<p>Seit 2018 werden beide Partner nach der Eheschließung automatisch in <strong>Steuerklasse IV</strong> eingereiht, auch wenn nur einer arbeitet. Das Standesamt meldet die Heirat, das Finanzamt ändert die Lohnsteuermerkmale; Sie müssen dafür nichts tun. Die Kombination III/V und das Faktorverfahren gibt es nur auf Antrag.</p>

<h2>3/5, 4/4 oder Faktor: Was bringt mehr Netto?</h2>
<p>Netto pro Monat beider Partner zusammen und der Ausgleich mit der Steuererklärung (+ Erstattung, − Nachzahlung), Steuerjahr 2026, kinderlos, ohne Kirchensteuer:</p>
<table>
  <thead>
    <tr><th>Brutto A / B</th><th>IV / IV</th><th>III / V</th><th>IV / IV mit Faktor</th></tr>
  </thead>
  <tbody>
    ${zeilen
      .map(
        (z) =>
          `<tr><td>${eur(z.a)} / ${eur(z.b)}</td><td>${eur(z.k["IV/IV"].nettoMonat)}<br>${ausgl(z.k["IV/IV"].ausgleichJahr)} im Jahr</td><td>${eur(z.k["III/V"].nettoMonat)}<br>${ausgl(z.k["III/V"].ausgleichJahr)} im Jahr</td><td>${eur(z.k["IV/IV-Faktor"].nettoMonat)}<br>${z.faktor !== null ? `Faktor ${z.faktor.toLocaleString("de-DE", { minimumFractionDigits: 3 })}` : "wie IV/IV"}</td></tr>`,
      )
      .join("\n    ")}
  </tbody>
</table>
<p>Gerechnet mit unserer Lohnsteuer-Engine; den Faktor ermittelt sie wie das Finanzamt nach § 39f EStG. Faustregel daraus:</p>
<ul>
  <li><strong>Gleiches Gehalt:</strong> IV/IV. III/V würde hier insgesamt zu viel Lohnsteuer einbehalten.</li>
  <li><strong>Deutlicher Unterschied</strong> (etwa 60 : 40 und mehr): III/V bringt das meiste Netto im Monat, verlangt aber meist eine Nachzahlung. Legen Sie dafür etwas zurück.</li>
  <li><strong>Keine Überraschungen am Jahresende:</strong> IV/IV mit Faktor. Der Monatsabzug entspricht fast genau der Jahressteuer.</li>
</ul>

<h2>Achtung: Elterngeld, Arbeitslosengeld, Krankengeld</h2>
<p>Lohnersatzleistungen werden aus dem Netto berechnet. In Steuerklasse V ist das Netto am niedrigsten, und damit auch die Leistung. Beispiel Arbeitslosengeld I für den Partner mit 1.750 € brutto (ohne Kind): in Klasse V ${eur(alg5)}, in IV ${eur(alg4)}, in III ${eur(alg3)} im Monat. Ist eine Elternzeit geplant, sollte der Partner, der Elterngeld bekommt, frühzeitig in eine günstigere Klasse wechseln. Beim Elterngeld zählt grundsätzlich die Steuerklasse im letzten Monat des Bemessungszeitraums, es sei denn, eine andere galt in den meisten Monaten (§ 2c Abs. 3 BEEG). Die Höhe rechnet der <a href="/elterngeld-rechner">Elterngeld-Rechner</a>.</p>

<h2>Steuerklasse ändern: So geht's über ELSTER</h2>
<ol>
  <li>In <strong>Mein ELSTER</strong> anmelden (ein Konto pro Partner genügt).</li>
  <li>Unter „Formulare &amp; Leistungen“ den <strong>Antrag auf Steuerklassenwechsel bei Ehegatten/Lebenspartnern</strong> wählen. Alternativ gibt es das Papierformular beim Finanzamt.</li>
  <li>Gewünschte Kombination angeben. Für das Faktorverfahren tragen Sie zusätzlich die voraussichtlichen Jahresarbeitslöhne beider Partner ein.</li>
  <li>Beide Partner müssen den Antrag unterschreiben bzw. bestätigen. Nur die Rückkehr zu IV/IV kann ein Partner allein beantragen.</li>
</ol>
<p>Der Wechsel gilt ab dem Monat nach dem Antrag und wird dem Arbeitgeber elektronisch übermittelt. Seit 2020 dürfen Sie mehrmals im Jahr wechseln. Für das laufende Jahr muss der Antrag spätestens am 30. November beim Finanzamt sein; mehr dazu im Beitrag <a href="/blog/steuerklasse-wechseln-frist-november">Steuerklasse wechseln: Frist im November</a>. Paare mit III/V oder Faktor sind zur Abgabe einer Steuererklärung verpflichtet.</p>

<h2>Welche Steuerklasse bin ich, wenn ich alleinerziehend bin?</h2>
<p>Alleinerziehende bekommen auf Antrag die <strong>Steuerklasse II</strong>, wenn mindestens ein Kind, für das sie Kindergeld oder den Kinderfreibetrag erhalten, in ihrem Haushalt lebt und kein weiterer Erwachsener dort wohnt. Sie bringt den Entlastungsbetrag von 4.260 € im Jahr (2026) plus 240 € für jedes weitere Kind. Mit der Heirat endet Klasse II; dann gelten die Kombinationen für Ehepaare. Details stehen im Beitrag <a href="/blog/steuerklasse-2-alleinerziehende">Steuerklasse 2 für Alleinerziehende</a>. Welche Klasse in Ihrer Situation gilt, beantwortet der <a href="/welche-steuerklasse-bin-ich">Steuerklassen-Finder</a>.</p>

<h2>Werden die Steuerklassen 3 und 5 abgeschafft?</h2>
<p>Nicht beschlossen. Die frühere Bundesregierung wollte III/V ab 2030 durch das Faktorverfahren ersetzen. Dieser Teil wurde im Dezember 2024 aus dem Steuerfortentwicklungsgesetz gestrichen. Stand heute können Ehepaare weiterhin zwischen III/V, IV/IV und IV/IV mit Faktor wählen.</p>

<p><em>Stand: 5. Oktober 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.</em></p>
`,
  faqs: [
    {
      question: "Welche Steuerklasse haben wir nach der Heirat?",
      answer: "Automatisch beide Steuerklasse IV, auch wenn nur einer arbeitet. III/V oder IV/IV mit Faktor müssen Sie beim Finanzamt beantragen.",
    },
    {
      question: "Wann lohnt sich Steuerklasse 3/5?",
      answer: "Wenn ein Partner deutlich mehr verdient, etwa im Verhältnis 60 : 40 oder mehr. Dann bleibt monatlich mehr Netto. Weil oft zu wenig Lohnsteuer einbehalten wird, droht aber eine Nachzahlung, und der Partner in Klasse V hat niedrigere Lohnersatzleistungen.",
    },
    {
      question: "Wie ändere ich die Steuerklasse nach der Hochzeit?",
      answer: "Mit dem Antrag auf Steuerklassenwechsel bei Ehegatten/Lebenspartnern, online über ELSTER oder auf Papier beim Finanzamt. Beide Partner müssen zustimmen; der Wechsel gilt ab dem Folgemonat.",
    },
    {
      question: "Was ist besser: 4/4 mit Faktor oder 3/5?",
      answer: "3/5 bringt meist das höchste Monatsnetto, IV/IV mit Faktor vermeidet Nachzahlungen und verteilt die Steuer fair auf beide. Aufs Jahr zahlen Sie in beiden Fällen dieselbe Steuer.",
    },
    {
      question: "Welche Steuerklasse haben Alleinerziehende?",
      answer: "Steuerklasse II, wenn ein Kind im Haushalt lebt, für das Sie Kindergeld bekommen, und kein anderer Erwachsener dort wohnt. Sie bringt den Entlastungsbetrag von 4.260 € im Jahr (2026).",
    },
  ],
  relatedCalculators: ["/steuerklassenwechsel-rechner", "/welche-steuerklasse-bin-ich", "/steuerklassen", "/"],
  sources: [
    { label: "§ 39e EStG — Elektronische Lohnsteuerabzugsmerkmale", url: "https://www.gesetze-im-internet.de/estg/__39e.html" },
    { label: "§ 39f EStG — Faktorverfahren", url: "https://www.gesetze-im-internet.de/estg/__39f.html" },
    { label: "§ 24b EStG — Entlastungsbetrag für Alleinerziehende", url: "https://www.gesetze-im-internet.de/estg/__24b.html" },
    { label: "Serviceportal Bremen — Eheschließung führt zur Änderung der Steuerklasse", url: "https://www.service.bremen.de/dienstleistungen/eheschliessung-fuehrt-zur-aenderung-der-steuerklasse-196070" },
    { label: "Mein ELSTER", url: "https://www.elster.de/" },
  ],
};
