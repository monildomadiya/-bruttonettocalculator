import type { BlogPost } from "@/lib/blog";
import { estFormel2026, soliBerechnen } from "@/lib/taxCalculator";
import { besteuerungsanteilProzent, WK_PAUSCHBETRAG_RENTE } from "@/lib/renteNetto";

/*
 * Regeln laut BMF "Fragen und Antworten zur Aktivrente" (geprüft 05.10.2026) und
 * DRV-FAQ: § 3 Nr. 21 EStG, bis 2.000 € Arbeitslohn pro Monat steuerfrei, ab
 * Erreichen der Regelaltersgrenze, nur nichtselbständige Arbeit, für die der
 * Arbeitgeber Rentenversicherungsbeiträge zahlt (§§ 168, 172, 172a SGB VI);
 * ausgeschlossen: Selbständige, Beamte, Minijobber, Abgeordnete. Monatsbezogen,
 * kein Vor- oder Rücktrag, nur in einem Dienstverhältnis. Kein
 * Progressionsvorbehalt. Arbeitnehmer-Pauschbetrag voll beim steuerpflichtigen
 * Lohn; Sozialabgaben auf den steuerfreien Teil nicht als Sonderausgaben
 * abziehbar (§ 10 Abs. 2 EStG). Kranken- und Pflegebeiträge fallen weiter an.
 *
 * Rechnung der Tabelle (Veranlagung, Einzelperson, 2026):
 *  - gesetzliche Rente 1.500 €/Monat, Rentenbeginn 2026 → Besteuerungsanteil 84 %
 *  - Lohn: KV ermäßigter Satz 14,0 % (kein Krankengeldanspruch bei Vollrente,
 *    § 243 SGB V) / 2 + halber Ø-Zusatzbeitrag 1,45 %, PV-AN 1,8 % (mit Kindern),
 *    kein RV-/ALV-Arbeitnehmerbeitrag (Vollrente nach Regelaltersgrenze)
 *  - Rente: KV 7,3 % + 1,45 %, PV 3,6 %
 */

const RENTE = 1500;
const BEGINN = 2026;
const ANTEIL = besteuerungsanteilProzent(BEGINN) / 100;
const SV_LOHN = 0.07 + 0.0145 + 0.018;
const SV_RENTE = 0.073 + 0.0145 + 0.036;
const KV_BBG_JAHR = 69750;

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";

function steuerJahr(lohnMonat: number, aktivrente: boolean) {
  const lohnJahr = lohnMonat * 12;
  const frei = aktivrente ? Math.min(lohnMonat, 2000) * 12 : 0;
  const pflichtig = lohnJahr - frei;
  const anp = Math.min(1230, pflichtig);
  const svLohn = Math.min(lohnJahr, KV_BBG_JAHR) * SV_LOHN;
  const svLohnAbziehbar = lohnJahr > 0 ? svLohn * (pflichtig / lohnJahr) : 0;
  const renteJahr = RENTE * 12;
  const zvE = Math.max(
    0,
    renteJahr * ANTEIL - WK_PAUSCHBETRAG_RENTE + (pflichtig - anp) - renteJahr * SV_RENTE - svLohnAbziehbar - 36,
  );
  const est = estFormel2026(zvE);
  return est + soliBerechnen(est, false);
}

const ZEILEN = [1000, 2000, 2500, 3000].map((lohn) => {
  const ohne = steuerJahr(lohn, false);
  const mit = steuerJahr(lohn, true);
  return { lohn, ohne, mit, ersparnis: ohne - mit };
});
const z2000 = ZEILEN.find((z) => z.lohn === 2000)!;

export const post: BlogPost = {
  slug: "aktivrente",
  headline: "Aktivrente 2026: 2.000 € steuerfrei – was netto bleibt",
  metaTitle: "Aktivrente 2026: 2.000 € steuerfrei – was netto bleibt",
  metaDescription:
    "Aktivrente: Wer nach der Regelaltersgrenze weiterarbeitet, verdient seit 2026 bis 2.000 € im Monat steuerfrei. Wer profitiert, welche Abgaben bleiben, wo die Steuerfallen liegen.",
  excerpt:
    "Seit Januar 2026 bleiben bis zu 2.000 € Arbeitslohn im Monat steuerfrei, wenn Sie nach Erreichen der Regelaltersgrenze weiterarbeiten. Für wen das gilt, welche Abgaben trotzdem anfallen und was die Aktivrente netto bringt.",
  focusKeyword: "aktivrente",
  secondaryKeywords: [
    "aktivrente steuerfrei",
    "aktivrente sozialabgaben",
    "aktivrente steuerfalle",
    "was ist aktivrente",
    "aktivrente minijob",
    "aktivrente voraussetzungen",
  ],
  category: "Rente & Vorsorge",
  tags: ["Aktivrente", "Rente", "Weiterarbeiten", "Steuerfreibetrag", "Regelaltersgrenze"],
  publishedISO: "2026-10-05",
  updatedISO: "2026-10-05",
  answer: `Die Aktivrente ist ein Steuerfreibetrag: Wer die Regelaltersgrenze erreicht hat und weiter als Arbeitnehmer arbeitet, verdient seit 1. Januar 2026 bis zu 2.000 € im Monat steuerfrei (§ 3 Nr. 21 EStG). Eine Rente müssen Sie dafür nicht beziehen. Kranken- und Pflegebeiträge fallen weiter an. Bei 1.500 € Rente und 2.000 € Lohn spart die Aktivrente rund ${eur(z2000.ersparnis)} Steuern im Jahr.`,
  keyFacts: [
    { label: "Steuerfrei", value: "bis 2.000 € Arbeitslohn / Monat" },
    { label: "Höchstens pro Jahr", value: "24.000 €" },
    { label: "Gilt seit", value: "1. Januar 2026" },
    { label: "Voraussetzung", value: "Regelaltersgrenze erreicht, Arbeitnehmer" },
    { label: "Nicht für", value: "Minijob, Selbständige, Beamte" },
    { label: "Ersparnis (1.500 € Rente + 2.000 € Lohn)", value: `${eur(z2000.ersparnis)} / Jahr` },
  ],
  content: `
<p>Mit der Aktivrente will die Bundesregierung Menschen im Rentenalter zum Weiterarbeiten bewegen. Der Name führt in die Irre: Es ist keine zusätzliche Rente, sondern ein Freibetrag bei der Lohnsteuer. Dieser Beitrag erklärt, wer ihn bekommt, was netto übrig bleibt und wo die Haken liegen. Was von Ihrer Rente selbst nach Steuern und Beiträgen bleibt, rechnet der <a href="/rente-brutto-netto-rechner">Rente-Brutto-Netto-Rechner</a>.</p>

<h2>Was ist die Aktivrente?</h2>
<p>Seit dem 1. Januar 2026 ist Arbeitslohn bis 2.000 € im Monat steuerfrei, wenn Sie die Regelaltersgrenze erreicht haben und als Arbeitnehmer weiterarbeiten (§ 3 Nr. 21 EStG). Das gilt für Lohn, der nach dem 31. Dezember 2025 gezahlt wird. Der Freibetrag kommt zusätzlich zum Grundfreibetrag von 12.348 €. Einen Antrag brauchen Sie nicht: Ihr Arbeitgeber berücksichtigt die Steuerfreiheit direkt in der Lohnabrechnung.</p>

<h2>Wer bekommt die Aktivrente?</h2>
<ul>
  <li><strong>Regelaltersgrenze erreicht:</strong> je nach Jahrgang zwischen 66 und 67 Jahren. Ihre genaue Grenze zeigt der <a href="/renteneintrittsalter-rechner">Renteneintrittsalter-Rechner</a>.</li>
  <li><strong>Arbeitnehmer mit Rentenversicherung:</strong> Der Arbeitgeber muss für Sie Beiträge zur Rentenversicherung zahlen. Das ist bei einer normalen Beschäftigung nach der Regelaltersgrenze der Fall, auch wenn Sie selbst keinen Rentenbeitrag mehr zahlen.</li>
  <li><strong>Mit oder ohne Rente:</strong> Ob Sie schon Rente beziehen, den Rentenbeginn aufschieben oder gar keinen Rentenanspruch haben, spielt keine Rolle.</li>
</ul>
<p><strong>Ausgeschlossen</strong> sind Selbständige, Beamtinnen und Beamte, Abgeordnete und Minijobber. Wer neben der Rente nur einen Minijob hat, profitiert also nicht; der Minijob ist für Beschäftigte ohnehin steuerfrei, mehr dazu im Beitrag <a href="/blog/minijob-2027">Minijob 2027</a>.</p>

<h2>Wie viel spart die Aktivrente?</h2>
<p>Das hängt davon ab, wie hoch Ihr übriges Einkommen ist. Beispiel mit 1.500 € gesetzlicher Rente (Rentenbeginn 2026, steuerpflichtiger Anteil 84 %), Steuer pro Jahr nach der Steuererklärung:</p>
<table>
  <thead>
    <tr><th>Lohn pro Monat</th><th>Steuer ohne Aktivrente</th><th>Steuer mit Aktivrente</th><th>Ersparnis pro Jahr</th></tr>
  </thead>
  <tbody>
    ${ZEILEN.map((z) => `<tr><td>${eur(z.lohn)}</td><td>${eur(z.ohne)}</td><td>${eur(z.mit)}</td><td><strong>${eur(z.ersparnis)}</strong></td></tr>`).join("\n    ")}
  </tbody>
</table>
<p>Einkommensteuer und Solidaritätszuschlag 2026, Einzelveranlagung, ohne Kirchensteuer und weitere Einkünfte. Kranken- und Pflegeversicherung auf den Lohn mit dem ermäßigten Beitragssatz für Vollrentner, auf die Rente als Rentner. Ab 2.000 € Lohn bleibt der steuerfreie Betrag bei 24.000 € im Jahr. Die Ersparnis steigt danach nur noch, weil dieser Betrag sonst mit einem höheren Grenzsteuersatz belastet würde; der Lohn über 2.000 € wird normal versteuert.</p>

<h2>Welche Sozialabgaben fallen an?</h2>
<p>Die Aktivrente befreit nur von der Steuer, nicht von Beiträgen. Kranken- und Pflegeversicherung zahlen Sie weiter. Wer eine volle Altersrente bezieht und die Regelaltersgrenze erreicht hat, zahlt in der Regel keinen eigenen Beitrag zur Renten- und Arbeitslosenversicherung; der Arbeitgeber zahlt seinen Rentenbeitrag trotzdem. Wer den Rentenbeginn aufschiebt, bleibt dagegen rentenversicherungspflichtig und erhöht so seine spätere Rente.</p>

<h2>Die Steuerfallen der Aktivrente</h2>
<ul>
  <li><strong>Steuer auf die Rente bleibt:</strong> Die Rente selbst ist nicht steuerfrei. Der Arbeitgeber kennt sie nicht und behält Lohnsteuer nur auf den Teil des Lohns über 2.000 € ein. In der Steuererklärung werden Rente und steuerpflichtiger Lohn zusammengerechnet. Eine Nachzahlung ist möglich, deshalb lohnt sich eine Rücklage.</li>
  <li><strong>Monatsgrenze ohne Ausgleich:</strong> Die 2.000 € gelten je Monat. Was Sie in einem Monat nicht ausschöpfen, verfällt; ein Monat mit mehr Lohn, zum Beispiel durch Weihnachtsgeld, wird oberhalb von 2.000 € normal versteuert.</li>
  <li><strong>Nur ein Arbeitgeber:</strong> Im Lohnsteuerabzug gilt die Aktivrente nur in einem Arbeitsverhältnis. Bei einem zweiten Job in Steuerklasse VI müssen Sie dem Arbeitgeber schriftlich bestätigen, dass Sie sie nicht schon anderswo nutzen.</li>
  <li><strong>Kosten nicht absetzbar:</strong> Werbungskosten, die auf den steuerfreien Lohn entfallen, sowie die Sozialabgaben auf diesen Teil können Sie nicht absetzen. Den Arbeitnehmer-Pauschbetrag von 1.230 € gibt es aber voll für den steuerpflichtigen Lohn.</li>
</ul>
<p>Gute Nachricht: Für den steuerfreien Teil gilt kein Progressionsvorbehalt. Er erhöht also nicht den Steuersatz auf Ihre übrigen Einkünfte.</p>

<h2>Lohnt sich das Weiterarbeiten?</h2>
<p>Neben der Steuerersparnis zählt, was Sie netto vom Lohn behalten und wie sich Ihre Rente entwickelt. Wer die Rente aufschiebt, bekommt für jeden Monat 0,5 % Zuschlag. Wie viel ein zusätzliches Arbeitsjahr an Rentenpunkten bringt, zeigt der <a href="/rentenpunkte-rechner">Rentenpunkte-Rechner</a>; das Netto Ihres Lohns rechnet der <a href="/">Brutto-Netto-Rechner</a>.</p>

<p><em>Stand: 5. Oktober 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.</em></p>
`,
  faqs: [
    {
      question: "Was ist die Aktivrente?",
      answer:
        "Ein Steuerfreibetrag für Arbeitnehmer, die die Regelaltersgrenze erreicht haben und weiterarbeiten: Seit 2026 sind bis zu 2.000 € Arbeitslohn im Monat steuerfrei (§ 3 Nr. 21 EStG). Es ist keine zusätzliche Rentenzahlung.",
    },
    {
      question: "Ist die Aktivrente sozialabgabenfrei?",
      answer:
        "Nein. Kranken- und Pflegeversicherungsbeiträge fallen weiter an. Wer eine volle Altersrente bezieht, zahlt nach der Regelaltersgrenze aber in der Regel keinen eigenen Renten- und Arbeitslosenbeitrag.",
    },
    {
      question: "Gilt die Aktivrente im Minijob?",
      answer:
        "Nein. Minijobber, Selbständige, Beamte und Abgeordnete sind ausgeschlossen. Ein Minijob ist für den Beschäftigten aber ohnehin meist steuerfrei, weil der Arbeitgeber eine Pauschsteuer zahlt.",
    },
    {
      question: "Muss ich die Aktivrente beantragen?",
      answer:
        "Nein. Der Arbeitgeber berücksichtigt sie in der Lohnabrechnung, wenn die Voraussetzungen erfüllt sind. Hat er das nicht getan, können Sie sie über die Steuererklärung nachholen.",
    },
    {
      question: "Was ist die Steuerfalle bei der Aktivrente?",
      answer:
        "Die Rente selbst bleibt steuerpflichtig. Der Arbeitgeber behält keine Steuer auf die Rente ein, sondern nur auf den Lohn über 2.000 €. In der Steuererklärung werden Rente und steuerpflichtiger Lohn zusammengerechnet, das kann zu einer Nachzahlung führen. Außerdem verfällt die Monatsgrenze, wenn sie nicht ausgeschöpft wird.",
    },
    {
      question: "Muss ich schon Rente beziehen, um die Aktivrente zu bekommen?",
      answer:
        "Nein. Entscheidend ist nur, dass Sie die Regelaltersgrenze erreicht haben. Ob Sie die Rente beziehen, aufschieben oder keinen Anspruch haben, spielt keine Rolle.",
    },
  ],
  relatedCalculators: ["/rente-brutto-netto-rechner", "/renteneintrittsalter-rechner", "/rentenpunkte-rechner", "/"],
  sources: [
    { label: "BMF — Fragen und Antworten zur Aktivrente", url: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/FAQ-zur-Aktivrente.html" },
    { label: "Deutsche Rentenversicherung — FAQ Aktivrente", url: "https://www.deutsche-rentenversicherung.de/SharedDocs/FAQ/aktivrente/aktivrente_liste.html" },
    { label: "§ 3 EStG — Steuerfreie Einnahmen", url: "https://www.gesetze-im-internet.de/estg/__3.html" },
    { label: "§ 243 SGB V — Ermäßigter Beitragssatz", url: "https://www.gesetze-im-internet.de/sgb_5/__243.html" },
  ],
};
