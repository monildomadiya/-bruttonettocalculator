"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Receipt, Calculator, Info, ChevronDown, ArrowRight, PiggyBank } from "lucide-react";
import {
  calculateNetto,
  einkommensteuerFuerZvE,
  soliBerechnen,
  formatEUR,
  type Steuerklasse,
} from "@/lib/taxCalculator";

const WK_PAUSCHALE = 1230; // Arbeitnehmer-Pauschbetrag 2026

const faqs = [
  { q: "Wie viel Steuern bekomme ich durchschnittlich zurück?", a: "Laut Statistischem Bundesamt erhalten Arbeitnehmer, die eine Steuererklärung abgeben, im Durchschnitt rund 1.100 € zurück. Die tatsächliche Erstattung hängt von Ihrem Einkommen, Ihrer Steuerklasse und Ihren absetzbaren Kosten (Werbungskosten, Sonderausgaben) ab." },
  { q: "Wie entsteht eine Steuerrückerstattung?", a: "Ihr Arbeitgeber behält die Lohnsteuer nur mit dem pauschalen Arbeitnehmer-Pauschbetrag von 1.230 € ein. Wenn Sie in der Steuererklärung höhere Werbungskosten oder Sonderausgaben nachweisen, sinkt Ihr zu versteuerndes Einkommen — die zu viel gezahlte Steuer bekommen Sie zurück." },
  { q: "Bis wann muss ich die Steuererklärung 2025 abgeben?", a: "Bei Pflichtveranlagung ist die Frist für das Steuerjahr 2025 der 31. Juli 2026 (mit Steuerberater bzw. Lohnsteuerhilfeverein verlängert sich die Frist bis Ende Februar 2027). Eine freiwillige Erklärung können Sie sogar bis zu 4 Jahre rückwirkend abgeben." },
  { q: "Was kann ich alles absetzen?", a: "Zu den häufigsten Werbungskosten zählen Pendlerpauschale, Arbeitsmittel, Homeoffice-Pauschale (6 €/Tag, max. 1.260 €), Fortbildungen und Bewerbungskosten. Sonderausgaben sind z. B. Spenden, Riester-Beiträge oder Kirchensteuer. Handwerker- und Haushaltsdienstleistungen mindern die Steuer sogar direkt zu 20 %." },
  { q: "Ist diese Berechnung verbindlich?", a: "Nein. Der Rechner liefert eine vereinfachte Schätzung Ihrer möglichen Erstattung aus zusätzlichen absetzbaren Kosten und ersetzt keine Steuerberatung. Die genaue Höhe ermittelt das Finanzamt im Steuerbescheid." },
];

export default function SteuerrueckerstattungRechner() {
  const [jahresbrutto, setJahresbrutto] = useState(45000);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [werbungskosten, setWerbungskosten] = useState(1800);
  const [sonderausgaben, setSonderausgaben] = useState(0);
  const [kirche, setKirche] = useState(false);

  const r = useMemo(() => {
    const res = calculateNetto({
      bruttoMonat: jahresbrutto / 12,
      jahr: 2026,
      verheiratet: sk === 3,
      kinderlosUeber23: true,
      kirche,
      steuerklasse: sk,
    });
    const zvE0 = res.steuer.zvE; // zvE wie einbehalten (WK-Pauschale 1.230 € bereits enthalten)
    // Nur Werbungskosten ÜBER der Pauschale senken das zvE zusätzlich; Sonderausgaben kommen obendrauf.
    const extraWK = Math.max(0, werbungskosten - WK_PAUSCHALE);
    const extraDeductions = extraWK + Math.max(0, sonderausgaben);
    const zvE1 = Math.max(0, zvE0 - extraDeductions);

    const estBefore = einkommensteuerFuerZvE(zvE0, sk);
    const estAfter = einkommensteuerFuerZvE(zvE1, sk);
    const refundESt = Math.max(0, estBefore - estAfter);
    const refundSoli = Math.max(0, soliBerechnen(estBefore, sk === 3) - soliBerechnen(estAfter, sk === 3));
    const refundKirche = kirche ? Math.max(0, (estBefore - estAfter) * 0.09) : 0;
    const refundTotal = refundESt + refundSoli + refundKirche;

    return {
      grenzsteuersatz: res.grenzsteuersatzPct,
      extraDeductions,
      refundESt,
      refundSoli,
      refundKirche,
      refundTotal,
    };
  }, [jahresbrutto, sk, werbungskosten, sonderausgaben, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Receipt size={14} /> Steuererklärung · Erstattung · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Steuerrückerstattung{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel Steuer bekomme ich zurück? Schätzen Sie Ihre mögliche{" "}
            <strong className="text-[#16181D]">Steuererstattung</strong> aus Werbungskosten und Sonderausgaben —
            im Durchschnitt erhalten Arbeitnehmer rund <strong className="text-[#16181D]">1.100 €</strong> zurück.
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
                <label className="block text-sm font-semibold text-black/70 mb-2">Jahresbruttogehalt (€)</label>
                <input type="number" value={jahresbrutto} onChange={(e) => setJahresbrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
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
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Werbungskosten gesamt (€)</label>
                <input type="number" value={werbungskosten} onChange={(e) => setWerbungskosten(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">
                  Fahrtkosten (<Link href="/pendlerpauschale-rechner" className="text-[#E60A1C] font-semibold hover:underline">Pendlerpauschale</Link>),
                  Arbeitsmittel, Homeoffice, Fortbildung … Nur der Teil über 1.230 € wirkt zusätzlich steuermindernd.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Sonderausgaben & Sonstiges (€)</label>
                <input type="number" value={sonderausgaben} onChange={(e) => setSonderausgaben(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Spenden, Riester, außergewöhnliche Belastungen … (über den Pauschalen)</p>
              </div>
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
              <PiggyBank size={22} className="text-[#E60A1C]" /> Ihre geschätzte Erstattung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Schätzung — keine Steuerberatung
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Mögliche Steuerrückerstattung</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.refundTotal)}</div>
              <div className="text-xs text-black/50 mt-2">
                aus {formatEUR(r.extraDeductions)} zusätzlich absetzbaren Kosten · Grenzsteuersatz ca. {r.grenzsteuersatz.toFixed(0)} %
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Einkommensteuer</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.refundESt)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Solidaritätszuschlag</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.refundSoli)}</span>
              </div>
              {kirche && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                  <span className="text-black/70 text-sm font-medium">Kirchensteuer</span>
                  <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.refundKirche)}</span>
                </div>
              )}
            </div>
            <Link href="/gehaltsrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Netto-Gehalt berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Steuererklärung 2025/2026: So holen Sie Ihre Erstattung</h2>
          <p>
            Die meisten Arbeitnehmer bekommen mit der <strong className="text-[#16181D]">Steuererklärung</strong> Geld
            zurück — im Schnitt rund <strong className="text-[#16181D]">1.100 €</strong> (Statistisches Bundesamt). Der
            Grund: Ihr Arbeitgeber zieht die Lohnsteuer nur mit dem pauschalen Arbeitnehmer-Pauschbetrag von
            <strong className="text-[#16181D]"> 1.230 €</strong> ab. Alles, was Sie darüber hinaus an
            <strong className="text-[#16181D]"> Werbungskosten</strong> und <strong className="text-[#16181D]">Sonderausgaben</strong>
            nachweisen, senkt Ihr zu versteuerndes Einkommen — und die zu viel gezahlte Steuer wird erstattet.
          </p>
          <p>
            Wie hoch die Erstattung ausfällt, hängt von Ihrem persönlichen{" "}
            <Link href="/lohnsteuerrechner" className="text-[#E60A1C] font-semibold hover:underline">Grenzsteuersatz</Link> ab:
            Bei 30 % Grenzsteuersatz bringen 1.000 € zusätzliche Werbungskosten rund 300 € zurück. Typische Posten sind
            die <Link href="/pendlerpauschale-rechner" className="text-[#E60A1C] font-semibold hover:underline">Pendlerpauschale</Link>,
            Arbeitsmittel, die Homeoffice-Pauschale (6 €/Tag, max. 1.260 €), Fortbildungen und Bewerbungskosten.
          </p>
          <p>
            <strong className="text-[#16181D]">Fristen:</strong> Die Pflicht-Steuererklärung 2025 ist bis zum
            31. Juli 2026 abzugeben; mit Steuerberater oder Lohnsteuerhilfeverein bis Ende Februar 2027. Eine
            freiwillige Erklärung lohnt sich fast immer und ist bis zu 4 Jahre rückwirkend möglich. Prüfen Sie auch
            einen <Link href="/steuerklassenwechsel-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassenwechsel</Link>,
            wenn Sie verheiratet sind.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Steuerrückerstattung</h2>
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
