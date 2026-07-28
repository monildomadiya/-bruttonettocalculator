"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PiggyBank, Calculator, Info, ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { calculateNetto, formatEUR, BAV_2026, type Steuerklasse } from "@/lib/taxCalculator";

const SV_FREI_MONAT = (BAV_2026.bbgRvJahr * BAV_2026.svFreiProzent) / 12;   // 338 €/Monat (2026)
const STEUER_FREI_MONAT = (BAV_2026.bbgRvJahr * BAV_2026.steuerFreiProzent) / 12; // 676 €/Monat (2026)

const faqs = [
  { q: "Was ist eine Entgeltumwandlung (bAV)?", a: "Bei der Entgeltumwandlung wandeln Sie einen Teil Ihres Bruttogehalts in einen Beitrag zur betrieblichen Altersvorsorge um. Weil dieser Teil steuer- und sozialabgabenfrei ist (in den Grenzen), sinkt Ihr Nettogehalt deutlich weniger als der eingezahlte Betrag — der Staat fördert Ihre Vorsorge mit." },
  { q: "Wie viel darf ich steuer- und abgabenfrei einzahlen?", a: "2026 sind Beiträge bis 8 % der Beitragsbemessungsgrenze RV (101.400 €) steuerfrei — das sind 676 €/Monat. Sozialabgabenfrei sind 4 %, also 338 €/Monat. Bis 338 € sparen Sie sowohl Steuern als auch Sozialabgaben; dieser Rechner rechnet in diesem voll geförderten Bereich." },
  { q: "Muss mein Arbeitgeber etwas dazugeben?", a: "Ja. Für Entgeltumwandlungen seit 2022 muss der Arbeitgeber 15 % Zuschuss zahlen, soweit er selbst Sozialabgaben spart. Auf einen Beitrag von 100 € kommen also mindestens 15 € vom Arbeitgeber obendrauf." },
  { q: "Hat die bAV auch Nachteile?", a: "Da Ihr sozialversicherungspflichtiges Brutto sinkt, fallen Ihre gesetzliche Rente und ggf. Kranken-/Arbeitslosengeld minimal geringer aus. In der Auszahlungsphase sind bAV-Renten außerdem steuer- und kranken­versicherungspflichtig. Für die meisten überwiegt dennoch die hohe Förderung in der Ansparphase." },
];

export default function BavRechner() {
  const [bruttoMonat, setBruttoMonat] = useState(3500);
  const [beitrag, setBeitrag] = useState(100);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kinderlos, setKinderlos] = useState(true);
  const [kirche, setKirche] = useState(false);

  const r = useMemo(() => {
    const beitragEff = Math.min(Math.max(0, beitrag), SV_FREI_MONAT);
    const common = {
      jahr: 2026 as const,
      verheiratet: sk === 3,
      kinderlosUeber23: kinderlos,
      kirche,
      steuerklasse: sk,
    };
    const nettoOhne = calculateNetto({ bruttoMonat, ...common }).nettoMonat;
    const nettoMit = calculateNetto({ bruttoMonat: Math.max(0, bruttoMonat - beitragEff), ...common }).nettoMonat;
    const nettoEinbusse = Math.max(0, nettoOhne - nettoMit); // tatsächlicher Netto-Aufwand
    const foerderung = Math.max(0, beitragEff - nettoEinbusse); // gesparte Steuern + Sozialabgaben
    const foerderquote = beitragEff > 0 ? (foerderung / beitragEff) * 100 : 0;
    const agZuschuss = beitragEff * 0.15; // gesetzlicher Mindestzuschuss
    const inVorsorge = beitragEff + agZuschuss; // was monatlich anspart
    return { beitragEff, nettoEinbusse, foerderung, foerderquote, agZuschuss, inVorsorge };
  }, [bruttoMonat, beitrag, sk, kinderlos, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <PiggyBank size={14} /> bAV · Entgeltumwandlung · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            bAV-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Entgeltumwandlung</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel <strong className="text-[#16181D]">Netto</strong> kostet Sie Ihre betriebliche Altersvorsorge
            wirklich? Berechnen Sie, wie stark Steuer- und Sozialabgaben-Ersparnis den Aufwand einer
            <strong className="text-[#16181D]"> Entgeltumwandlung</strong> senken — inklusive 15 % Arbeitgeberzuschuss.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt pro Monat (€)</label>
                <input type="number" value={bruttoMonat} onChange={(e) => setBruttoMonat(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">bAV-Beitrag pro Monat (€)</label>
                <input type="number" value={beitrag} onChange={(e) => setBeitrag(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">
                  Voll gefördert (steuer- & abgabenfrei) bis {formatEUR(SV_FREI_MONAT)}/Monat (4 % der BBG 2026).
                  {beitrag > SV_FREI_MONAT && (
                    <span className="text-amber-600 font-semibold"> Höhere Beträge werden auf diesen Wert begrenzt.</span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                <select value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none">
                  <option value={1}>I — Alleinstehend</option>
                  <option value={2}>II — Alleinerziehend</option>
                  <option value={3}>III — Verheiratet (höheres Einkommen)</option>
                  <option value={4}>IV — Verheiratet (gleiches Einkommen)</option>
                  <option value={5}>V — Verheiratet (geringeres Einkommen)</option>
                  <option value={6}>VI — Zweitjob</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)}
                  className="w-5 h-5 accent-[#E60A1C]" />
                <span className="text-sm font-semibold text-black/70">Kinderlos & über 23 (Pflege +0,6 %)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)}
                  className="w-5 h-5 accent-[#E60A1C]" />
                <span className="text-sm font-semibold text-black/70">Kirchensteuerpflichtig (9 %)</span>
              </label>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <TrendingUp size={22} className="text-[#E60A1C]" /> Ihr Ergebnis
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuer-/Anlageberatung
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Ihr Netto sinkt nur um</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.nettoEinbusse)}</div>
              <div className="text-xs text-black/50 mt-2">
                für {formatEUR(r.beitragEff)} bAV-Beitrag · {r.foerderquote.toFixed(0)} % übernimmt der Staat
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Steuer- & Abgabenersparnis</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.foerderung)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">+ Arbeitgeberzuschuss (15 %)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.agZuschuss)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/[0.06] border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Monatlich in Ihre Altersvorsorge</span>
                <span className="text-2xl font-mono font-extrabold text-[#E60A1C]">{formatEUR(r.inVorsorge)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                {formatEUR(r.inVorsorge)} fließen in Ihre Vorsorge — kosten Sie netto aber nur {formatEUR(r.nettoEinbusse)}.
              </p>
            </div>
            <Link href="/rentenrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Zum Rentenrechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Entgeltumwandlung 2026: So viel bringt die bAV</h2>
          <p>
            Bei der <strong className="text-[#16181D]">betrieblichen Altersvorsorge (bAV)</strong> per
            <strong className="text-[#16181D]"> Entgeltumwandlung</strong> zahlen Sie aus dem Bruttogehalt in einen
            Vorsorgevertrag ein. Weil der Beitrag <strong className="text-[#16181D]">steuer- und sozialabgabenfrei</strong> ist,
            reduziert er Ihr Nettogehalt spürbar weniger als die eingezahlte Summe: Aus 100 € Beitrag werden je nach
            Steuersatz oft nur 50–60 € echter Netto-Aufwand.
          </p>
          <p>
            2026 sind Beiträge bis <strong className="text-[#16181D]">8 % der Beitragsbemessungsgrenze RV</strong>
            (101.400 €) steuerfrei — {formatEUR(STEUER_FREI_MONAT)}/Monat — und bis
            <strong className="text-[#16181D]"> 4 % ({formatEUR(SV_FREI_MONAT)}/Monat) sozialabgabenfrei</strong>. Dieser
            Rechner arbeitet im voll geförderten 4 %-Bereich. Zusätzlich muss Ihr Arbeitgeber seit 2022 mindestens
            <strong className="text-[#16181D]"> 15 % Zuschuss</strong> geben.
          </p>
          <p>
            Zu beachten: Da Ihr sozialversicherungspflichtiges Brutto sinkt, fällt Ihre{" "}
            <Link href="/rentenrechner" className="text-[#E60A1C] font-semibold hover:underline">gesetzliche Rente</Link> minimal
            geringer aus, und die bAV-Rente ist später steuer- und krankenversicherungspflichtig. Prüfen Sie parallel Ihr{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Nettogehalt</Link> und den
            möglichen <Link href="/steuerrueckerstattung-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuervorteil</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur bAV / Entgeltumwandlung</h2>
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
    </div>
  );
}
