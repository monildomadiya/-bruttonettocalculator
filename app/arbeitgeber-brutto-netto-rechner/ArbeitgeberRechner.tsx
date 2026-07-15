"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Calculator, ArrowRight, Info, ChevronDown, Wallet, Users } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import {
  calculateNetto,
  calculateArbeitgeberkosten,
  formatEUR,
} from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

const faqs = [
  {
    q: "Was ist der Arbeitgeberanteil und wie hoch ist er?",
    a: "Der Arbeitgeberanteil ist der Teil der Sozialversicherungsbeiträge, den der Arbeitgeber zusätzlich zum Bruttogehalt trägt. Er umfasst rund 9,3 % Rentenversicherung, 1,3 % Arbeitslosenversicherung, ca. 8,75 % Krankenversicherung (inkl. halbem Zusatzbeitrag) und 1,7 % Pflegeversicherung. In Summe rund 21 % des Bruttogehalts — hinzu kommen die Umlagen U1/U2/U3.",
  },
  {
    q: "Was bedeutet Arbeitgeberbrutto?",
    a: "Das Arbeitgeberbrutto (auch „Arbeitgeberkosten“ oder „Gesamtkosten“) ist die Summe aus dem Bruttogehalt des Arbeitnehmers und dem Arbeitgeberanteil zur Sozialversicherung. Es zeigt, was ein Mitarbeiter den Betrieb tatsächlich kostet — deutlich mehr als das ausgezahlte Nettogehalt.",
  },
  {
    q: "Warum kostet ein Mitarbeiter mehr als sein Bruttogehalt?",
    a: "Weil der Arbeitgeber auf das Bruttogehalt seinen paritätischen Anteil zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung zahlt sowie die Umlagen U1 (Entgeltfortzahlung), U2 (Mutterschaft) und U3 (Insolvenzgeld). Aus 4.000 € Brutto werden so schnell rund 4.900 € Gesamtkosten.",
  },
  {
    q: "Fällt der Arbeitgeberanteil bei jedem Gehalt gleich hoch aus?",
    a: "Nein. Bis zur Beitragsbemessungsgrenze steigt der Arbeitgeberanteil mit dem Gehalt. Oberhalb der Grenzen (2026: 69.750 € in KV/PV, 101.400 € in RV/ALV) bleibt der Beitrag konstant — der prozentuale Anteil am Brutto sinkt bei hohen Gehältern.",
  },
  {
    q: "Sind die Umlagen U1, U2 und U3 im Ergebnis enthalten?",
    a: "Der Rechner weist die Umlagen als geschätzte Zusatzkosten (ca. 1,9 %) separat aus, da sie je nach Krankenkasse und Betrieb schwanken. Das reine Arbeitgeberbrutto (Brutto + gesetzlicher AG-Anteil) wird getrennt angezeigt, damit Sie beide Werte sehen.",
  },
];

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
      <span className="text-black/70 text-sm font-medium">{label}</span>
      <span className={`font-mono font-extrabold ${strong ? "text-lg text-[#16181D]" : "text-base text-[#16181D]"}`}>{value}</span>
    </div>
  );
}

export default function ArbeitgeberRechner() {
  const [brutto, setBrutto] = useState(4000);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos, setKinderlos] = useState(true);
  const [mitUmlagen, setMitUmlagen] = useState(true);

  const { netto, ag } = useMemo(() => {
    const netto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: kinderlos,
      kirche,
      steuerklasse,
    });
    const ag = calculateArbeitgeberkosten(brutto, mitUmlagen);
    return { netto, ag };
  }, [brutto, steuerklasse, kirche, kinderlos, mitUmlagen]);

  const gesamt = mitUmlagen ? ag.gesamtkostenMonat : ag.arbeitgeberbruttoMonat;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Building2 size={14} />
            Arbeitgeberkosten · Arbeitgeberanteil · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Arbeitgeber{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Brutto-Netto-Rechner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie mit dem Arbeitgeber-Brutto-Netto-Rechner beide Seiten: das{" "}
            <strong className="text-[#16181D]">Nettogehalt</strong> des Arbeitnehmers und die{" "}
            <strong className="text-[#16181D]">tatsächlichen Arbeitgeberkosten</strong> inklusive
            Arbeitgeberanteil zur Sozialversicherung.
          </p>
        </div>
      </section>

      {/* Ad — right below the hero */}
      <AdUnit placement="content" className="!mt-0 !mb-8" />

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
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                    Kirchensteuer
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                    Kinderlos (ab 23)
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer pt-1">
                <input type="checkbox" checked={mitUmlagen} onChange={(e) => setMitUmlagen(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Umlagen U1/U2/U3 (ca. 1,9 %) einbeziehen
              </label>
            </div>

            {/* Employer share breakdown */}
            <div className="mt-7 pt-6 border-t border-black/[0.08]">
              <h3 className="text-sm font-bold text-[#16181D] mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-[#E60A1C]" /> Arbeitgeberanteil (monatlich)
              </h3>
              <div className="space-y-2">
                <Row label="Rentenversicherung (9,3 %)" value={formatEUR(ag.ag.rente)} />
                <Row label="Arbeitslosenvers. (1,3 %)" value={formatEUR(ag.ag.arbeitslosen)} />
                <Row label="Krankenversicherung (≈ 8,75 %)" value={formatEUR(ag.ag.kranken)} />
                <Row label="Pflegeversicherung (1,7 %)" value={formatEUR(ag.ag.pflege)} />
                {mitUmlagen && <Row label="Umlagen U1/U2/U3 (ca.)" value={formatEUR(ag.umlagenMonat)} />}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Employer total cost — the headline */}
            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
                <Building2 size={22} className="text-[#E60A1C]" />
                Kosten für den Arbeitgeber
              </h2>
              <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
                <Info size={13} className="flex-shrink-0" />
                Vereinfachte Berechnung — keine Steuerberatung
              </div>

              <div className="space-y-3">
                <Row label="Bruttogehalt Arbeitnehmer" value={formatEUR(ag.bruttoMonat)} />
                <Row label="Arbeitgeberanteil gesamt" value={formatEUR(ag.ag.summeMonat + (mitUmlagen ? ag.umlagenMonat : 0))} />
                <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">Arbeitgeberbrutto / Gesamtkosten</span>
                  <span className="text-2xl font-mono font-extrabold text-[#16181D]">{formatEUR(gesamt)}</span>
                </div>
                <p className="text-xs text-black/55 px-1">
                  Pro Jahr: <strong className="text-[#16181D]">{formatEUR(mitUmlagen ? ag.gesamtkostenJahr : ag.arbeitgeberbruttoJahr)}</strong>{" "}
                  · Aufschlag auf das Brutto: <strong className="text-[#16181D]">{ag.agQuotePct.toFixed(1).replace(".", ",")} %</strong>
                </p>
              </div>
            </div>

            {/* Employee net */}
            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
                <Wallet size={20} className="text-[#E60A1C]" />
                Beim Arbeitnehmer kommt an
              </h2>
              <div className="space-y-3">
                <Row label="Sozialabgaben (AN-Anteil)" value={formatEUR(netto.sv.summeMonat)} />
                <Row label="Steuern (Lohnsteuer, Soli, ggf. KiSt)" value={formatEUR(netto.steuer.summeMonat)} />
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">Nettogehalt / Monat</span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(netto.nettoMonat)}</span>
                </div>
              </div>

              <Link
                href="/"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
              >
                Detaillierten Brutto-Netto-Rechner öffnen
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Arbeitgeberkosten berechnen: Was ein Mitarbeiter wirklich kostet
          </h2>
          <p>
            Das <strong className="text-[#16181D]">Bruttogehalt</strong> ist nur die halbe Wahrheit. On top zahlt der{" "}
            <strong className="text-[#16181D]">Arbeitgeber</strong> seinen Anteil zur Sozialversicherung — den
            sogenannten <strong className="text-[#16181D]">Arbeitgeberanteil</strong>. Aus Sicht des Betriebs
            entstehen dadurch <strong className="text-[#16181D]">Arbeitgeberkosten</strong> (oder „Arbeitgeberbrutto“),
            die spürbar über dem vereinbarten Bruttogehalt liegen. Dieser Arbeitgeber-Brutto-Netto-Rechner zeigt
            beide Perspektiven auf einen Blick: was den Betrieb der Mitarbeiter kostet und was netto beim
            Arbeitnehmer ankommt.
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Aus welchen Beiträgen besteht der Arbeitgeberanteil 2026?</h3>
          <p>
            Der Arbeitgeber trägt paritätisch (also zur Hälfte) die Beiträge zur{" "}
            <strong className="text-[#16181D]">Rentenversicherung</strong> (9,3 %),{" "}
            <strong className="text-[#16181D]">Arbeitslosenversicherung</strong> (1,3 %) und{" "}
            <strong className="text-[#16181D]">Krankenversicherung</strong> (ca. 8,75 % inkl. hälftigem
            Zusatzbeitrag). Bei der <strong className="text-[#16181D]">Pflegeversicherung</strong> zahlt der
            Arbeitgeber fix 1,7 % (Ausnahme Sachsen). Hinzu kommen die Umlagen U1 (Entgeltfortzahlung im
            Krankheitsfall), U2 (Mutterschaft) und U3 (Insolvenzgeldumlage). In Summe liegt der Aufschlag bei
            rund <strong className="text-[#16181D]">21–23 %</strong> des Bruttogehalts.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="font-mono text-[#16181D] text-sm mb-2">Beispiel: 4.000 € Bruttogehalt</p>
            <p className="text-black/60 text-sm">
              Bei 4.000 € Brutto zahlt der Arbeitgeber rund <strong className="text-[#16181D]">840 €</strong>{" "}
              Arbeitgeberanteil plus ca. 80 € Umlagen — die <strong className="text-[#16181D]">Gesamtkosten</strong>{" "}
              liegen bei etwa <strong className="text-[#16181D]">4.920 € im Monat</strong>. Der Arbeitnehmer erhält
              davon je nach Steuerklasse rund 2.600–2.900 € netto ausgezahlt.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Warum ist der Arbeitgeberanteil wichtig?</h3>
          <p>
            Wer eine <strong className="text-[#16181D]">Gehaltsverhandlung</strong> führt, ein Angebot kalkuliert
            oder als Selbstständiger die Kosten einer Anstellung plant, muss die vollen{" "}
            <strong className="text-[#16181D]">Personalkosten</strong> kennen — nicht nur das Netto. Der Rechner
            macht transparent, welche Belastung zwischen dem, was der Betrieb aufwendet, und dem, was auf dem Konto
            des Mitarbeiters landet, entsteht.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zu Arbeitgeberkosten &amp; Arbeitgeberanteil
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

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
              Weitere Rechner für Gehalt &amp; Personalkosten
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Gehaltsrechner, Weihnachtsgeld-Rechner, Firmenwagenrechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/gehaltsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <Users size={16} /> Gehaltsrechner
              </Link>
              <Link href="/weihnachtsgeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Weihnachtsgeld-Rechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <Calculator size={16} />
                Brutto-Netto-Rechner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
