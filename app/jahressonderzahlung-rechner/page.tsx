import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import JahressonderzahlungRechner from "./JahressonderzahlungRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { formatEUR } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { JSZ_TARIFE, JSZ_STAND } from "@/data/jahressonderzahlung";
import { TVOED_VKA_2026, GUELTIG_AB, JAHRESSONDERZAHLUNG_VKA_PROZENT } from "@/data/tvoed";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/jahressonderzahlung-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Jahressonderzahlung Rechner 2026: TVöD & TV-L netto";
const DESCRIPTION =
  "Jahressonderzahlung 2026 brutto und netto: TVöD Bund 95/90/75 %, VKA 85 %, TV-L bis 88,14 %. Mit Abzügen im November und Tabelle nach Entgeltgruppe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "jahressonderzahlung rechner",
    "jahressonderzahlung 2026",
    "jahressonderzahlung tvöd 2026",
    "jahressonderzahlung tv-l",
    "jahressonderzahlung netto",
    "jahressonderzahlung rechner netto",
    "weihnachtsgeld öffentlicher dienst 2026",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const netto = (brutto: number, jsz: number) =>
  nettoEinmalzahlung({ bruttoMonat: brutto, einmal: jsz, steuerklasse: 1, kirche: false, kinderlosUeber23: false, auszahlungsMonat: 11 });

/** Eine Zeile je Entgeltgruppe der VKA-Tabelle, Stufe 3 (bzw. höchste belegte Stufe). */
const vkaZeilen = TVOED_VKA_2026.filter((g) => g.slug !== "e15ue").map((g) => {
  const brutto = g.stufen[2] ?? g.stufen.filter((v): v is number => v != null)[0];
  const jsz = brutto * (JAHRESSONDERZAHLUNG_VKA_PROZENT / 100);
  return { label: g.label, brutto, jsz, netto: netto(brutto, jsz).netto };
});

export default function Page() {
  const beispiel = vkaZeilen.find((z) => z.label === "E 9a")!;

  const faqs = [
    {
      q: "Wie hoch ist die Jahressonderzahlung 2026 im TVöD?",
      a: `Seit 2026 gelten neue Sätze: Bei den Kommunen (VKA) einheitlich ${JAHRESSONDERZAHLUNG_VKA_PROZENT} % für alle Entgeltgruppen, in Krankenhäusern und Pflegeeinrichtungen (BT-K, BT-B) 90 % für die Entgeltgruppen 1 bis 8. Beim Bund 95 % (E 1–8), 90 % (E 9a–12) und 75 % (E 13–15). Grundlage ist das Einigungspapier vom 6. April 2025; ausgezahlt wird erstmals mit dem Novembergehalt 2026.`,
    },
    {
      q: "Wie hoch ist die Jahressonderzahlung im TV-L?",
      a: "Im TV-L gelten seit 2022 unverändert 87,43 % (E 1–4), 88,14 % (E 5–8), 74,35 % (E 9a–11), 46,47 % (E 12–13) und 32,53 % (E 14–15) — bundesweit einheitlich, ohne Unterschied zwischen Ost und West. Die Tarifeinigung der Länder vom 14. Februar 2026 hat daran nichts geändert.",
    },
    {
      q: "Wie viel bleibt von der Jahressonderzahlung netto?",
      a: `Meist gut die Hälfte. Beispiel TVöD VKA, E 9a Stufe 3 (${formatEUR(beispiel.brutto)} brutto im Monat): Die Jahressonderzahlung beträgt ${formatEUR(beispiel.jsz)}, netto bleiben in Steuerklasse I rund ${formatEUR(beispiel.netto)}. Die Sonderzahlung wird als sonstiger Bezug versteuert und zusätzlich verbeitragt — deshalb ist der Abzug höher als beim laufenden Gehalt.`,
    },
    {
      q: "Wann wird die Jahressonderzahlung ausgezahlt?",
      a: "Mit dem Entgelt für November, also Ende November. Anspruch hat, wer am 1. Dezember im Arbeitsverhältnis steht. Bemessungsgrundlage ist das durchschnittlich gezahlte Monatsentgelt der Monate Juli, August und September — ohne Vergütung für Überstunden und Mehrarbeit (außer im Dienstplan vorgesehene) und ohne Leistungszulagen und -prämien.",
    },
    {
      q: "Was passiert bei Elternzeit, Krankheit oder Eintritt im Laufe des Jahres?",
      a: "Für jeden Kalendermonat ohne Anspruch auf Entgelt vermindert sich die Jahressonderzahlung um ein Zwölftel. Ausnahmen regelt § 20 Abs. 4 TVöD/TV-L, unter anderem für die Mutterschutzfristen. Wer erst ab Oktober eingestellt wurde, bekommt das erste volle Monatsentgelt als Bemessungsgrundlage.",
    },
    {
      q: "Kann ich die Jahressonderzahlung in freie Tage umwandeln?",
      a: "Im TVöD ja: Seit 2026 können Beschäftigte beim Bund und bei den Kommunen einen Teil der Jahressonderzahlung in bis zu drei freie Tage tauschen (Zeit-statt-Geld). Der Wert der Tage wird auf Stundenbasis berechnet. Für den TV-L sieht die Tarifeinigung vom 14. Februar 2026 keine solche Regelung vor.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Jahressonderzahlung-Rechner 2026"
        url={URL}
        breadcrumbLabel="Jahressonderzahlung-Rechner"
        description="Kostenloser Rechner für die Jahressonderzahlung 2026 im öffentlichen Dienst (TVöD Bund, TVöD VKA, TV-L) — brutto und netto mit Lohnsteuer und Sozialabgaben im November."
        faqs={faqs}
      />
      <JahressonderzahlungRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Jahressonderzahlung 2026: die Prozentsätze
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Prozent des durchschnittlichen Monatsentgelts Juli bis September. Maßgeblich ist die Entgeltgruppe am
          1. September. Stand: {JSZ_STAND}.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Tarifvertrag</th>
                <th className="py-3.5 px-5">Entgeltgruppen</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Satz 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {JSZ_TARIFE.flatMap((t) =>
                t.staffel.map((s, i) => (
                  <tr key={t.key + s.bisEg}>
                    <td className="py-3 px-5 font-semibold">{i === 0 ? t.name : ""}</td>
                    <td className="py-3 px-5">{s.label}</td>
                    <td className="py-3 px-5 text-right font-mono font-bold">{s.prozent.toLocaleString("de-DE")} %</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quellen:{" "}
          {JSZ_TARIFE.filter((t, i, a) => a.findIndex((x) => x.quelle.url === t.quelle.url) === i).map((t, i) => (
            <span key={t.key}>
              {i > 0 ? " · " : ""}
              <a href={t.quelle.url} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{t.quelle.titel}</a>
            </span>
          ))}
          . Die Tarifeinigung der Länder vom 14.02.2026 ändert § 20 TV-L nicht.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          TVöD VKA: Jahressonderzahlung 2026 netto nach Entgeltgruppe
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          {JAHRESSONDERZAHLUNG_VKA_PROZENT} % der Stufe 3 aus der Entgelttabelle ab {GUELTIG_AB}, Vollzeit, Steuerklasse I,
          ohne Kirchensteuer, mit Kindern. Netto nach Lohnsteuer, Soli und Sozialabgaben im November.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Gruppe</th>
                <th className="py-3.5 px-5 text-right">Monatsbrutto</th>
                <th className="py-3.5 px-5 text-right">Jahressonderzahlung</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Netto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {vkaZeilen.map((z) => (
                <tr key={z.label}>
                  <td className="py-2.5 px-5 font-semibold">{z.label}</td>
                  <td className="py-2.5 px-5 text-right font-mono">{formatEUR(z.brutto)}</td>
                  <td className="py-2.5 px-5 text-right font-mono">{formatEUR(z.jsz)}</td>
                  <td className="py-2.5 px-5 text-right font-mono font-bold">{formatEUR(z.netto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Alle Gruppen und Stufen der Tabelle zeigt der{" "}
          <Link href="/tvoed-rechner" className="underline hover:text-[#E60A1C]">TVöD-Rechner</Link>; die S-Gruppen die{" "}
          <Link href="/tvoed-sue-tabelle" className="underline hover:text-[#E60A1C]">TVöD-SuE-Tabelle</Link>, die Länder-Tabelle der{" "}
          <Link href="/tv-l-rechner" className="underline hover:text-[#E60A1C]">TV-L-Rechner</Link>.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">So wird die Jahressonderzahlung berechnet</h2>
          <p>
            <strong className="text-[#16181D]">1. Bemessungsgrundlage:</strong> der Durchschnitt der Monatsentgelte Juli,
            August und September — ohne Vergütung für Überstunden und Mehrarbeit (außer im Dienstplan vorgesehene) und
            ohne Leistungszulagen und -prämien. Wer Teilzeit arbeitet, bekommt die Sonderzahlung anteilig, weil schon das
            Monatsentgelt anteilig ist.
          </p>
          <p>
            <strong className="text-[#16181D]">2. Prozentsatz:</strong> je nach Tarifvertrag und Entgeltgruppe am
            1. September (Tabelle oben). Für jeden Monat 2026 ohne Entgelt sinkt der Betrag um ein Zwölftel.
          </p>
          <p>
            <strong className="text-[#16181D]">3. Abzüge:</strong> Die Sonderzahlung ist ein sonstiger Bezug. Die Lohnsteuer
            darauf ist die Differenz zwischen der Jahreslohnsteuer mit und ohne Sonderzahlung — deshalb trifft sie Ihren
            Grenzsteuersatz, nicht den Durchschnittssatz. Sozialabgaben fallen an, solange die anteilige
            Beitragsbemessungsgrenze bis November nicht erreicht ist (§ 23a SGB IV). Das erklärt, warum Gutverdiener auf
            die Sonderzahlung oft keine Kranken- und Pflegeversicherung mehr zahlen.
          </p>
          <p>
            Weihnachtsgeld außerhalb des öffentlichen Dienstes rechnet der{" "}
            <Link href="/weihnachtsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Weihnachtsgeld-Rechner</Link>,
            das laufende Monatsnetto der{" "}
            <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zur Jahressonderzahlung</h2>
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
