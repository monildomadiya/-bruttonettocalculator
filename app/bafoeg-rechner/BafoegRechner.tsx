"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Wallet, ArrowRight, Info, ChevronDown, Home, Users } from "lucide-react";

/* BAföG-Bedarfssätze (gültig seit Wintersemester 2024/25, in €/Monat) */
const GRUNDBEDARF = 475;
const WOHN_ELTERN = 59;
const WOHN_AUSWAERTS = 380;
const KVPV_ZUSCHLAG = 140; // KV 102 + PV 38

/* Freibeträge (vereinfacht) */
const FREIBETRAG_EIGEN = 556;        // eigenes Einkommen anrechnungsfrei / Monat
const FREIBETRAG_ELTERN_VERH = 2540; // verheiratete, zusammenlebende Eltern
const FREIBETRAG_ELTERN_ALLEIN = 1690;
const FREIBETRAG_GESCHWISTER = 770;  // je weiterem Kind
const ELTERN_ANRECHNUNG = 0.5;       // grobe Näherung des angerechneten Restbetrags

function eur(v: number): string {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

const faqs = [
  {
    q: "Wie hoch ist der BAföG-Höchstsatz 2026?",
    a: "Der BAföG-Förderungshöchstsatz für Studierende, die nicht bei den Eltern wohnen und selbst kranken- und pflegeversichert sind, liegt bei rund 992 € im Monat: 475 € Grundbedarf, 380 € Wohnzuschlag und 140 € Kranken-/Pflegeversicherungszuschlag. Wer bei den Eltern wohnt, erhält einen geringeren Wohnzuschlag von 59 €.",
  },
  {
    q: "Wird das Einkommen der Eltern beim BAföG angerechnet?",
    a: "Ja. Vom Nettoeinkommen der Eltern wird ein Freibetrag abgezogen (bei verheirateten, zusammenlebenden Eltern rund 2.540 € im Monat, je weiterem Kind zusätzlich 770 €). Der übersteigende Betrag mindert den BAföG-Anspruch anteilig. Dieser Rechner nutzt dafür eine vereinfachte Näherung.",
  },
  {
    q: "Muss ich BAföG zurückzahlen?",
    a: "Studierenden-BAföG wird zur Hälfte als Zuschuss und zur Hälfte als zinsloses Staatsdarlehen gewährt. Die Rückzahlung des Darlehensanteils ist auf maximal 10.010 € gedeckelt und beginnt erst fünf Jahre nach Ende der Förderungshöchstdauer.",
  },
  {
    q: "Wie viel darf ich neben dem BAföG verdienen?",
    a: "Sie dürfen rund 556 € im Monat (bzw. 6.672 € im Bewilligungszeitraum) anrechnungsfrei hinzuverdienen — das entspricht einem Minijob. Verdienen Sie mehr, wird der übersteigende Betrag auf Ihren BAföG-Anspruch angerechnet.",
  },
];

export default function BafoegRechner() {
  const [auswaerts, setAuswaerts] = useState(true);
  const [selbstVersichert, setSelbstVersichert] = useState(true);
  const [eigenesEinkommen, setEigenesEinkommen] = useState(0);
  const [elternVerheiratet, setElternVerheiratet] = useState(true);
  const [elternEinkommen, setElternEinkommen] = useState(2500);
  const [geschwister, setGeschwister] = useState(0);

  const r = useMemo(() => {
    const bedarf = GRUNDBEDARF + (auswaerts ? WOHN_AUSWAERTS : WOHN_ELTERN) + (selbstVersichert ? KVPV_ZUSCHLAG : 0);

    const eigenAnrechnung = Math.max(0, eigenesEinkommen - FREIBETRAG_EIGEN);

    const elternFreibetrag = (elternVerheiratet ? FREIBETRAG_ELTERN_VERH : FREIBETRAG_ELTERN_ALLEIN) + geschwister * FREIBETRAG_GESCHWISTER;
    const elternAnrechnung = elternEinkommen > elternFreibetrag ? (elternEinkommen - elternFreibetrag) * ELTERN_ANRECHNUNG : 0;

    const bafoeg = Math.max(0, Math.min(bedarf, bedarf - eigenAnrechnung - elternAnrechnung));
    return { bedarf, eigenAnrechnung, elternFreibetrag, elternAnrechnung, bafoeg, zuschuss: bafoeg / 2 };
  }, [auswaerts, selbstVersichert, eigenesEinkommen, elternVerheiratet, elternEinkommen, geschwister]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <GraduationCap size={14} /> Höchstsatz ~992 € · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">BAföG-Rechner</span> 2026
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Schätzen Sie Ihren <strong className="text-[#16181D]">BAföG-Anspruch 2026</strong> als Studierende:r — aus
            dem Bedarfssatz, Ihrer Wohnsituation, Ihrem eigenen Einkommen und dem anrechenbaren Einkommen der Eltern.
            Kostenlos und mit den aktuellen Bedarfssätzen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#16181D] mb-3 flex items-center gap-2"><Home size={19} className="text-[#E60A1C]" /> Wohnsituation</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => setAuswaerts(true)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${auswaerts ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Eigene Wohnung</button>
                <button onClick={() => setAuswaerts(false)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${!auswaerts ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Bei den Eltern</button>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={selbstVersichert} onChange={(e) => setSelbstVersichert(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Selbst kranken-/pflegeversichert (+{eur(KVPV_ZUSCHLAG)})
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/70 mb-2">Eigenes Netto-Einkommen / Monat</label>
              <div className="relative">
                <input type="number" value={eigenesEinkommen} onChange={(e) => setEigenesEinkommen(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
              </div>
              <p className="text-xs text-black/45 mt-2">Anrechnungsfrei bis {eur(FREIBETRAG_EIGEN)} (Minijob).</p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#16181D] mb-3 flex items-center gap-2"><Users size={19} className="text-[#E60A1C]" /> Einkommen der Eltern</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => setElternVerheiratet(true)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${elternVerheiratet ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Verheiratet</button>
                <button onClick={() => setElternVerheiratet(false)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${!elternVerheiratet ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Alleinerziehend</button>
              </div>
              <label className="block text-sm font-semibold text-black/70 mb-2">Netto-Einkommen der Eltern / Monat (gesamt)</label>
              <div className="relative">
                <input type="number" value={elternEinkommen} onChange={(e) => setElternEinkommen(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-semibold text-black/70 mb-1">Weitere Geschwister (Freibetrag +{eur(FREIBETRAG_GESCHWISTER)}/Kind)</label>
                <input type="range" min={0} max={5} step={1} value={geschwister} onChange={(e) => setGeschwister(Number(e.target.value))} className="w-full accent-[#E60A1C]" />
                <div className="text-center font-bold text-[#16181D]">{geschwister}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2"><Wallet size={22} className="text-[#E60A1C]" /> Ihr BAföG (Schätzung)</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">BAföG-Bedarf</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur(r.bedarf)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Eigenes Einkommen</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">{eur(r.eigenAnrechnung)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Anrechnung Elterneinkommen</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">{eur(r.elternAnrechnung)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <span className="text-black/80 text-sm font-semibold">Voraussichtliches BAföG / Monat</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E60A1C] font-mono">{eur(r.bafoeg)}</span>
              </div>
              {r.bafoeg > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">davon Zuschuss (nicht zurückzuzahlen)</span>
                  <span className="text-lg font-extrabold text-emerald-600 font-mono">{eur(r.zuschuss)}</span>
                </div>
              )}
            </div>
            {r.bafoeg <= 0 && (
              <p className="text-xs text-amber-600 mt-4 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2.5">
                Nach dieser Schätzung besteht kein voller BAföG-Anspruch — eine offizielle Antragstellung kann sich
                dennoch lohnen, da individuelle Freibeträge abweichen können.
              </p>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-black/50 bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-3 py-2.5">
              <Info size={13} className="flex-shrink-0 text-[#E60A1C]" /> Grobe Orientierung. Verbindlich ist nur der Bescheid des BAföG-Amts.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">BAföG 2026: Bedarf, Einkommen & Anrechnung</h2>
          <p>
            <strong className="text-[#16181D]">BAföG</strong> (Bundesausbildungsförderungsgesetz) unterstützt
            Studierende und Schüler:innen, deren Familie die Ausbildung nicht vollständig finanzieren kann. Die Höhe
            richtet sich nach dem <strong className="text-[#16181D]">Bedarfssatz</strong> abzüglich des angerechneten
            Einkommens von Ihnen selbst und Ihren Eltern.
          </p>
          <p>
            Der große Vorteil: Studierenden-BAföG ist zur Hälfte ein Zuschuss und zur Hälfte ein{" "}
            <strong className="text-[#16181D]">zinsloses Darlehen</strong>, dessen Rückzahlung auf 10.010 € begrenzt
            ist. Wer neben dem Studium jobbt, sollte den anrechnungsfreien Betrag von rund {eur(FREIBETRAG_EIGEN)}{" "}
            (Minijob) im Blick behalten — was netto vom Job bleibt, zeigt unser{" "}
            <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob-Rechner</Link>{" "}
            und der <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum BAföG</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.08] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">Weitere Rechner für Studierende</h2>
          <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">Minijob, Gehalt & mehr — kostenlos für 2026.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/minijob-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Minijob-Rechner</Link>
            <Link href="/gehaltsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Gehaltsrechner</Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"><GraduationCap size={16} /> Brutto-Netto-Rechner <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
