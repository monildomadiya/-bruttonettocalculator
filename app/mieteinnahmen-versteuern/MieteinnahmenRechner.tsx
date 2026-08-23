"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home, Calculator, ArrowRight, Info, ChevronDown, TrendingDown } from "lucide-react";
import { calculateNetto, estFormel2026, soliBerechnen, formatEUR } from "@/lib/taxCalculator";

/**
 * AfA-Sätze für Wohngebäude im Privatvermögen (§ 7 Abs. 4 EStG). Der Satz
 * richtet sich nach dem Jahr der Fertigstellung, nicht nach dem Kaufjahr.
 */
const AFA_OPTIONEN = [
  { key: "ab2023", satz: 0.03, label: "Fertigstellung ab 2023 — 3,0 %" },
  { key: "1925bis2022", satz: 0.02, label: "Fertigstellung 1925–2022 — 2,0 %" },
  { key: "vor1925", satz: 0.025, label: "Fertigstellung vor 1925 — 2,5 %" },
] as const;

type AfaKey = (typeof AFA_OPTIONEN)[number]["key"];

const faqs = [
  {
    q: "Wie werden Mieteinnahmen versteuert?",
    a: "Mieteinnahmen zählen zu den Einkünften aus Vermietung und Verpachtung (§ 21 EStG). Versteuert wird nicht die Miete selbst, sondern der Überschuss: Mieteinnahmen minus Werbungskosten. Dieser Überschuss wird Ihrem übrigen Einkommen hinzugerechnet und mit Ihrem persönlichen Steuersatz belastet — es gibt keinen gesonderten Steuersatz für Mieteinnahmen.",
  },
  {
    q: "Ab welcher Höhe muss ich Mieteinnahmen versteuern?",
    a: "Es gibt keinen eigenen Freibetrag für Mieteinnahmen. Steuer fällt an, sobald Ihr gesamtes zu versteuerndes Einkommen über dem Grundfreibetrag liegt (2026: 12.348 € für Alleinstehende). Angeben müssen Sie die Einkünfte in der Anlage V grundsätzlich immer. Eine Ausnahme gilt nur für die vorübergehende Vermietung einzelner Räume in der selbst bewohnten Wohnung: Bleiben die Einnahmen unter 520 € im Jahr, verzichtet die Finanzverwaltung auf den Ansatz (R 21.2 Abs. 1 EStR).",
  },
  {
    q: "Welche Kosten kann ich von den Mieteinnahmen absetzen?",
    a: "Absetzbar sind alle Werbungskosten, die durch die Vermietung veranlasst sind: die Gebäudeabschreibung (AfA), Schuldzinsen aus der Finanzierung, Grundsteuer, Verwaltungs- und Kontoführungskosten, nicht umlagefähiges Hausgeld, Instandhaltung und Reparaturen, Versicherungen, Fahrtkosten zum Objekt sowie Makler- und Inseratskosten bei Neuvermietung.",
  },
  {
    q: "Kann ich die Kredittilgung von der Steuer absetzen?",
    a: "Nein. Absetzbar sind ausschließlich die Zinsen, nicht der Tilgungsanteil. Die Tilgung ist steuerlich reine Vermögensumschichtung: Sie tauschen Bankschulden gegen Eigentum. Prüfen Sie deshalb Ihren Kontoauszug oder den Tilgungsplan — nur der Zinsanteil gehört in die Anlage V.",
  },
  {
    q: "Wie hoch ist die Abschreibung (AfA) auf eine vermietete Immobilie?",
    a: "Für Wohngebäude im Privatvermögen gilt: 3 % jährlich bei Fertigstellung ab 2023, 2 % bei Fertigstellung zwischen 1925 und 2022 und 2,5 % bei Fertigstellung vor 1925 (§ 7 Abs. 4 EStG). Wichtig: Abgeschrieben wird nur der Gebäudeanteil des Kaufpreises — der Grund und Boden nutzt sich nicht ab und bleibt außen vor.",
  },
  {
    q: "Wie teile ich den Kaufpreis in Gebäude und Grundstück auf?",
    a: "Maßgeblich ist das Verhältnis der Verkehrswerte. Als grobe Orientierung wird oft ein Grundstücksanteil von 20 % angesetzt, in Ballungsräumen liegt er aber deutlich höher. Das Bundesfinanzministerium stellt dafür eine offizielle Arbeitshilfe zur Kaufpreisaufteilung bereit; steht im Kaufvertrag eine sachgerechte Aufteilung, erkennt das Finanzamt diese in der Regel an.",
  },
  {
    q: "Was passiert, wenn ich Verluste aus Vermietung mache?",
    a: "Übersteigen die Werbungskosten die Mieteinnahmen, entsteht ein Verlust aus Vermietung und Verpachtung. Dieser wird mit Ihren übrigen Einkünften — etwa dem Arbeitslohn — verrechnet und senkt Ihre Steuerlast. Gerade in den ersten Jahren nach dem Kauf ist das durch hohe Zinsen und Renovierungskosten häufig der Fall. Voraussetzung ist eine erkennbare Absicht, langfristig einen Überschuss zu erzielen.",
  },
  {
    q: "Was gilt bei vergünstigter Vermietung an Angehörige?",
    a: "Beträgt die Miete mindestens 66 % der ortsüblichen Marktmiete, bleiben die Werbungskosten voll abziehbar. Liegt sie unter 50 %, wird die Vermietung in einen entgeltlichen und einen unentgeltlichen Teil aufgeteilt — die Kosten sind dann nur anteilig absetzbar. Zwischen 50 % und 66 % verlangt das Finanzamt eine Totalüberschussprognose (§ 21 Abs. 2 EStG).",
  },
];

export default function MieteinnahmenRechner({ content }: { content?: React.ReactNode }) {
  const [monatsmiete, setMonatsmiete] = useState(1100);
  const [kaufpreis, setKaufpreis] = useState(300000);
  const [grundstuecksanteil, setGrundstuecksanteil] = useState(20);
  const [afaKey, setAfaKey] = useState<AfaKey>("1925bis2022");
  const [zinsen, setZinsen] = useState(3500);
  const [sonstigeKosten, setSonstigeKosten] = useState(2000);
  const [bruttoMonat, setBruttoMonat] = useState(4000);
  const [verheiratet, setVerheiratet] = useState(false);

  const result = useMemo(() => {
    const mieteJahr = Math.max(0, monatsmiete) * 12;

    // AfA: nur der Gebäudeanteil ist abschreibbar (§ 7 Abs. 4 EStG).
    const gebaeudewert = Math.max(0, kaufpreis) * (1 - Math.min(100, Math.max(0, grundstuecksanteil)) / 100);
    const afaSatz = AFA_OPTIONEN.find((o) => o.key === afaKey)?.satz ?? 0.02;
    const afa = gebaeudewert * afaSatz;

    const werbungskosten = afa + Math.max(0, zinsen) + Math.max(0, sonstigeKosten);
    const ueberschuss = mieteJahr - werbungskosten; // kann negativ sein (Verlust)

    // Persönlicher Steuersatz: zvE aus dem Arbeitslohn, dann Differenzmethode.
    const lohn = calculateNetto({
      bruttoMonat: Math.max(0, bruttoMonat),
      jahr: 2026,
      verheiratet,
      kinderlosUeber23: false,
      kirche: false,
      steuerklasse: verheiratet ? 3 : 1,
    });

    const zvEOhne = lohn.steuer.zvE;
    const zvEMit = Math.max(0, zvEOhne + ueberschuss);

    const estFuer = (zvE: number) =>
      verheiratet ? 2 * estFormel2026(Math.max(0, zvE) / 2) : estFormel2026(Math.max(0, zvE));

    const estOhne = estFuer(zvEOhne);
    const estMit = estFuer(zvEMit);
    const steuer =
      estMit + soliBerechnen(estMit, verheiratet) - (estOhne + soliBerechnen(estOhne, verheiratet));

    // Grenzsteuersatz am oberen Rand des Mietüberschusses.
    const grenzsteuersatz = ueberschuss !== 0 ? (steuer / ueberschuss) * 100 : 0;
    const nettoMiete = mieteJahr - werbungskosten - steuer;

    return {
      mieteJahr,
      gebaeudewert,
      afa,
      werbungskosten,
      ueberschuss,
      steuer,
      grenzsteuersatz,
      nettoMiete,
      istVerlust: ueberschuss < 0,
    };
  }, [
    monatsmiete,
    kaufpreis,
    grundstuecksanteil,
    afaKey,
    zinsen,
    sonstigeKosten,
    bruttoMonat,
    verheiratet,
  ]);

  const inputClass =
    "w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none";
  const labelClass = "block text-sm font-semibold text-black/70 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Home size={14} />
            Vermietung &amp; Verpachtung · § 21 EStG
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Mieteinnahmen versteuern:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Steuer auf Mieteinnahmen berechnen
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Versteuert wird nicht die Miete, sondern der <strong className="text-[#16181D]">Überschuss</strong> nach
            Abzug von Abschreibung, Zinsen und laufenden Kosten. Der Rechner zeigt, wie viel Steuer auf Ihre
            Mieteinnahmen anfällt — und was netto bleibt.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Immobilie
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="mv-miete" className={labelClass}>
                  Kaltmiete pro Monat (€)
                </label>
                <input
                  id="mv-miete"
                  type="number"
                  step="10"
                  value={monatsmiete}
                  onChange={(e) => setMonatsmiete(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mv-kaufpreis" className={labelClass}>
                    Kaufpreis (€)
                  </label>
                  <input
                    id="mv-kaufpreis"
                    type="number"
                    step="5000"
                    value={kaufpreis}
                    onChange={(e) => setKaufpreis(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="mv-grund" className={labelClass}>
                    Grundstücksanteil (%)
                  </label>
                  <input
                    id="mv-grund"
                    type="number"
                    step="5"
                    min={0}
                    max={100}
                    value={grundstuecksanteil}
                    onChange={(e) => setGrundstuecksanteil(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mv-afa" className={labelClass}>
                  Abschreibung (AfA-Satz)
                </label>
                <select
                  id="mv-afa"
                  value={afaKey}
                  onChange={(e) => setAfaKey(e.target.value as AfaKey)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {AFA_OPTIONEN.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mv-zinsen" className={labelClass}>
                    Schuldzinsen / Jahr (€)
                  </label>
                  <input
                    id="mv-zinsen"
                    type="number"
                    step="100"
                    value={zinsen}
                    onChange={(e) => setZinsen(Number(e.target.value))}
                    className={inputClass}
                  />
                  <p className="text-xs text-black/50 mt-1.5">Nur Zinsen — ohne Tilgung.</p>
                </div>
                <div>
                  <label htmlFor="mv-sonstige" className={labelClass}>
                    Sonstige Kosten / Jahr (€)
                  </label>
                  <input
                    id="mv-sonstige"
                    type="number"
                    step="100"
                    value={sonstigeKosten}
                    onChange={(e) => setSonstigeKosten(Number(e.target.value))}
                    className={inputClass}
                  />
                  <p className="text-xs text-black/50 mt-1.5">Grundsteuer, Hausgeld, Reparaturen …</p>
                </div>
              </div>

              <div className="border-t border-black/[0.08] pt-5">
                <label htmlFor="mv-brutto" className={labelClass}>
                  Ihr Bruttogehalt pro Monat (€)
                </label>
                <input
                  id="mv-brutto"
                  type="number"
                  step="100"
                  value={bruttoMonat}
                  onChange={(e) => setBruttoMonat(Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-black/50 mt-1.5">
                  Bestimmt Ihren persönlichen Steuersatz — Mieteinnahmen werden oben draufgerechnet.
                </p>
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={verheiratet}
                    onChange={(e) => setVerheiratet(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                  />
                  Verheiratet (Splittingtarif)
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Home size={22} className="text-[#E60A1C]" />
              Ihre Steuer auf Mieteinnahmen
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Mieteinnahmen / Jahr</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.mieteJahr)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Abschreibung (AfA)</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.afa)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Zinsen &amp; sonstige Kosten</span>
                <span className="text-lg font-extrabold text-[#16181D]">
                  − {formatEUR(result.werbungskosten - result.afa)}
                </span>
              </div>

              <div
                className={`flex items-center justify-between rounded-xl px-5 py-4 border ${
                  result.istVerlust
                    ? "bg-blue-50 border-blue-500/25"
                    : "bg-black/[0.04] border-black/[0.08]"
                }`}
              >
                <span className="text-black/80 text-sm font-semibold">
                  {result.istVerlust ? "Verlust aus Vermietung" : "Zu versteuernder Überschuss"}
                </span>
                <span className={`text-lg font-extrabold ${result.istVerlust ? "text-blue-600" : "text-[#16181D]"}`}>
                  {formatEUR(result.ueberschuss)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">
                  {result.istVerlust ? "Steuerersparnis" : "Steuer auf Mieteinnahmen"}
                </span>
                <span
                  className={`text-2xl font-extrabold ${result.istVerlust ? "text-emerald-600" : "text-[#16181D]"}`}
                >
                  {result.istVerlust ? "+ " : ""}
                  {formatEUR(Math.abs(result.steuer))}
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Einkünfte nach Steuern / Jahr</span>
                <span className="text-lg font-extrabold text-emerald-600">{formatEUR(result.nettoMiete)}</span>
              </div>
              <p className="text-xs text-black/50 px-1">
                Steuerliches Ergebnis, nicht Ihr Kontostand: Die AfA von {formatEUR(result.afa)} mindert die
                Steuer, kostet Sie aber kein Geld. Umgekehrt ist die Kredittilgung ein Abfluss, der
                steuerlich nicht zählt.
              </p>

              {result.istVerlust ? (
                <div className="flex items-start gap-2 text-xs text-blue-700/80 bg-blue-50 border border-blue-500/20 rounded-xl px-4 py-3">
                  <TrendingDown size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    Der Verlust wird mit Ihrem Arbeitslohn verrechnet und senkt Ihre Einkommensteuer um den
                    angezeigten Betrag.
                  </span>
                </div>
              ) : (
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Effektive Steuerbelastung des Überschusses</div>
                  <div className="text-lg font-extrabold text-[#16181D]">
                    {result.grenzsteuersatz.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/einkommensteuer-rechner"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Einkommensteuer-Rechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content */}
      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zur Steuer auf Mieteinnahmen
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
