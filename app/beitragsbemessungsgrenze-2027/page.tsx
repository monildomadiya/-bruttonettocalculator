import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Info, TrendingUp, Gavel, Wallet2 } from "lucide-react";
import { formatEUR, SV_RECHENGROESSEN_2027_ENTWURF as E, BBG_2026 } from "@/lib/taxCalculator";
import ReviewerByline from "@/components/ReviewerByline";
import { siteConfig } from "@/lib/authors";

/**
 * Beitragsbemessungsgrenze 2027.
 *
 * Gegenstück zu `/beitragsbemessungsgrenze-2026`, aber mit einem wesentlichen
 * Unterschied: Die Werte 2027 stammen aus dem Referentenentwurf des BMAS vom
 * 21.09.2026 und sind noch nicht beschlossen. Der Entwurfsstand steht deshalb
 * im Title, im Badge, im ersten Absatz und in jeder FAQ-Antwort — eine Seite,
 * die Entwurfszahlen als geltendes Recht ausgibt, wäre schlicht falsch.
 *
 * Die Beitragssätze für 2027 regelt der Entwurf nicht; alle Euro-Angaben zur
 * Mehrbelastung setzen daher die Sätze 2026 fort und sagen das auch.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/beitragsbemessungsgrenze-2027`;

const eur = (v: number) => v.toLocaleString("de-DE") + " €";

export const metadata: Metadata = {
  title: "Beitragsbemessungsgrenze 2027: 76.500 € & 106.200 €",
  description:
    "Beitragsbemessungsgrenze 2027 nach dem BMAS-Entwurf vom 21.9.2026: 76.500 € für Kranken- und Pflegeversicherung, 106.200 € für Rente und Arbeitslosigkeit.",
  keywords: [
    "beitragsbemessungsgrenze 2027",
    "beitragsbemessungsgrenze krankenversicherung 2027",
    "beitragsbemessungsgrenze rentenversicherung 2027",
    "versicherungspflichtgrenze 2027",
    "jahresarbeitsentgeltgrenze 2027",
    "bbg 2027",
    "sozialversicherung rechengrößen 2027",
    "bezugsgröße 2027",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Beitragsbemessungsgrenze 2027 — alle Entwurfswerte auf einen Blick",
    description:
      "76.500 € für KV/PV, 106.200 € für RV/ALV, Versicherungspflichtgrenze 84.150 €. Referentenentwurf des BMAS vom 21.9.2026.",
    url: CANONICAL,
    type: "article",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
  twitter: {
    card: "summary",
    title: "Beitragsbemessungsgrenze 2027: 76.500 € & 106.200 €",
    description: "Alle Entwurfswerte 2027 inkl. Versicherungspflichtgrenze und Mehrbelastung.",
  },
};

export default function Beitragsbemessungsgrenze2027Page() {
  const grenzen = [
    {
      titel: "Kranken- und Pflegeversicherung",
      jahr: E.kvPvBbgJahr,
      monat: E.kvPvBbgMonat,
      vorjahr: BBG_2026.kvPvJahr,
      hinweis:
        "Steigt zusätzlich zur Lohnentwicklung um 300 € im Monat — deshalb der überproportionale Sprung.",
    },
    {
      titel: "Renten- und Arbeitslosenversicherung",
      jahr: E.rvAlvBbgJahr,
      monat: E.rvAlvBbgMonat,
      vorjahr: BBG_2026.rvAlvJahr,
      hinweis: "Bundeseinheitlich — seit 2025 keine Trennung zwischen West und Ost mehr.",
    },
  ];

  /*
   * Mehrbelastung für alle, die über beiden Grenzen liegen: die Differenz der
   * Bemessungsgrundlage mal dem Arbeitnehmeranteil. Die Sätze 2027 stehen noch
   * nicht fest, deshalb wird hier ausdrücklich mit den Sätzen 2026 gerechnet.
   */
  const deltaKvPv = E.kvPvBbgJahr - BBG_2026.kvPvJahr;
  const deltaRvAlv = E.rvAlvBbgJahr - BBG_2026.rvAlvJahr;
  const mehrKvPv = deltaKvPv * (BBG_2026.anSatzKv + BBG_2026.anSatzPv);
  const mehrRvAlv = deltaRvAlv * (BBG_2026.anSatzRv + BBG_2026.anSatzAlv);
  const mehrGesamt = mehrKvPv + mehrRvAlv;

  const weitereWerte = [
    { label: "Bezugsgröße", jahr: E.bezugsgroesseJahr, monat: E.bezugsgroesseMonat },
    {
      label: "Versicherungspflichtgrenze (JAEG)",
      jahr: E.versicherungspflichtgrenzeJahr,
      monat: E.versicherungspflichtgrenzeMonat,
    },
    {
      label: "BBG knappschaftliche Rentenversicherung",
      jahr: E.knappschaftBbgJahr,
      monat: E.knappschaftBbgMonat,
    },
  ];

  const faqs = [
    {
      q: "Wie hoch ist die Beitragsbemessungsgrenze 2027?",
      a:
        "Nach dem Referentenentwurf des BMAS vom 21. September 2026 liegt sie bei " +
        eur(E.kvPvBbgJahr) +
        " im Jahr (" +
        formatEUR(E.kvPvBbgMonat) +
        " im Monat) für die Kranken- und Pflegeversicherung und bei " +
        eur(E.rvAlvBbgJahr) +
        " im Jahr (" +
        formatEUR(E.rvAlvBbgMonat) +
        " im Monat) für die Renten- und Arbeitslosenversicherung. Beschlossen ist die Verordnung noch nicht: Sie muss die Bundesregierung passieren und anschließend vom Bundesrat gebilligt werden.",
    },
    {
      q: "Sind die Werte für 2027 schon endgültig?",
      a:
        "Nein. Es handelt sich um einen Referentenentwurf, also den Arbeitsstand des Ministeriums. Erfahrungsgemäß bleiben die Rechengrößen im weiteren Verfahren unverändert, weil sie sich rechnerisch aus der Lohnentwicklung ergeben — ein Automatismus ist das aber nicht. Verbindlich werden sie erst mit der Verkündung der Sozialversicherungsrechengrößen-Verordnung 2027.",
    },
    {
      q: "Warum steigt die Grenze für die Krankenversicherung 2027 so stark?",
      a:
        "Weil zwei Effekte zusammenkommen. Die Rechengrößen folgen der Lohnentwicklung 2025 von " +
        (E.lohnentwicklung2025 * 100).toLocaleString("de-DE", { minimumFractionDigits: 2 }) +
        " %. Bei der Kranken- und Pflegeversicherung kommen darüber hinaus 300 € im Monat obendrauf. Aus " +
        eur(BBG_2026.kvPvJahr) +
        " werden dadurch " +
        eur(E.kvPvBbgJahr) +
        " — ein Plus von " +
        (((E.kvPvBbgJahr - BBG_2026.kvPvJahr) / BBG_2026.kvPvJahr) * 100).toLocaleString("de-DE", {
          maximumFractionDigits: 1,
        }) +
        " %, deutlich mehr als bei Rente und Arbeitslosenversicherung.",
    },
    {
      q: "Was kostet mich die höhere Beitragsbemessungsgrenze 2027?",
      a:
        "Wer mit seinem Bruttogehalt über beiden Grenzen liegt, zahlt 2027 auf " +
        eur(deltaKvPv) +
        " mehr Bemessungsgrundlage bei KV/PV und auf " +
        eur(deltaRvAlv) +
        " mehr bei RV/ALV Beiträge. Bei unveränderten Beitragssätzen sind das rund " +
        formatEUR(mehrGesamt) +
        " mehr Arbeitnehmerbeitrag im Jahr — etwa " +
        formatEUR(mehrGesamt / 12) +
        " im Monat. Der Arbeitgeber zahlt noch einmal ungefähr denselben Betrag. Die Beitragssätze für 2027 regelt dieser Entwurf allerdings nicht.",
    },
    {
      q: "Was ist der Unterschied zwischen Beitragsbemessungsgrenze und Versicherungspflichtgrenze?",
      a:
        "Die Beitragsbemessungsgrenze begrenzt die Höhe der Beiträge, die Versicherungspflichtgrenze (Jahresarbeitsentgeltgrenze) entscheidet, ob Sie die gesetzliche Krankenversicherung überhaupt verlassen dürfen. 2027 soll die Versicherungspflichtgrenze bei " +
        eur(E.versicherungspflichtgrenzeJahr) +
        " im Jahr liegen, also " +
        formatEUR(E.versicherungspflichtgrenzeMonat) +
        " im Monat. Erst wer regelmäßig darüber verdient, kann in die private Krankenversicherung wechseln.",
    },
    {
      q: "Rechnet der Brutto-Netto-Rechner schon mit den Werten 2027?",
      a:
        "Nein. Solange die Verordnung nicht beschlossen ist, rechnen alle 2027-Szenarien im Rechner mit den amtlichen Sozialversicherungswerten 2026; nur der Steuerteil folgt dem Regierungsentwurf zur Einkommensteuerreform 2027. Sobald die Verordnung in Kraft ist, wird die Engine umgestellt.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Beitragsbemessungsgrenze 2027", item: CANONICAL },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL,
    url: CANONICAL,
    name: "Beitragsbemessungsgrenze 2027",
    inLanguage: "de-DE",
    dateModified: siteConfig.lastUpdatedISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
    citation: {
      "@type": "Legislation",
      name: "Referentenentwurf einer Sozialversicherungsrechengrößen-Verordnung 2027",
      legislationJurisdiction: "Deutschland",
      legislationDate: E.stand,
      url: E.quelle,
    },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pt-8 pb-16">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-[#16181D] font-medium">Beitragsbemessungsgrenze 2027</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <Gavel size={14} />
            Referentenentwurf vom 21.09.2026 — noch nicht beschlossen
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16181D] leading-tight mb-3">
            Beitragsbemessungsgrenze 2027: {eur(E.kvPvBbgJahr)} und {eur(E.rvAlvBbgJahr)}
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-3xl">
            Das Bundesministerium für Arbeit und Soziales hat am 21. September 2026 den Entwurf der
            Sozialversicherungsrechengrößen-Verordnung 2027 vorgelegt. Grundlage ist die
            Lohnentwicklung 2025 von{" "}
            {(E.lohnentwicklung2025 * 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })} % —
            alle Rechengrößen steigen. Beschlossen ist die Verordnung noch nicht: Bundesregierung und
            Bundesrat stehen aus.
          </p>
          <div className="mt-4">
            <ReviewerByline />
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-4 mb-10">
          {grenzen.map((g) => (
            <div key={g.titel} className="bg-white border border-black/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-black/45 mb-2">
                {g.titel}
              </div>
              <div className="text-3xl font-extrabold text-[#16181D] tabular-nums mb-1">{eur(g.jahr)}</div>
              <div className="text-sm text-black/60 mb-3">
                im Jahr · <strong className="text-[#16181D]">{formatEUR(g.monat)}</strong> im Monat
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#0E9F6E] font-semibold mb-2">
                <TrendingUp size={13} />
                von {eur(g.vorjahr)} in 2026 (+
                {(((g.jahr - g.vorjahr) / g.vorjahr) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %)
              </div>
              <p className="text-xs text-black/55 leading-relaxed">{g.hinweis}</p>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">Alle Rechengrößen 2027 im Überblick</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="py-2.5 pr-4 font-bold text-[#16181D]">Rechengröße</th>
                  <th className="py-2.5 pr-4 font-bold text-[#16181D] text-right">pro Monat</th>
                  <th className="py-2.5 font-bold text-[#16181D] text-right">pro Jahr</th>
                </tr>
              </thead>
              <tbody>
                {[...grenzen.map((g) => ({ label: `BBG ${g.titel}`, monat: g.monat, jahr: g.jahr })), ...weitereWerte].map(
                  (r) => (
                    <tr key={r.label} className="border-b border-black/[0.06]">
                      <td className="py-2.5 pr-4 text-black/75">{r.label}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-[#16181D] font-semibold">
                        {formatEUR(r.monat)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-[#16181D] font-semibold">{eur(r.jahr)}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/45 mt-3 flex items-start gap-1.5">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Quelle: Referentenentwurf des BMAS zur Sozialversicherungsrechengrößen-Verordnung 2027,
            Stand 21. September 2026. Vorläufiges Durchschnittsentgelt der Rentenversicherung 2027:{" "}
            {eur(E.durchschnittsentgeltVorlaeufig2027)}.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">
            Was die höheren Grenzen kosten
          </h2>
          <div className="bg-black/[0.03] border border-black/[0.10] rounded-2xl p-5">
            <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
              Betroffen ist nur, wer über den Grenzen verdient — für alle anderen ändert sich durch
              die Anhebung nichts. Oberhalb beider Grenzen wächst die Bemessungsgrundlage um{" "}
              {eur(deltaKvPv)} bei Kranken- und Pflegeversicherung und um {eur(deltaRvAlv)} bei Rente
              und Arbeitslosenversicherung.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-white border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs text-black/50 mb-1">Mehrbeitrag KV/PV</div>
                <div className="text-xl font-extrabold text-[#16181D] tabular-nums">{formatEUR(mehrKvPv)}</div>
                <div className="text-xs text-black/50 mt-1">im Jahr</div>
              </div>
              <div className="bg-white border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs text-black/50 mb-1">Mehrbeitrag RV/ALV</div>
                <div className="text-xl font-extrabold text-[#16181D] tabular-nums">{formatEUR(mehrRvAlv)}</div>
                <div className="text-xs text-black/50 mt-1">im Jahr</div>
              </div>
              <div className="bg-white border border-[#E60A1C]/25 rounded-xl p-4">
                <div className="text-xs text-black/50 mb-1">Zusammen</div>
                <div className="text-xl font-extrabold text-[#E60A1C] tabular-nums">{formatEUR(mehrGesamt)}</div>
                <div className="text-xs text-black/50 mt-1">{formatEUR(mehrGesamt / 12)} im Monat</div>
              </div>
            </div>
            <p className="text-xs text-black/45 mt-4 flex items-start gap-1.5">
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              Arbeitnehmeranteil bei fortgeschriebenen Beitragssätzen 2026 (KV 8,75 %, PV 1,8 %,
              RV 9,3 %, ALV 1,3 %). Die Beitragssätze 2027 regelt der Entwurf nicht — steigen sie,
              fällt die Mehrbelastung höher aus. Der Arbeitgeber trägt noch einmal etwa denselben Betrag.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-4">Passende Rechner</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/brutto-netto-rechner-2027", label: "Brutto-Netto-Rechner 2027", desc: "Steuerreform-Szenarien im Vergleich" },
              { href: "/beitragsbemessungsgrenze-2026", label: "Beitragsbemessungsgrenze 2026", desc: "Die amtlichen Werte im Vergleich" },
              { href: "/private-krankenversicherung-vs-gesetzlich", label: "PKV oder GKV", desc: "Ab der Versicherungspflichtgrenze" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-3 bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 hover:shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                    {l.label}
                  </div>
                  <div className="text-xs text-black/50 mt-0.5">{l.desc}</div>
                </div>
                <Wallet2 size={16} className="text-black/30 group-hover:text-[#E60A1C] flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white border border-black/[0.08] rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none px-4 sm:px-5 py-4 font-bold text-[#16181D] text-sm sm:text-base flex items-center justify-between gap-3 hover:bg-black/[0.02]">
                  {f.q}
                  <ChevronRight size={18} className="flex-shrink-0 text-black/35 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 text-sm text-black/70 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
