"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Timer, Calculator, ArrowRight, Info, ChevronDown, Moon } from "lucide-react";
import { calculateNetto, formatEUR, BBG_2026 } from "@/lib/taxCalculator";

/** Arbeitnehmer-Anteil an der Sozialversicherung, zusammen 21,15 %. */
const SV_SATZ_AN =
  BBG_2026.anSatzKv + BBG_2026.anSatzPv + BBG_2026.anSatzRv + BBG_2026.anSatzAlv;

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

/**
 * Steuerfreie Zuschlagssätze nach § 3b EStG. Der Zuschlag ist steuerfrei,
 * soweit er diese Prozentsätze des Grundlohns nicht übersteigt — die
 * Überstunde selbst bleibt in jedem Fall voll steuerpflichtig.
 */
const ZUSCHLAEGE = [
  { key: "keiner", label: "Keine Zuschläge", satz: 0 },
  { key: "nacht", label: "Nachtarbeit 20–6 Uhr (25 %)", satz: 0.25 },
  { key: "nachtErhoeht", label: "Nachtarbeit 0–4 Uhr (40 %)", satz: 0.4 },
  { key: "sonntag", label: "Sonntagsarbeit (50 %)", satz: 0.5 },
  { key: "feiertag", label: "Feiertagsarbeit (125 %)", satz: 1.25 },
  { key: "weihnachten", label: "24.12. ab 14 Uhr, 25./26.12., 1.5. (150 %)", satz: 1.5 },
] as const;

type ZuschlagKey = (typeof ZUSCHLAEGE)[number]["key"];

/** § 3b EStG: Zuschläge sind nur bis zu diesem Grundlohn steuerfrei. */
const GRUNDLOHNGRENZE_STEUER = 50;
/** SvEV: sozialversicherungsfrei bleiben Zuschläge nur bis 25 € Grundlohn. */
const GRUNDLOHNGRENZE_SV = 25;

const faqs = [
  {
    q: "Wie werden ausgezahlte Überstunden versteuert?",
    a: "Ausgezahlte Überstunden sind normaler laufender Arbeitslohn. Sie werden zusammen mit dem Monatsgehalt versteuert und voll verbeitragt — es gibt keine Sonderregel und keinen ermäßigten Steuersatz. Weil das Monatsbrutto dadurch steigt, greift auf den zusätzlichen Betrag Ihr Grenzsteuersatz. Genau deshalb bleibt von der Auszahlung oft weniger übrig als erwartet.",
  },
  {
    q: "Sind Überstunden steuerfrei?",
    a: "Die Überstunde selbst nie. Steuerfrei sein können nur Zuschläge für Nacht-, Sonntags- und Feiertagsarbeit nach § 3b EStG — und auch nur bis zu bestimmten Prozentsätzen des Grundlohns. Wer also nachts oder sonntags Überstunden macht, bekommt den Grundlohn versteuert und den Zuschlag in den Grenzen des § 3b steuerfrei.",
  },
  {
    q: "Wie hoch sind die steuerfreien Zuschläge?",
    a: "25 % für Nachtarbeit zwischen 20 und 6 Uhr, 40 % für Nachtarbeit zwischen 0 und 4 Uhr bei vor Mitternacht begonnener Arbeit, 50 % für Sonntagsarbeit, 125 % für gesetzliche Feiertage und 150 % für den 24.12. ab 14 Uhr, den 25. und 26.12. sowie den 1. Mai. Maßgeblich ist jeweils der Grundlohn pro Stunde.",
  },
  {
    q: "Gibt es eine Obergrenze für steuerfreie Zuschläge?",
    a: "Ja, gleich zwei. Steuerfrei bleiben Zuschläge nur, soweit der Grundlohn 50 € pro Stunde nicht übersteigt (§ 3b Abs. 2 EStG). Beitragsfrei in der Sozialversicherung sind sie sogar nur bis zu einem Grundlohn von 25 € pro Stunde. Wer mehr verdient, zahlt auf den übersteigenden Teil Beiträge, obwohl der Zuschlag steuerfrei bleibt.",
  },
  {
    q: "Ist Auszahlung oder Freizeitausgleich günstiger?",
    a: "Rein finanziell fast immer der Freizeitausgleich. Bei der Auszahlung gehen je nach Steuerklasse rund 30 bis 45 Prozent an Steuern und Sozialabgaben ab. Beim Freizeitausgleich bekommen Sie die Zeit ungekürzt zurück — steuerlich passiert nichts, weil kein zusätzlicher Arbeitslohn entsteht.",
  },
  {
    q: "Muss mein Arbeitgeber Überstunden auszahlen?",
    a: "Nicht automatisch. Ob Überstunden ausgezahlt oder in Freizeit ausgeglichen werden, richtet sich nach Arbeitsvertrag, Betriebsvereinbarung oder Tarifvertrag. Pauschalklauseln wie „mit dem Gehalt sind alle Überstunden abgegolten“ sind bei normalen Gehältern häufig unwirksam — bei Besserverdienern über der Beitragsbemessungsgrenze hat die Rechtsprechung sie dagegen teilweise akzeptiert.",
  },
];

export default function UeberstundenRechner({ content }: { content?: React.ReactNode }) {
  const [brutto, setBrutto] = useState(3500);
  const [wochenstunden, setWochenstunden] = useState(40);
  const [ueberstunden, setUeberstunden] = useState(20);
  const [zuschlagKey, setZuschlagKey] = useState<ZuschlagKey>("keiner");
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(() => {
    const monatsStunden = (wochenstunden * 52) / 12;
    const grundlohn = monatsStunden > 0 ? brutto / monatsStunden : 0;

    const zuschlagSatz = ZUSCHLAEGE.find((z) => z.key === zuschlagKey)?.satz ?? 0;
    const stunden = Math.max(0, ueberstunden);

    // Grundvergütung der Überstunden — immer voll steuer- und beitragspflichtig.
    const grundverguetung = grundlohn * stunden;

    // Zuschlag: steuerfrei nur bis 50 € Grundlohn, beitragsfrei nur bis 25 €.
    const zuschlagGesamt = grundlohn * zuschlagSatz * stunden;
    const steuerfreierZuschlag =
      Math.min(grundlohn, GRUNDLOHNGRENZE_STEUER) * zuschlagSatz * stunden;
    const steuerpflichtigerZuschlag = Math.max(0, zuschlagGesamt - steuerfreierZuschlag);
    const beitragsfreierZuschlag = Math.min(grundlohn, GRUNDLOHNGRENZE_SV) * zuschlagSatz * stunden;

    const bruttoZusatzSteuerpflichtig = grundverguetung + steuerpflichtigerZuschlag;

    // Differenzmethode: Netto mit und ohne die steuerpflichtige Zusatzvergütung.
    const basis = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });
    const mit = calculateNetto({
      bruttoMonat: brutto + bruttoZusatzSteuerpflichtig,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const nettoZuwachsVersteuert = mit.nettoMonat - basis.nettoMonat;

    // Die beiden Grenzen fallen auseinander: Zwischen 25 € und 50 € Grundlohn
    // ist der Zuschlag zwar steuerfrei, aber beitragspflichtig. Dieser Teil
    // fließt also netto abzüglich der Arbeitnehmer-Sozialabgaben zu — nur der
    // beitragsfreie Teil kommt ungekürzt an.
    const steuerfreiAberBeitragspflichtig = Math.max(
      0,
      steuerfreierZuschlag - beitragsfreierZuschlag
    );
    const zuschlagNetto =
      beitragsfreierZuschlag + steuerfreiAberBeitragspflichtig * (1 - SV_SATZ_AN);
    const nettoGesamt = nettoZuwachsVersteuert + zuschlagNetto;

    const bruttoGesamt = grundverguetung + zuschlagGesamt;
    const abzuege = bruttoGesamt - nettoGesamt;
    const abzugsquote = bruttoGesamt > 0 ? (abzuege / bruttoGesamt) * 100 : 0;
    const nettoProStunde = stunden > 0 ? nettoGesamt / stunden : 0;

    return {
      grundlohn,
      grundverguetung,
      zuschlagGesamt,
      steuerfreierZuschlag,
      bruttoGesamt,
      nettoGesamt,
      abzuege,
      abzugsquote,
      nettoProStunde,
      ueberGrenzeSv: grundlohn > GRUNDLOHNGRENZE_SV && zuschlagSatz > 0,
      ueberGrenzeSteuer: grundlohn > GRUNDLOHNGRENZE_STEUER && zuschlagSatz > 0,
    };
  }, [brutto, wochenstunden, ueberstunden, zuschlagKey, steuerklasse, kirche]);

  const inputClass =
    "w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none";
  const labelClass = "block text-sm font-semibold text-black/70 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Timer size={14} />
            Überstunden netto 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Überstunden auszahlen:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Was bleibt netto übrig?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie, wie viel von Ihren ausgezahlten Überstunden nach Steuern und Sozialabgaben
            ankommt — inklusive der <strong className="text-[#16181D]">steuerfreien Zuschläge</strong> für
            Nacht-, Sonntags- und Feiertagsarbeit nach § 3b EStG.
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
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ue-brutto" className={labelClass}>
                    Bruttogehalt / Monat (€)
                  </label>
                  <input
                    id="ue-brutto"
                    type="number"
                    step="50"
                    value={brutto}
                    onChange={(e) => setBrutto(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="ue-wochenstunden" className={labelClass}>
                    Wochenstunden
                  </label>
                  <input
                    id="ue-wochenstunden"
                    type="number"
                    step="1"
                    value={wochenstunden}
                    onChange={(e) => setWochenstunden(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ue-stunden" className={labelClass}>
                  Auszuzahlende Überstunden
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="ue-stunden"
                    type="range"
                    min={0}
                    max={100}
                    value={ueberstunden}
                    onChange={(e) => setUeberstunden(Number(e.target.value))}
                    className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                  />
                  <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-4 py-2 text-[#E60A1C] font-bold text-lg w-20 text-center">
                    {ueberstunden}h
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="ue-zuschlag" className={labelClass}>
                  Zuschlag (§ 3b EStG)
                </label>
                <select
                  id="ue-zuschlag"
                  value={zuschlagKey}
                  onChange={(e) => setZuschlagKey(e.target.value as ZuschlagKey)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {ZUSCHLAEGE.map((z) => (
                    <option key={z.key} value={z.key}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ue-steuerklasse" className={labelClass}>
                    Steuerklasse
                  </label>
                  <select
                    id="ue-steuerklasse"
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>
                        {STEUERKLASSE_INFO[sk]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kirche}
                      onChange={(e) => setKirche(e.target.checked)}
                      className="accent-[#E60A1C] w-4 h-4"
                    />
                    Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Timer size={22} className="text-[#E60A1C]" />
              Ihre Auszahlung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Grundlohn pro Stunde</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.grundlohn)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Grundvergütung Überstunden</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.grundverguetung)}</span>
              </div>
              {result.zuschlagGesamt > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold flex items-center gap-1.5">
                    <Moon size={14} className="text-emerald-600" />
                    davon steuerfreier Zuschlag
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {formatEUR(result.steuerfreierZuschlag)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Brutto gesamt</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.bruttoGesamt)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Steuern &amp; Sozialabgaben</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.abzuege)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto-Auszahlung</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEUR(result.nettoGesamt)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Netto pro Überstunde</div>
                  <div className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.nettoProStunde)}</div>
                </div>
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Abzugsquote</div>
                  <div className="text-lg font-extrabold text-[#16181D]">
                    {result.abzugsquote.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
              </div>

              {result.ueberGrenzeSv && (
                <p className="text-xs text-amber-700/90 bg-amber-50 border border-amber-500/20 rounded-xl px-4 py-3">
                  Ihr Grundlohn liegt über {GRUNDLOHNGRENZE_SV} € pro Stunde. Der Zuschlag bleibt steuerfrei
                  {result.ueberGrenzeSteuer ? " nur bis 50 € Grundlohn" : ""}, ist aber oberhalb von{" "}
                  {GRUNDLOHNGRENZE_SV} € nicht mehr beitragsfrei in der Sozialversicherung.
                </p>
              )}
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Vollständigen Brutto-Netto-Rechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zu Überstunden
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
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
