import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import BrueckentageRechner from "./BrueckentageRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { LAENDER, WT_LANG, arbeitstage, brueckentage, feiertage, fmt, istWochenende, wochentag, type Land } from "@/lib/feiertage";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/brueckentage-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Brückentage 2027: Rechner & Urlaubsplaner je Bundesland";
const DESCRIPTION =
  "Brückentage 2027 für alle 16 Bundesländer: beste Urlaubstage rund um die Feiertage, Urlaubsplaner für Ihr Kontingent und Arbeitstage 2026 und 2027.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["brückentage 2027", "brückentage rechner", "feiertage 2027", "arbeitstage 2027", "urlaubsplaner 2027", "brückentage 2026", "urlaub optimal planen"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const JAHR = 2027;

export default function Page() {
  // Alle Feiertage 2027 mit den Ländern, in denen sie landesweit gelten.
  const proFeiertag = new Map<string, { t: number; name: string; laender: Land[] }>();
  for (const l of LAENDER) for (const f of feiertage(JAHR, l.code)) {
    const k = `${f.t}-${f.name}`;
    const e = proFeiertag.get(k) ?? { t: f.t, name: f.name, laender: [] };
    e.laender.push(l.code);
    proFeiertag.set(k, e);
  }
  const liste = [...proFeiertag.values()].sort((a, b) => a.t - b.t);
  const bundesweit = liste.filter((f) => f.laender.length === 16);
  const amWochenende = bundesweit.filter((f) => istWochenende(f.t));
  const arbeitstageTab = LAENDER.map((l) => ({ ...l, a26: arbeitstage(2026, l.code), a27: arbeitstage(2027, l.code) }));
  const min27 = Math.min(...arbeitstageTab.map((a) => a.a27));
  const max27 = Math.max(...arbeitstageTab.map((a) => a.a27));
  // Bremen hat 2027 nur bundesweite Feiertage unter der Woche (Reformationstag ist Sonntag).
  const ueberall = brueckentage(JAHR, "HB").filter((o) => o.urlaub.length <= 4);

  const faqs = [
    {
      q: "Wie viele Feiertage gibt es 2027?",
      a: `Bundesweit gelten neun gesetzliche Feiertage, dazu kommen je nach Land bis zu drei landesweite (in Teilen Bayerns regional bis zu fünf). ${JAHR} fallen davon ${amWochenende.length} bundesweite Feiertage aufs Wochenende: ${amWochenende.map((f) => `${f.name} (${WT_LANG[wochentag(f.t)]})`).join(", ")}. Deshalb gibt es ${JAHR} zwischen ${min27} und ${max27} Arbeitstage — mehr als 2026.`,
    },
    {
      q: "Welche Brückentage lohnen sich 2027 am meisten?",
      a: "Christi Himmelfahrt fällt wie immer auf einen Donnerstag: Ein Urlaubstag am Freitag, 7. Mai, bringt vier freie Tage. Ostern liegt früh (28. März) — mit vier Urlaubstagen vor Karfreitag sind zehn Tage am Stück frei. Neujahr ist ein Freitag, Pfingstmontag am 17. Mai. In Ländern mit Fronleichnam (27. Mai, Donnerstag) und Allerheiligen (1. November, Montag) kommen weitere Brückentage hinzu.",
    },
    {
      q: "Gibt es einen Ersatz, wenn ein Feiertag auf das Wochenende fällt?",
      a: "Nein. Anders als in einigen anderen Ländern gibt es in Deutschland keinen Nachholtag. Fällt ein Feiertag auf einen Samstag oder Sonntag, ist er für die meisten Beschäftigten schlicht verloren. Wer regelmäßig samstags arbeitet, hat dagegen an einem Feiertag am Samstag frei.",
    },
    {
      q: "Muss mein Arbeitgeber einen Brückentag genehmigen?",
      a: "Grundsätzlich muss der Arbeitgeber Ihre Urlaubswünsche berücksichtigen (§ 7 Abs. 1 BUrlG). Ablehnen darf er nur aus dringenden betrieblichen Gründen oder wenn Urlaubswünsche anderer Beschäftigter Vorrang haben, etwa von Eltern schulpflichtiger Kinder. Viele Betriebe legen Brückentage auch als Betriebsurlaub fest — mit Betriebsrat nur, wenn er zustimmt.",
    },
    {
      q: "Wie viele Arbeitstage hat 2027?",
      a: `Bei einer Fünf-Tage-Woche ${min27} bis ${max27}, je nach Bundesland. Am wenigsten sind es in ${arbeitstageTab.filter((a) => a.a27 === min27).map((a) => a.name).join(" und ")}, am meisten in ${arbeitstageTab.filter((a) => a.a27 === max27).map((a) => a.name).join(", ")}. Für die Pendlerpauschale zählen nur die Tage, an denen Sie tatsächlich zur Arbeit fahren — also abzüglich Urlaub und Krankheit.`,
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Brückentage-Rechner"
        url={URL}
        breadcrumbLabel="Brückentage-Rechner"
        description="Kostenloser Brückentage-Rechner für 2026 und 2027: gesetzliche Feiertage aller 16 Bundesländer, die besten Brückentage, ein Urlaubsplaner für das eigene Kontingent und die Arbeitstage je Land."
        faqs={faqs}
      />
      <BrueckentageRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Brückentage 2027 in allen Bundesländern</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Rund um die bundesweiten Feiertage, mit höchstens vier Urlaubstagen. Landesfeiertage zeigt der Rechner oben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Anlass</th>
                <th className="py-3.5 px-5">Urlaub nehmen</th>
                <th className="py-3.5 px-5 text-right">Urlaubstage</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Frei am Stück</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {ueberall.map((o) => (
                <tr key={`${o.von}-${o.bis}`}>
                  <td className="py-3 px-5">{o.feiertage.join(" & ")}</td>
                  <td className="py-3 px-5 font-mono text-sm">{o.urlaub.map((t) => fmt(t, false)).join(", ")}</td>
                  <td className="py-3 px-5 text-right font-mono">{o.urlaub.length}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{o.freieTage} Tage ({fmt(o.von, false)}–{fmt(o.bis, false)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Feiertage 2027 nach Bundesland</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Landesweit geltende gesetzliche Feiertage. Feiertage nur in Teilen eines Landes (Fronleichnam in Teilen Sachsens und
          Thüringens, Mariä Himmelfahrt in katholischen Gemeinden Bayerns, Friedensfest in Augsburg) lassen sich im Rechner zuschalten.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Datum</th>
                <th className="py-3.5 px-5">Wochentag</th>
                <th className="py-3.5 px-5">Feiertag</th>
                <th className="py-3.5 px-5">Gilt in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {liste.map((f) => (
                <tr key={`${f.t}-${f.name}`} className={istWochenende(f.t) ? "text-black/45" : ""}>
                  <td className="py-2.5 px-5 font-mono">{fmt(f.t)}</td>
                  <td className="py-2.5 px-5">{WT_LANG[wochentag(f.t)]}</td>
                  <td className="py-2.5 px-5 font-semibold">{f.name}</td>
                  <td className="py-2.5 px-5 text-sm">{f.laender.length === 16 ? "allen Bundesländern" : f.laender.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Arbeitstage 2026 und 2027 nach Bundesland</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">Montag bis Freitag ohne landesweite gesetzliche Feiertage.</p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Bundesland</th>
                <th className="py-3.5 px-5 text-right">2026</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">2027</th>
                <th className="py-3.5 px-5 text-right">Differenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {arbeitstageTab.map((a) => (
                <tr key={a.code}>
                  <td className="py-2.5 px-5">{a.name}</td>
                  <td className="py-2.5 px-5 text-right font-mono">{a.a26}</td>
                  <td className="py-2.5 px-5 text-right font-mono font-bold">{a.a27}</td>
                  <td className="py-2.5 px-5 text-right font-mono">{a.a27 - a.a26 > 0 ? "+" : ""}{a.a27 - a.a26}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Urlaub, Arbeitstage und Geld</h2>
          <p>
            Wie viele Urlaubstage Ihnen zustehen — auch bei Teilzeit oder Jobwechsel —, rechnet der{" "}
            <Link href="/urlaubsanspruch-rechner" className="text-[#E60A1C] font-semibold hover:underline">Urlaubsanspruch-Rechner</Link>.
            Die Zahl der Arbeitstage brauchen Sie auch für die Steuererklärung: Der{" "}
            <Link href="/pendlerpauschale-rechner" className="text-[#E60A1C] font-semibold hover:underline">Pendlerpauschale-Rechner</Link>{" "}
            zeigt, was Ihr Arbeitsweg bringt, der{" "}
            <Link href="/urlaubsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Urlaubsgeld-Rechner</Link>, was vom
            Urlaubsgeld netto übrig bleibt.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zu Brückentagen 2027</h2>
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
