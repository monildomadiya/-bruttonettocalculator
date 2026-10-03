import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import AzubiRechner from "./AzubiRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { calculateNetto, formatEUR, AZUBI_GERINGVERDIENERGRENZE } from "@/lib/taxCalculator";
import { pageImageUrl } from "@/lib/pageImage";

const URL = "https://bruttonettocalculator.com/ausbildung-brutto-netto-rechner";

export const metadata: Metadata = {
  title: "Ausbildung Brutto Netto Rechner 2026 – Azubi-Gehalt netto",
  description:
    "Ausbildung Brutto Netto Rechner 2026: Was bleibt von der Ausbildungsvergütung netto? Mit Azubi-Regeln (kein Midijob, 325-€-Grenze) und Mindestvergütung 2026.",
  keywords: [
    "ausbildung netto brutto rechner",
    "ausbildung brutto netto rechner",
    "azubi brutto netto rechner",
    "ausbildungsvergütung netto",
    "azubi gehalt netto",
    "mindestausbildungsvergütung 2026 netto",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/ausbildung-brutto-netto-rechner")],
    title: "Ausbildung Brutto Netto Rechner 2026",
    description: "Azubi-Netto richtig berechnen — ohne Midijob-Rabatt, mit 325-€-Geringverdienergrenze.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

/** Mindestausbildungsvergütung bei Ausbildungsbeginn 2026 (§ 17 BBiG, BIBB-Pressemitteilung). */
const MINDEST_2026 = [
  { jahr: "1. Ausbildungsjahr", betrag: 724 },
  { jahr: "2. Ausbildungsjahr", betrag: 854 },
  { jahr: "3. Ausbildungsjahr", betrag: 977 },
  { jahr: "4. Ausbildungsjahr", betrag: 1014 },
];

const azubi = (b: number) =>
  calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1, auszubildend: true });
const normal = (b: number) =>
  calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 });

/** Ab welchem Monatsbrutto in Steuerklasse I erstmals Lohnsteuer anfällt (aus der Engine). */
function lohnsteuerAb(): number {
  let b = 400;
  while (b < 3000 && azubi(b).steuer.summeMonat < 0.005) b += 1;
  return b;
}

export default function Page() {
  const lstAb = lohnsteuerAb();
  const erstesJahr = azubi(724);
  const viertesJahr = azubi(1014);
  const vergleich = [724, 854, 977, 1014, 1200].map((b) => ({ b, a: azubi(b), n: normal(b) }));
  const diff1014 = normal(1014).nettoMonat - viertesJahr.nettoMonat;

  const faqs = [
    {
      q: "Wie viel netto bleibt von der Ausbildungsvergütung?",
      a: `Von der Mindestausbildungsvergütung im 1. Ausbildungsjahr (724 € bei Beginn 2026) bleiben in Steuerklasse I rund ${formatEUR(erstesJahr.nettoMonat)} netto, im 4. Jahr (1.014 €) rund ${formatEUR(viertesJahr.nettoMonat)}. Abgezogen werden fast nur Sozialabgaben von gut 21 % — Lohnsteuer fällt bei diesen Beträgen nicht an.`,
    },
    {
      q: "Gilt die Midijob-Regelung für Azubis?",
      a: `Nein. Der Übergangsbereich (603,01–2.000 €) mit reduzierten Sozialabgaben gilt ausdrücklich nicht für Personen, die zu ihrer Berufsausbildung beschäftigt sind (§ 20 Abs. 2a SGB IV). Azubis zahlen ab 325,01 € die vollen Arbeitnehmerbeiträge. Ein gewöhnlicher Brutto-Netto-Rechner zeigt deshalb bei 1.014 € ein um ${formatEUR(diff1014)} zu hohes Netto.`,
    },
    {
      q: "Was ist die Geringverdienergrenze für Auszubildende?",
      a: `Liegt die Ausbildungsvergütung bei höchstens ${AZUBI_GERINGVERDIENERGRENZE} € im Monat, trägt der Ausbildungsbetrieb den gesamten Sozialversicherungsbeitrag allein — einschließlich des Kinderlosenzuschlags zur Pflegeversicherung (§ 20 Abs. 3 SGB IV). Der Azubi zahlt dann keine Sozialabgaben.`,
    },
    {
      q: "Ab wann zahlen Azubis Lohnsteuer?",
      a: `In Steuerklasse I fällt 2026 erst ab etwa ${formatEUR(lstAb)} brutto im Monat Lohnsteuer an. Die meisten Ausbildungsvergütungen liegen darunter. Wird trotzdem Lohnsteuer einbehalten (etwa in Steuerklasse VI beim Nebenjob), lohnt sich die Steuererklärung.`,
    },
    {
      q: "Wie hoch ist die Mindestausbildungsvergütung 2026?",
      a: "Für Ausbildungen, die 2026 beginnen, beträgt sie 724 € im 1., 854 € im 2., 977 € im 3. und 1.014 € im 4. Ausbildungsjahr (§ 17 BBiG, bekanntgegeben vom BIBB). Tarifverträge können niedrigere Sätze vorsehen und gehen dann vor; in der Praxis zahlen viele Branchen deutlich mehr.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Ausbildung Brutto Netto Rechner 2026"
        url={URL}
        breadcrumbLabel="Ausbildung Brutto Netto Rechner"
        description="Kostenloser Azubi-Rechner — Nettovergütung in der Ausbildung mit den Sonderregeln nach § 20 SGB IV (kein Übergangsbereich, 325-€-Geringverdienergrenze), Steuerjahr 2026."
        faqs={faqs}
      />
      <AzubiRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Mindestausbildungsvergütung 2026: brutto und netto
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Ausbildungsbeginn 2026, Steuerklasse I, ohne Kirchensteuer, unter 23 Jahren.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Ausbildungsjahr</th>
                <th className="py-3.5 px-5 text-right">Brutto</th>
                <th className="py-3.5 px-5 text-right">Sozialabgaben</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Netto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {MINDEST_2026.map((m) => {
                const r = azubi(m.betrag);
                return (
                  <tr key={m.jahr}>
                    <td className="py-3 px-5 font-semibold">{m.jahr}</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(m.betrag)}</td>
                    <td className="py-3 px-5 text-right font-mono text-amber-600">−{formatEUR(r.sv.summeMonat)}</td>
                    <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(r.nettoMonat)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle: <a href="https://www.bibb.de/de/pressemitteilung_212952.php" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">BIBB, Mindestausbildungsvergütung 2026</a>.
          Wer 2025 oder früher begonnen hat, hat Anspruch auf die Sätze seines Beginnjahres.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Warum normale Brutto-Netto-Rechner bei Azubis zu viel Netto zeigen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl leading-relaxed">
          Fast jede Ausbildungsvergütung liegt zwischen 603,01 € und 2.000 € — im Midijob-Übergangsbereich, in dem
          Beschäftigte reduzierte Sozialabgaben zahlen. Für Auszubildende gilt dieser Rabatt aber nicht
          (<a href="https://www.gesetze-im-internet.de/sgb_4/__20.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 20 Abs. 2a SGB IV</a>).
          Ein Rechner ohne Azubi-Einstellung rechnet ihn trotzdem ein:
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Brutto / Monat</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Netto als Azubi</th>
                <th className="py-3.5 px-5 text-right">Netto mit Midijob-Formel</th>
                <th className="py-3.5 px-5 text-right">Zu viel angezeigt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {vergleich.map(({ b, a, n }) => (
                <tr key={b}>
                  <td className="py-3 px-5 font-mono">{formatEUR(b)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(a.nettoMonat)}</td>
                  <td className="py-3 px-5 text-right font-mono text-black/70">{formatEUR(n.nettoMonat)}</td>
                  <td className="py-3 px-5 text-right font-mono text-rose-600">+{formatEUR(n.nettoMonat - a.nettoMonat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Abzüge in der Ausbildung im Überblick</h2>
          <p>
            <strong className="text-[#16181D]">Sozialabgaben:</strong> Azubis sind voll sozialversicherungspflichtig. Der
            Arbeitnehmeranteil beträgt 2026 rund 21,15 % — Rentenversicherung 9,3 %, Arbeitslosenversicherung 1,3 %,
            Krankenversicherung 7,3 % plus die Hälfte des Zusatzbeitrags der Krankenkasse (Ø 2,9 %) und Pflegeversicherung
            1,8 %. Kinderlose ab 23 zahlen in der Pflegeversicherung 0,6 Prozentpunkte mehr.
          </p>
          <p>
            <strong className="text-[#16181D]">Geringverdienergrenze:</strong> Bis {AZUBI_GERINGVERDIENERGRENZE} € im Monat
            übernimmt der Betrieb alle Beiträge. Schon ab 325,01 € zahlt der Azubi den vollen Anteil — es gibt keinen
            gleitenden Übergang.
          </p>
          <p>
            <strong className="text-[#16181D]">Lohnsteuer:</strong> In Steuerklasse I fällt 2026 erst ab etwa{" "}
            {formatEUR(lstAb)} brutto im Monat Lohnsteuer an. Für einen Nebenjob neben der Ausbildung gilt Steuerklasse VI
            — oder ein <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob</Link> bis
            603 €, der steuer- und abgabenfrei bleiben kann. Studierende mit Job finden ihre Regeln im{" "}
            <Link href="/werkstudent-rechner" className="text-[#E60A1C] font-semibold hover:underline">Werkstudent-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zur Ausbildungsvergütung</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
