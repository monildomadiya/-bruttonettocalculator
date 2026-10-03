import Link from "next/link";
import {
  ArrowRightLeft, ArrowRight, ArrowLeft, ArrowDown,
  Sparkles, ChevronRight, TrendingUp,
} from "lucide-react";
import { calculateNetto, solveBruttoForNetto, formatEUR, Steuerklasse, Steuerjahr } from "@/lib/taxCalculator";
import { getCommonGrossSalaryAmounts, getNettoInBruttoAmounts } from "@/data/wage-stats";
import ReverseCalculator from "@/components/ReverseCalculator";
import ReviewerByline from "@/components/ReviewerByline";

/**
 * Programmatic reverse page ("3.000 € Netto in Brutto").
 * Rendered by app/rechner/[betrag]/page.tsx for slugs of the form
 * "<amount>-euro-netto-in-brutto". Every figure is solved with the same forward
 * engine the calculator uses (`solveBruttoForNetto` bisects `calculateNetto`),
 * so the pages differ in substance, not just in the number in the headline.
 */

const SK_NAMES: Record<Steuerklasse, string> = {
  1: "Steuerklasse I (Ledig)",
  2: "Steuerklasse II (Alleinerziehend)",
  3: "Steuerklasse III (Verheiratet, Hauptverdiener)",
  4: "Steuerklasse IV (Verheiratet, gleich verdienend)",
  5: "Steuerklasse V (Verheiratet, Zweitverdiener)",
  6: "Steuerklasse VI (Zweitjob)",
};

const STUNDEN_PRO_MONAT = 173.33; // 40-Stunden-Woche

type Variant = { jahr?: Steuerjahr; steuerklasse?: Steuerklasse; kirche?: boolean; kirchensteuerSatz?: number; kinderlosUeber23?: boolean };

/** Benötigtes Brutto für ein Monatsnetto — Default: 2026, SK I, ohne Kirche, kinderlos. */
export function solveNetto(netto: number, v: Variant = {}) {
  const sk = v.steuerklasse ?? 1;
  return solveBruttoForNetto({
    nettoMonatZiel: netto,
    jahr: v.jahr ?? 2026,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: v.kinderlosUeber23 ?? true,
    kirche: v.kirche ?? false,
    kirchensteuerSatz: v.kirchensteuerSatz,
  });
}

export default function NettoInBruttoPage({ amount }: { amount: number }) {
  const nf = (n: number) => new Intl.NumberFormat("de-DE").format(n);
  const fmtNetto = `${nf(amount)} €`;

  const sk1 = solveNetto(amount);
  const brutto = sk1.bruttoMonat;
  const f = sk1.forward;
  const abzuege = brutto - amount;
  const abzugsQuote = (abzuege / brutto) * 100;
  const stundenlohnBrutto = brutto / STUNDEN_PRO_MONAT;

  const allSK = ([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => ({ sk, r: solveNetto(amount, { steuerklasse: sk }) }));
  const sk3 = allSK.find((x) => x.sk === 3)!.r;
  const sk5 = allSK.find((x) => x.sk === 5)!.r;

  const variants = [
    { label: "Ohne Kirchensteuer, kinderlos (Standard)", r: sk1 },
    { label: "Mit Kirchensteuer 9 % (14 Bundesländer)", r: solveNetto(amount, { kirche: true, kirchensteuerSatz: 0.09 }) },
    { label: "Mit Kirchensteuer 8 % (Bayern, Baden-Württemberg)", r: solveNetto(amount, { kirche: true, kirchensteuerSatz: 0.08 }) },
    { label: "Mit Kind (kein Pflege-Kinderlosenzuschlag)", r: solveNetto(amount, { kinderlosUeber23: false }) },
    { label: "Steuerjahr 2027 (laut Gesetzentwurf)", r: solveNetto(amount, { jahr: 2027 }) },
  ];
  const kirche9 = variants[1].r;
  const r2027 = variants[4].r;

  // What 100 € more net costs in gross at this level — the progression made tangible.
  const plus100 = solveNetto(amount + 100).bruttoMonat - brutto;

  // Cross-check page: the brutto→netto page for the nearest whitelisted gross amount.
  const bruttoWhitelist = getCommonGrossSalaryAmounts();
  const brutto100 = Math.round(brutto / 100) * 100;
  const bruttoPage = bruttoWhitelist.includes(brutto100) ? brutto100 : null;
  const bruttoPageNetto = bruttoPage
    ? calculateNetto({ bruttoMonat: bruttoPage, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).nettoMonat
    : null;

  const list = getNettoInBruttoAmounts();
  const idx = list.indexOf(amount);
  const prevAmount = idx > 0 ? list[idx - 1] : null;
  const nextAmount = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const others = list.filter((a) => a !== amount && Math.abs(a - amount) <= 1000);

  const faqs = [
    {
      q: `Wie viel brutto sind ${nf(amount)} € netto?`,
      a: `Für ${nf(amount)} € netto im Monat brauchen Sie 2026 in Steuerklasse I (ledig, ohne Kirchensteuer, kinderlos) ein Bruttogehalt von rund ${formatEUR(brutto)} im Monat bzw. ${formatEUR(brutto * 12)} im Jahr. Davon gehen ${formatEUR(f.steuer.summeMonat)} Steuern und ${formatEUR(f.sv.summeMonat)} Sozialabgaben ab.`,
    },
    {
      q: `Wie viel brutto brauche ich für ${nf(amount)} € netto in Steuerklasse 3?`,
      a: `In Steuerklasse III genügen rund ${formatEUR(sk3.bruttoMonat)} brutto im Monat — ${formatEUR(brutto - sk3.bruttoMonat)} weniger als in Steuerklasse I. Der Partner in Steuerklasse V bräuchte für dasselbe Netto dagegen ${formatEUR(sk5.bruttoMonat)} brutto.`,
    },
    {
      q: `Wie viel Brutto brauche ich für ${nf(amount)} € netto mit Kirchensteuer?`,
      a: `Mit 9 % Kirchensteuer steigt das benötigte Brutto in Steuerklasse I auf ${formatEUR(kirche9.bruttoMonat)} im Monat, also ${formatEUR(kirche9.bruttoMonat - brutto)} mehr als ohne Kirchensteuer.`,
    },
    {
      q: `Was kosten 100 € mehr netto bei ${nf(amount)} €?`,
      a: `Um von ${nf(amount)} € auf ${nf(amount + 100)} € netto zu kommen, muss das Brutto in Steuerklasse I um rund ${formatEUR(plus100)} steigen. Der Grund ist der progressive Steuertarif nach § 32a EStG: Jeder zusätzliche Euro wird mit dem Grenzsteuersatz belastet, nicht mit dem Durchschnittssatz.`,
    },
    {
      q: `Brauche ich 2027 weniger Brutto für ${nf(amount)} € netto?`,
      a: `Nach dem Gesetzentwurf zur Einkommensteuerreform 2027 reichen in Steuerklasse I rund ${formatEUR(r2027.bruttoMonat)} brutto für ${nf(amount)} € netto — ${formatEUR(Math.abs(brutto - r2027.bruttoMonat))} ${r2027.bruttoMonat <= brutto ? "weniger" : "mehr"} als 2026. Die Sozialabgaben 2027 sind dabei mit den Werten 2026 gerechnet, weil die Rechengrößen 2027 noch nicht beschlossen sind; das Gesetz ist noch nicht verabschiedet.`,
    },
  ];

  const canonicalUrl = `https://bruttonettocalculator.com/rechner/${amount}-euro-netto-in-brutto`;
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Netto in Brutto", item: "https://bruttonettocalculator.com/rechner/netto-zu-brutto" },
          { "@type": "ListItem", position: 3, name: `${fmtNetto} Netto in Brutto`, item: canonicalUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${fmtNetto} Netto in Brutto 2026`,
        description: `Für ${fmtNetto} netto im Monat sind 2026 in Steuerklasse I rund ${formatEUR(brutto)} brutto nötig.`,
        isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqs.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <Link href="/rechner/netto-zu-brutto" className="hover:text-[#16181D] transition-colors">Netto in Brutto</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">{fmtNetto} Netto in Brutto</span>
      </div>

      {/* Hero — answer first */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <ArrowRightLeft size={14} /> Umkehrrechnung nach § 32a EStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">{fmtNetto} Netto</span> in Brutto 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Für {fmtNetto} netto im Monat brauchen Sie in Steuerklasse 1 (ledig, ohne Kirchensteuer) 2026 ein Bruttogehalt von rund{" "}
          <strong className="text-[#E60A1C] font-extrabold bg-[#E60A1C]/10 px-2 py-0.5 rounded border border-[#E60A1C]/40">{formatEUR(brutto)}</strong>{" "}
          im Monat — das sind {formatEUR(brutto * 12)} im Jahr. Unten sehen Sie alle 6 Steuerklassen, die Abzüge und den Wert für 2027.
        </p>
        <a
          href="#rechner"
          className="no-print mb-6 inline-flex items-center gap-2 rounded-full bg-[#16181D] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#E60A1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E60A1C]"
        >
          Mit eigenen Angaben berechnen <ArrowDown size={16} aria-hidden="true" />
        </a>
        <ReviewerByline />
      </div>

      {/* Key figures */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          {fmtNetto} netto: Das nötige Brutto in Zahlen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Steuerklasse I, Steuerjahr 2026, kinderlos ab 23, ohne Kirchensteuer, durchschnittlicher Krankenkassen-Zusatzbeitrag.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Brutto / Monat", value: formatEUR(brutto), accent: true },
            { label: "Brutto / Jahr", value: formatEUR(brutto * 12), accent: true },
            { label: "Steuern / Monat", value: formatEUR(f.steuer.summeMonat) },
            { label: "Sozialabgaben / Monat", value: formatEUR(f.sv.summeMonat) },
            { label: "Abzüge gesamt", value: formatEUR(abzuege) },
            { label: "Abzugsquote", value: `${abzugsQuote.toFixed(1).replace(".", ",")} %` },
            { label: "Stundenlohn brutto", value: formatEUR(stundenlohnBrutto) },
            { label: "Grenzsteuersatz", value: `${f.grenzsteuersatzPct.toFixed(1).replace(".", ",")} %` },
          ].map((k) => (
            <div key={k.label} className={`rounded-2xl border p-4 sm:p-5 ${k.accent ? "bg-[#E60A1C]/10 border-[#E60A1C]/40" : "bg-[#FFFFFF] border-black/[0.08]"}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
              <div className={`font-mono font-extrabold text-lg sm:text-xl ${k.accent ? "text-[#E60A1C]" : "text-[#16181D]"}`}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All 6 Steuerklassen */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-1">
          {fmtNetto} netto: Benötigtes Brutto in allen 6 Steuerklassen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Steuerjahr 2026, ohne Kirchensteuer, kinderlos ab 23 Jahren.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Steuerklasse</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Brutto / Jahr</th>
                <th className="py-4 px-5 text-right">Steuern</th>
                <th className="py-4 px-5 text-right">Sozialabgaben</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {allSK.map(({ sk, r }) => (
                <tr key={sk} className={`hover:bg-black/[0.04] transition-colors ${sk === 1 ? "bg-[#E60A1C]/5 font-semibold" : ""}`}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${sk === 1 ? "bg-[#E60A1C] text-white" : "bg-black/[0.05] text-black/80"}`}>{sk}</span>
                      <span className="text-[#16181D]">{SK_NAMES[sk]}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right text-[#16181D] font-bold font-mono bg-black/[0.04]">{formatEUR(r.bruttoMonat)}</td>
                  <td className="py-4 px-5 text-right text-black/80 font-mono">{formatEUR(r.bruttoMonat * 12)}</td>
                  <td className="py-4 px-5 text-right text-rose-600 font-mono">-{formatEUR(r.forward.steuer.summeMonat)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">-{formatEUR(r.forward.sv.summeMonat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Variants */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-1">
          Kirchensteuer, Kind und 2027: So ändert sich das Brutto
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Benötigtes Monatsbrutto für {fmtNetto} netto in Steuerklasse I.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Fall</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Unterschied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {variants.map(({ label, r }, i) => {
                const d = r.bruttoMonat - brutto;
                return (
                  <tr key={label} className={i === 0 ? "bg-[#E60A1C]/5 font-semibold" : ""}>
                    <td className="py-4 px-5 text-[#16181D]">{label}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold">{formatEUR(r.bruttoMonat)}</td>
                    <td className="py-4 px-5 text-right font-mono text-black/70">{i === 0 ? "—" : `${d >= 0 ? "+" : "−"}${formatEUR(Math.abs(d))}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          2027: Tarif nach dem Regierungsentwurf zur Einkommensteuerreform, Sozialabgaben mit den Werten 2026 — das Gesetz ist noch nicht beschlossen.
        </p>
      </div>

      {/* Progression explained with this page's own number */}
      <div className="mb-14 bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg">
        <TrendingUp size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#16181D] font-bold">Für die Gehaltsverhandlung:</strong> Bei {fmtNetto} netto kosten
          100 € mehr netto rund <strong className="text-[#16181D]">{formatEUR(plus100)} mehr brutto</strong>. Ihr Grenzsteuersatz
          liegt bei {f.grenzsteuersatzPct.toFixed(1).replace(".", ",")} % — dazu kommen die Sozialabgaben, solange Sie unter den
          Beitragsbemessungsgrenzen liegen. Verhandeln Sie deshalb immer in Brutto und rechnen Sie das Ergebnis mit dem{" "}
          <Link href="/gehaltserhoehung-rechner" className="font-semibold text-[#E60A1C] hover:underline">Gehaltserhöhungs-Rechner</Link> gegen.
        </p>
      </div>

      {/* Interactive reverse calculator */}
      <div id="rechner" className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
            Netto-Brutto-Rechner für {fmtNetto}
          </h2>
          <p className="text-black/70 text-sm sm:text-base">
            Vorausgefüllt mit {fmtNetto} netto — passen Sie Steuerklasse, Kirchensteuer und Steuerjahr an:
          </p>
        </div>
        <ReverseCalculator initialNetto={amount} />
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
          Häufige Fragen zu {fmtNetto} netto in brutto
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Internal linking */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 shadow-xl">
        <h3 className="font-display font-bold text-xl text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Netto-Beträge in Brutto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5">
            <span className="text-xs font-mono text-black/40 uppercase block mb-1">Weniger netto</span>
            {prevAmount ? (
              <Link href={`/rechner/${prevAmount}-euro-netto-in-brutto`} className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} className="text-[#E60A1C]" /> {nf(prevAmount)} € netto in brutto
              </Link>
            ) : (
              <Link href="/rechner/netto-zu-brutto" className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} className="text-[#E60A1C]" /> Netto-zu-Brutto-Rechner
              </Link>
            )}
          </div>
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5">
            <span className="text-xs font-mono text-black/40 uppercase block mb-1">Mehr netto</span>
            {nextAmount ? (
              <Link href={`/rechner/${nextAmount}-euro-netto-in-brutto`} className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                {nf(nextAmount)} € netto in brutto <ArrowRight size={16} className="text-[#E60A1C]" />
              </Link>
            ) : (
              <Link href="/brutto-netto-gehaltstabelle" className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                Zur Gehaltstabelle <ArrowRight size={16} className="text-[#E60A1C]" />
              </Link>
            )}
          </div>
        </div>
        {bruttoPage && bruttoPageNetto !== null && (
          <p className="text-sm text-black/70 mb-5">
            Gegenprobe:{" "}
            <Link href={`/rechner/${bruttoPage}-euro-brutto-netto`} className="font-semibold text-[#E60A1C] hover:underline">
              {nf(bruttoPage)} € brutto in netto
            </Link>{" "}
            ergibt {formatEUR(bruttoPageNetto)} netto in Steuerklasse I.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {others.map((a) => (
            <Link
              key={a}
              href={`/rechner/${a}-euro-netto-in-brutto`}
              className="text-xs font-semibold bg-[#F1F3F5] hover:bg-[#FFFFFF] border border-black/[0.08] hover:border-[#E60A1C]/50 text-[#16181D] px-3.5 py-2 rounded-xl transition-all"
            >
              {nf(a)} € netto in brutto
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
