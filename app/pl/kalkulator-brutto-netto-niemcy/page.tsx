import type { Metadata } from "next";
import Link from "next/link";
import { Calculator as CalcIcon, ChevronRight, Globe, BarChart3 } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Kalkulator brutto netto Niemcy 2026 – Oblicz wynagrodzenie",
  description:
    "Darmowy kalkulator brutto-netto dla Niemiec 2026: oblicz wynagrodzenie netto z brutto — podatek dochodowy, dodatek solidarnościowy i składki na niemieckie ubezpieczenia społeczne dla wszystkich 6 klas podatkowych. Bez rejestracji.",
  keywords: [
    "kalkulator brutto netto niemcy",
    "kalkulator wynagrodzeń niemcy",
    "brutto netto niemcy 2026",
    "ile netto z brutto niemcy",
    "niemiecki kalkulator wynagrodzeń",
    "pensja netto niemcy",
    "klasy podatkowe niemcy",
  ],
  alternates: {
    canonical: "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy",
    languages: {
      "de-DE": "https://bruttonettocalculator.com/",
      "en-DE": "https://bruttonettocalculator.com/en/tax-calculator-germany",
      "pl-DE": "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy",
      "x-default": "https://bruttonettocalculator.com/",
    },
  },
  openGraph: {
    title: "Kalkulator brutto netto Niemcy 2026 – Oblicz wynagrodzenie",
    description:
      "Oblicz swoje wynagrodzenie netto w Niemczech z kwoty brutto — podatek dochodowy, dodatek solidarnościowy i składki społeczne dla wszystkich 6 klas podatkowych. Darmowy kalkulator.",
    url: "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy",
    locale: "pl_PL",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const REFERENCE = [2500, 3000, 4000, 5000, 6000];
const KLASA_LABEL: Record<number, string> = {
  1: "Klasa I — osoba samotna",
  3: "Klasa III — małżeństwo (główny żywiciel)",
};

const faqs = [
  {
    q: "Jak oblicza się wynagrodzenie netto w Niemczech?",
    a: "Od wynagrodzenia brutto najpierw odejmowane są składki na ubezpieczenia społeczne (emerytalne 9,3%, zdrowotne ok. 8,75%, pielęgnacyjne 1,8–2,4%, na wypadek bezrobocia 1,3% — udział pracownika). Następnie od pozostałego dochodu podlegającego opodatkowaniu naliczany jest podatek dochodowy (Lohnsteuer) wg § 32a EStG, powiększony o dodatek solidarnościowy i ewentualnie podatek kościelny. To, co zostaje, to wynagrodzenie netto.",
  },
  {
    q: "Czym są niemieckie klasy podatkowe (Steuerklassen)?",
    a: "W Niemczech jest sześć klas podatkowych: I (osoba samotna), II (samotny rodzic), III (małżeństwo, główny żywiciel), IV (małżeństwo, równe dochody), V (małżeństwo, niższy dochód) i VI (drugi etat). Klasa podatkowa określa, ile podatku pobierane jest co miesiąc. Klasa III ma najniższe potrącenia, klasa VI najwyższe.",
  },
  {
    q: "Ile wynosi kwota wolna od podatku w Niemczech w 2026 roku?",
    a: "Podstawowa kwota wolna od podatku (Grundfreibetrag) wynosi w 2026 roku 12 348 € dla osób samotnych i 24 696 € dla małżeństw rozliczających się wspólnie. Dochód do tej kwoty nie podlega podatkowi dochodowemu.",
  },
  {
    q: "Czy ten kalkulator dotyczy niemieckich podatków?",
    a: "Tak. Kalkulator stosuje niemiecki podatek dochodowy (§ 32a EStG) oraz niemieckie składki na ubezpieczenia społeczne według urzędowych wartości na 2026 rok. Jest przeznaczony dla osób pracujących w Niemczech i chcących obliczyć swoje wynagrodzenie netto.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Kalkulator brutto netto Niemcy", item: "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy" },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Kalkulator brutto netto Niemcy 2026",
  url: "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy",
  inLanguage: "pl",
  description: "Darmowy niemiecki kalkulator brutto-netto na 2026 rok (§ 32a EStG), wszystkie 6 klas podatkowych.",
};

export default function KalkulatorNiemcyPage() {
  const rows = REFERENCE.map((brutto) => {
    const c1 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    const c3 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 3 });
    return { brutto, net1: c1.nettoMonat, net3: c3.nettoMonat };
  });

  return (
    <main lang="pl" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Start</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Kalkulator brutto netto Niemcy</span>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <Globe size={14} /> Niemcy · Rok podatkowy 2026 · Polski
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          Kalkulator brutto netto <span className="text-gradient-accent">Niemcy</span> 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-4">
          Oblicz swoje <strong className="text-[#16181D]">wynagrodzenie netto</strong> w Niemczech z kwoty brutto.
          Ten darmowy kalkulator uwzględnia <strong className="text-[#16181D]">niemiecki podatek dochodowy</strong>{" "}
          (Lohnsteuer), dodatek solidarnościowy, podatek kościelny oraz wszystkie składki społeczne — dla wszystkich
          sześciu klas podatkowych, zaktualizowany na 2026 rok.
        </p>
        <p className="text-sm text-black/55 max-w-2xl">
          Uwaga: kalkulator stosuje <strong className="text-[#16181D]">niemieckie</strong> podatki i składki. Wolisz
          po niemiecku? Skorzystaj z <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
        </p>
      </div>

      {/* Reklama — pod nagłówkiem, nad kalkulatorem */}
      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      <section id="kalkulator" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={3500} lang="pl" deepLink={false} />
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Brutto na netto · 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Przykłady wynagrodzenia netto (miesięcznie)
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Orientacyjne miesięczne wynagrodzenie netto w Niemczech w 2026 roku (bez podatku kościelnego).
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / miesiąc</th>
                <th className="py-4 px-5 text-right">{KLASA_LABEL[1]}</th>
                <th className="py-4 px-5 text-right">{KLASA_LABEL[3]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-semibold">{formatEUR(r.net1)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-semibold">{formatEUR(r.net3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">Jak działa niemiecki podatek dochodowy</h2>
        <p>
          Niemcy stosują <strong className="text-[#16181D]">progresywny podatek dochodowy</strong> określony w § 32a
          niemieckiej ustawy o podatku dochodowym (EStG). Dochód do podstawowej kwoty wolnej 12 348 € (2026) jest
          nieopodatkowany. Powyżej tej kwoty stawka krańcowa rośnie od 14% do stawki maksymalnej 42% (od 69 879 €
          dochodu do opodatkowania) i 45% dla bardzo wysokich dochodów (od 277 826 €).
        </p>
        <p>
          Pracownicy płacą również <strong className="text-[#16181D]">składki na ubezpieczenia społeczne</strong>:
          emerytalne, zdrowotne, pielęgnacyjne i na wypadek bezrobocia. Pracodawca dopłaca mniej więcej tyle samo.
          Powyższy kalkulator uwzględnia wszystkie te elementy według urzędowych wartości na 2026 rok. Obliczenie jest
          uproszczone i nie stanowi porady podatkowej.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center flex items-center justify-center gap-2">
          <CalcIcon className="text-[#E60A1C]" size={22} /> Najczęściej zadawane pytania
        </h2>
        <div className="space-y-3 max-w-4xl mx-auto">
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
      </section>
    </main>
  );
}
