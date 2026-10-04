import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import KuendigungsfristRechner from "./KuendigungsfristRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { STAFFEL_AG, fristEnde, spaetesterZugang } from "@/lib/kuendigungsfrist";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/kuendigungsfrist-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Kündigungsfrist-Rechner: Wann endet mein Arbeitsvertrag?";
const DESCRIPTION =
  "Kündigungsfrist berechnen nach § 622 BGB: 4 Wochen zum 15. oder Monatsende, bis 7 Monate für Arbeitgeber, Probezeit 2 Wochen — mit letztem Arbeitstag.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["kündigungsfrist rechner", "kündigungsfristenrechner", "kündigungsfrist arbeitnehmer", "kündigungsfrist arbeitgeber", "kündigungsfrist berechnen", "§ 622 bgb"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

export default function Page() {
  const d = (x: Date) => x.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const bsp = new Date(2026, 9, 15); // 15.10.2026
  const grund = fristEnde(bsp, { wochen: 4, termin: "15oderMonatsende" });
  const spaetNov = spaetesterZugang(new Date(2026, 10, 30), { wochen: 4, termin: "15oderMonatsende" });
  const spaetDez = spaetesterZugang(new Date(2026, 11, 31), { wochen: 4, termin: "15oderMonatsende" });

  const faqs = [
    {
      q: "Welche Kündigungsfrist habe ich als Arbeitnehmer?",
      a: `Gesetzlich vier Wochen zum 15. oder zum Ende eines Kalendermonats (§ 622 Abs. 1 BGB) — egal, wie lange Sie schon im Betrieb sind. Beispiel: Geht Ihre Kündigung am ${d(bsp)} zu, endet das Arbeitsverhältnis am ${d(grund)}. Längere Fristen gelten nur, wenn Arbeits- oder Tarifvertrag sie vorsehen; für Arbeitnehmer darf die Frist aber nicht länger sein als für den Arbeitgeber.`,
    },
    {
      q: "Wie lange ist die Kündigungsfrist für den Arbeitgeber?",
      a: `Sie wächst mit der Betriebszugehörigkeit: ${STAFFEL_AG.slice().reverse().map((s) => `ab ${s.jahre} Jahren ${s.monate} ${s.monate === 1 ? "Monat" : "Monate"}`).join(", ")} — jeweils zum Monatsende (§ 622 Abs. 2 BGB). Darunter gilt die Grundfrist von vier Wochen zum 15. oder Monatsende. Maßgeblich ist die Dauer des Arbeitsverhältnisses beim Zugang der Kündigung.`,
    },
    {
      q: "Bis wann muss ich kündigen, um zum Monatsende rauszukommen?",
      a: `Mit der Grundfrist muss die Kündigung vier Wochen vor dem Monatsende zugehen. Für ein Ende am 30.11.2026 also spätestens am ${d(spaetNov)}, für den 31.12.2026 spätestens am ${d(spaetDez)}. Der Tag des Zugangs zählt nicht mit (§ 187 Abs. 1 BGB).`,
    },
    {
      q: "Welche Kündigungsfrist gilt in der Probezeit?",
      a: "Zwei Wochen, ohne festen Termin — die Frist kann an jedem Tag enden (§ 622 Abs. 3 BGB). Die Probezeit darf höchstens sechs Monate dauern. Entscheidend ist, dass die Kündigung noch innerhalb der Probezeit zugeht; das Ende darf danach liegen.",
    },
    {
      q: "Muss die Kündigung schriftlich sein?",
      a: "Ja. Eine Kündigung des Arbeitsverhältnisses braucht die Schriftform mit eigenhändiger Unterschrift; E-Mail, Fax oder WhatsApp reichen nicht (§ 623 BGB). Wer sich gegen eine Kündigung wehren will, muss innerhalb von drei Wochen nach Zugang Klage beim Arbeitsgericht erheben (§ 4 KSchG).",
    },
    {
      q: "Was ist mit Resturlaub und Gehalt bis zum Ende?",
      a: "Bis zum letzten Tag wird das volle Gehalt gezahlt. Resturlaub wird möglichst noch in der Kündigungsfrist genommen; geht das nicht, wird er ausbezahlt. Wie viele Tage Ihnen anteilig zustehen, zeigt der Urlaubsanspruch-Rechner.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Kündigungsfrist-Rechner"
        url={URL}
        breadcrumbLabel="Kündigungsfrist-Rechner"
        description="Kostenloser Kündigungsfrist-Rechner für Arbeitnehmer und Arbeitgeber nach § 622 BGB: gesetzliche Fristen nach Betriebszugehörigkeit, Probezeit und vertragliche Fristen mit Termin — mit exaktem Ende des Arbeitsverhältnisses."
        faqs={faqs}
      />
      <KuendigungsfristRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Gesetzliche Kündigungsfristen nach § 622 BGB
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Für Kündigungen durch den Arbeitgeber, gerechnet ab dem Beginn des Arbeitsverhältnisses bis zum Zugang der
          Kündigung. Arbeitnehmer kündigen immer mit der Grundfrist, wenn nichts anderes vereinbart ist.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[460px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Betriebszugehörigkeit</th>
                <th className="py-3.5 px-5 text-[#16181D] font-bold">Kündigungsfrist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr><td className="py-3 px-5">Probezeit (max. 6 Monate)</td><td className="py-3 px-5 font-semibold">2 Wochen, beliebiger Tag</td></tr>
              <tr><td className="py-3 px-5">unter 2 Jahren</td><td className="py-3 px-5 font-semibold">4 Wochen zum 15. oder Monatsende</td></tr>
              {STAFFEL_AG.slice().reverse().map((s) => (
                <tr key={s.jahre}>
                  <td className="py-3 px-5">ab {s.jahre} Jahren</td>
                  <td className="py-3 px-5 font-semibold">{s.monate} {s.monate === 1 ? "Monat" : "Monate"} zum Monatsende</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle:{" "}
          <a href="https://www.gesetze-im-internet.de/bgb/__622.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 622 BGB</a>.
          Tarifverträge dürfen abweichen (§ 622 Abs. 4 BGB) — im öffentlichen Dienst etwa § 34 TVöD; solche Fristen lassen
          sich oben unter „Andere Frist“ eintragen.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Nach der Kündigung: Geld richtig planen</h2>
          <p>
            Wird Ihnen gekündigt, lohnt der Blick auf eine mögliche Abfindung — wie viel davon nach der Fünftelregelung
            netto bleibt, rechnet der{" "}
            <Link href="/abfindungsrechner" className="text-[#E60A1C] font-semibold hover:underline">Abfindungsrechner</Link>. Wie
            hoch das Arbeitslosengeld ausfällt, zeigt der{" "}
            <Link href="/arbeitslosengeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitslosengeld-Rechner</Link>;
            melden Sie sich spätestens drei Monate vor dem Ende bei der Agentur für Arbeit arbeitsuchend — erfahren Sie
            kurzfristiger von der Kündigung, innerhalb von drei Tagen (§ 38 SGB III). Sonst droht eine Sperrzeit. Resturlaub
            berechnet der{" "}
            <Link href="/urlaubsanspruch-rechner" className="text-[#E60A1C] font-semibold hover:underline">Urlaubsanspruch-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zur Kündigungsfrist</h2>
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
