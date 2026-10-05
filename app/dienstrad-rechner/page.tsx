import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import DienstradRechner from "./DienstradRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { BBG_2026, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { DIENSTRAD_QUELLE, dienstradRechnen, geldwerterVorteil } from "@/lib/dienstrad";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/dienstrad-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Dienstrad-Rechner 2026: Jobrad-Leasing netto berechnen";
const DESCRIPTION =
  "Dienstrad per Gehaltsumwandlung: Was kostet das Jobrad netto? Mit 0,25-%-Regel, S-Pedelec, Arbeitgeberzuschuss, Kaufvergleich und Effekt auf die Rente.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["dienstrad rechner", "jobrad rechner", "e-bike leasing rechner", "fahrrad leasing gehaltsumwandlung", "dienstrad 0,25 prozent", "jobrad netto", "bike leasing rechner"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const UVPS = [1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000];
const BRUTTOS = [2500, 3000, 3500, 4000, 5000, 6000, 8000];
const BEISPIEL_UVP = 3600;

export default function Page() {
  const kosten = (b: number, sk: Steuerklasse) =>
    dienstradRechnen({
      bruttoMonat: b, steuerklasse: sk, kinderlosUeber23: sk === 1, kirche: false, uvp: BEISPIEL_UVP, rate: 100, zuschuss: 0,
      typ: "fahrrad", kmArbeitsweg: 0, laufzeitMonate: 36, uebernahme: 0, kaufRabattPct: 0,
    });
  const zeilen = BRUTTOS.map((b) => ({ b, sk1: kosten(b, 1), sk3: kosten(b, 3) }));
  const bsp = zeilen[3].sk1;

  const faqs = [
    {
      q: "Wie wird ein Dienstrad (Jobrad) versteuert?",
      a: `Bei Gehaltsumwandlung wird ein geldwerter Vorteil versteuert und verbeitragt: monatlich 1 % eines auf volle 100 € abgerundeten Viertels der unverbindlichen Preisempfehlung. Bei ${formatEUR(BEISPIEL_UVP)} UVP sind das ${formatEUR(geldwerterVorteil(BEISPIEL_UVP))} im Monat. Damit sind auch die Fahrten zur Arbeit abgegolten. Die Regel gilt für Räder, die erstmals bis zum 31.12.2030 überlassen werden; die 50-€-Freigrenze für Sachbezüge ist nicht anwendbar.`,
    },
    {
      q: "Lohnt sich ein Dienstrad über Gehaltsumwandlung?",
      a: `Meist ja, weil die Rate vom Brutto abgeht. Bei ${formatEUR(4000)} brutto (Steuerklasse I) kostet eine Rate von 100 € Sie netto nur ${formatEUR(bsp.belastung)} — ${bsp.ersparnisPct.toLocaleString("de-DE", { maximumFractionDigits: 0 })} % gespart. Wie viel nach Übernahme gegenüber dem Kauf übrig bleibt, hängt von Rate, Laufzeit und Übernahmepreis ab — und davon, ob Sie beim Händler Rabatt bekämen. Bei sehr niedrigem Einkommen ohne Lohnsteuer ist die Ersparnis kleiner.`,
    },
    {
      q: "Was passiert nach 36 Monaten?",
      a: "Sie geben das Rad zurück oder übernehmen es zum Preis aus dem Angebot. Nach einem BMF-Schreiben vom 17.11.2017 darf der Wert des Rads nach 36 Monaten vereinfacht mit 40 % der UVP angesetzt werden. Zahlen Sie weniger, ist die Differenz ein geldwerter Vorteil; viele Anbieter versteuern ihn pauschal mit 30 % nach § 37b EStG, was oft im Übernahmepreis eingerechnet ist.",
    },
    {
      q: "Was gilt für S-Pedelecs?",
      a: "Ein S-Pedelec mit Unterstützung über 25 km/h ist verkehrsrechtlich ein Kraftfahrzeug. Dann gelten die Dienstwagen-Regeln für Elektrofahrzeuge: 1 % des geviertelten Listenpreises für Privatfahrten plus 0,03 % je Entfernungskilometer für den Arbeitsweg.",
    },
    {
      q: "Was ist, wenn der Arbeitgeber die Rate übernimmt?",
      a: "Zahlt der Arbeitgeber das Rad zusätzlich zum ohnehin geschuldeten Arbeitslohn, ist der Vorteil steuerfrei (§ 3 Nr. 37 EStG) und es fallen keine Sozialabgaben an. Ein Zuschuss, der nur einen Teil der Rate deckt, mindert die Gehaltsumwandlung; das Rad wird dann weiter mit der 0,25-%-Regel versteuert.",
    },
    {
      q: "Hat das Dienstrad Nachteile bei Rente und Sozialleistungen?",
      a: `Ja, kleine: Das niedrigere Brutto senkt die Rentenbeiträge. Im Beispiel (${formatEUR(4000)} brutto, 100 € Rate) fehlen nach 36 Monaten rund ${formatEUR(bsp.renteWeniger)} Monatsrente nach heutigem Rentenwert. Auch Arbeitslosen-, Kranken- und Elterngeld werden aus dem niedrigeren Brutto berechnet.`,
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Dienstrad-Rechner"
        url={URL}
        breadcrumbLabel="Dienstrad-Rechner"
        description="Kostenloser Dienstrad-Rechner für Fahrrad- und E-Bike-Leasing per Gehaltsumwandlung: Netto-Belastung mit der 0,25-%-Regel, S-Pedelec, Arbeitgeberzuschuss, Vergleich mit dem Kauf und Auswirkung auf die Rente."
        faqs={faqs}
      />
      <DienstradRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Was ein Dienstrad netto kostet</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Echte Kosten einer Leasingrate von 100 € je Monat, Rad mit {formatEUR(BEISPIEL_UVP)} UVP (geldwerter Vorteil{" "}
          {formatEUR(geldwerterVorteil(BEISPIEL_UVP))}), ohne Kirchensteuer, berechnet mit dem Brutto-Netto-Rechner 2026.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Brutto / Monat</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Kosten Klasse I</th>
                <th className="py-3.5 px-5 text-right">Ersparnis</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Kosten Klasse III</th>
                <th className="py-3.5 px-5 text-right">Ersparnis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {zeilen.map((z) => (
                <tr key={z.b}>
                  <td className="py-3 px-5 font-mono font-semibold">{formatEUR(z.b)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(z.sk1.belastung)}</td>
                  <td className="py-3 px-5 text-right font-mono">{z.sk1.ersparnisPct.toLocaleString("de-DE", { maximumFractionDigits: 0 })} %</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(z.sk3.belastung)}</td>
                  <td className="py-3 px-5 text-right font-mono">{z.sk3.ersparnisPct.toLocaleString("de-DE", { maximumFractionDigits: 0 })} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Klasse I kinderlos, Klasse III mit Kind. Über der Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung
          ({formatEUR(BBG_2026.kvPvJahr / 12)} im Monat) spart die Umwandlung dort keine Beiträge mehr — daher der Knick bei 6.000 €;
          mit dem steigenden Steuersatz wächst die Ersparnis danach wieder.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Geldwerter Vorteil nach Preis des Rads</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          1 % eines auf volle 100 € abgerundeten Viertels der UVP — erst vierteln, dann abrunden. Fahrrad oder E-Bike bis 25 km/h.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">UVP</th>
                <th className="py-3.5 px-5 text-right">Bemessungsgrundlage</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Vorteil / Monat</th>
                <th className="py-3.5 px-5 text-right">Vorteil / Jahr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {UVPS.map((u) => (
                <tr key={u}>
                  <td className="py-3 px-5 font-mono font-semibold">{formatEUR(u)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(geldwerterVorteil(u) * 100)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(geldwerterVorteil(u))}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(geldwerterVorteil(u) * 12)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle: <a href={DIENSTRAD_QUELLE.url} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{DIENSTRAD_QUELLE.erlass}</a>{" "}
          (Rdnr. 2, 3 und 6); § 8 Abs. 2 Satz 10 EStG.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Dienstrad, Dienstwagen, Entgeltumwandlung</h2>
          <p>
            Das Prinzip ist dasselbe wie beim Dienstwagen — nur deutlich günstiger versteuert. Für Autos rechnet der{" "}
            <Link href="/firmenwagenrechner" className="text-[#E60A1C] font-semibold hover:underline">Firmenwagenrechner</Link>, für die
            Gehaltsumwandlung in die Betriebsrente der{" "}
            <Link href="/bav-rechner" className="text-[#E60A1C] font-semibold hover:underline">bAV-Rechner</Link>. Wer mit dem Rad zur Arbeit
            fährt, kann zusätzlich die Entfernungspauschale ansetzen — siehe{" "}
            <Link href="/pendlerpauschale-rechner" className="text-[#E60A1C] font-semibold hover:underline">Pendlerpauschale-Rechner</Link>.
          </p>
          <p className="text-xs text-black/55">
            JobRad® ist eine eingetragene Marke der JobRad GmbH. Dieser Rechner ist unabhängig und rechnet für alle Anbieter von
            Dienstrad-Leasing gleich.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Dienstrad</h2>
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
