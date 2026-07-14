"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HeartHandshake, Percent, ArrowRight, Info, ChevronDown, Baby } from "lucide-react";

/* Aktueller Rentenwert seit 1.7.2025: 40,79 € (gilt bis zur nächsten Anpassung 1.7.2026) */
const RENTENWERT = 40.79;
const FREIBETRAG = 26.4 * RENTENWERT;      // ≈ 1.076,86 € / Monat
const KIND_ZUSCHLAG = 5.6 * RENTENWERT;    // ≈ 228,42 € je Kind
const ANRECHNUNG = 0.4;                     // 40 % des übersteigenden Nettoeinkommens

function eur(v: number): string {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

const faqs = [
  {
    q: "Wie hoch ist die Witwenrente 2026?",
    a: "Die große Witwenrente beträgt nach neuem Recht 55 % der Rente, die der verstorbene Ehepartner bezogen hat oder bezogen hätte. Die kleine Witwenrente beträgt 25 % und wird längstens 24 Monate gezahlt. In den ersten drei Monaten nach dem Tod (Sterbevierteljahr) wird die volle Rente des Verstorbenen (100 %) weitergezahlt.",
  },
  {
    q: "Was ist der Unterschied zwischen großer und kleiner Witwenrente?",
    a: "Die große Witwenrente (55 %) erhalten Hinterbliebene, die mindestens 47 Jahre alt sind, ein Kind erziehen oder erwerbsgemindert sind. Die kleine Witwenrente (25 %) gilt für jüngere Hinterbliebene ohne Kind und ist auf 24 Monate befristet (neues Recht, Ehe/Todesfall ab 2002).",
  },
  {
    q: "Wird mein Einkommen auf die Witwenrente angerechnet?",
    a: `Ja. Eigenes Nettoeinkommen wird angerechnet, soweit es den Freibetrag von rund ${eur(FREIBETRAG)} im Monat übersteigt. Pro Kind mit Waisenrentenanspruch erhöht sich der Freibetrag um etwa ${eur(KIND_ZUSCHLAG)}. Vom übersteigenden Betrag werden 40 % auf die Witwenrente angerechnet. Im Sterbevierteljahr erfolgt keine Anrechnung.`,
  },
  {
    q: "Ist dieser Witwenrenten-Rechner verbindlich?",
    a: "Nein, der Rechner bietet eine Orientierung nach neuem Hinterbliebenenrecht. Der genaue Anspruch hängt von Rentenabschlägen, dem Rentenartfaktor, dem rentenrechtlichen Nettoeinkommen und Ihrem Geburtsjahr ab und wird von der Deutschen Rentenversicherung individuell festgestellt.",
  },
];

export default function WitwenrenteRechner() {
  const [renteVerstorben, setRenteVerstorben] = useState(1600);
  const [gross, setGross] = useState(true); // true = große (55%), false = kleine (25%)
  const [einkommen, setEinkommen] = useState(0);
  const [kinder, setKinder] = useState(0);

  const r = useMemo(() => {
    const satz = gross ? 0.55 : 0.25;
    const brutto = renteVerstorben * satz;
    const freibetrag = FREIBETRAG + kinder * KIND_ZUSCHLAG;
    const anrechenbar = einkommen > freibetrag ? (einkommen - freibetrag) * ANRECHNUNG : 0;
    const auszahlung = Math.max(0, brutto - anrechenbar);
    return { satz, brutto, freibetrag, anrechenbar, auszahlung, sterbeviertel: renteVerstorben };
  }, [renteVerstorben, gross, einkommen, kinder]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <HeartHandshake size={14} /> Hinterbliebenenrente · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Witwenrente-Rechner</span> 2026
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie die Höhe Ihrer <strong className="text-[#16181D]">Witwenrente</strong> bzw. Witwerrente —
            große (55 %) oder kleine (25 %) Witwenrente, Sterbevierteljahr und die Anrechnung Ihres eigenen Einkommens
            mit Freibetrag. Kostenlos und aktuell nach neuem Hinterbliebenenrecht.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] flex items-center gap-2"><HeartHandshake size={22} className="text-[#E60A1C]" /> Ihre Angaben</h2>

            <div>
              <label className="block text-sm font-semibold text-black/70 mb-2">Monatliche Rente des/der Verstorbenen (brutto)</label>
              <div className="relative">
                <input type="number" value={renteVerstorben} onChange={(e) => setRenteVerstorben(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
              </div>
              <input type="range" min={0} max={3500} step={50} value={Math.min(renteVerstorben, 3500)} onChange={(e) => setRenteVerstorben(Number(e.target.value))} className="w-full mt-3 accent-[#E60A1C]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/70 mb-2">Art der Witwenrente</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setGross(true)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${gross ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Große (55 %)</button>
                <button onClick={() => setGross(false)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${!gross ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Kleine (25 %)</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/70 mb-2">Eigenes Netto-Einkommen / Monat (Anrechnung)</label>
              <div className="relative">
                <input type="number" value={einkommen} onChange={(e) => setEinkommen(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
              </div>
              <p className="text-xs text-black/45 mt-2">Freibetrag: {eur(r.freibetrag)} {kinder > 0 ? `(inkl. ${kinder} Kind${kinder > 1 ? "er" : ""})` : ""}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black/70 mb-2 flex items-center gap-1.5"><Baby size={15} className="text-[#E60A1C]" /> Kinder mit Waisenrentenanspruch</label>
              <input type="range" min={0} max={5} step={1} value={kinder} onChange={(e) => setKinder(Number(e.target.value))} className="w-full accent-[#E60A1C]" />
              <div className="text-center font-bold text-[#16181D] mt-1">{kinder}</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2"><Percent size={22} className="text-[#E60A1C]" /> Ihre Witwenrente</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Sterbevierteljahr (1.–3. Monat, 100 %)</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">{eur(r.sterbeviertel)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Witwenrente brutto ({(r.satz * 100).toFixed(0)} %)</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur(r.brutto)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Einkommensanrechnung (40 %)</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">{eur(r.anrechenbar)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <span className="text-black/80 text-sm font-semibold">Laufende Witwenrente / Monat</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E60A1C] font-mono">{eur(r.auszahlung)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 text-xs text-black/50 bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-3 py-2.5">
              <Info size={13} className="flex-shrink-0 text-[#E60A1C]" /> Ab dem 4. Monat gilt die anteilige Witwenrente. Rentenabschläge sind nicht berücksichtigt.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Witwenrente 2026: So wird sie berechnet</h2>
          <p>
            Die <strong className="text-[#16181D]">Witwenrente</strong> (bzw. Witwerrente) ist eine Hinterbliebenenrente
            der gesetzlichen Rentenversicherung. Grundlage ist die Rente, die der verstorbene Ehe- oder
            Lebenspartner bezogen hat oder bezogen hätte. In den ersten drei Monaten — dem{" "}
            <strong className="text-[#16181D]">Sterbevierteljahr</strong> — wird diese Rente in voller Höhe (100 %)
            weitergezahlt, ohne Einkommensanrechnung.
          </p>
          <p>
            Danach beträgt die <strong className="text-[#16181D]">große Witwenrente 55 %</strong> und die{" "}
            <strong className="text-[#16181D]">kleine Witwenrente 25 %</strong> der Versichertenrente. Eigenes
            Einkommen wird nur angerechnet, soweit es den Freibetrag von rund {eur(FREIBETRAG)} übersteigt — und dann
            auch nur zu 40 %. Wie viel Rente Sie selbst später erwarten können, ermitteln Sie mit unserem{" "}
            <Link href="/rentenrechner" className="text-[#E60A1C] font-semibold hover:underline">Rentenrechner</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Witwenrente</h2>
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">Weitere Renten- & Gehaltsrechner</h2>
          <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">Rentenrechner, Gehaltsrechner & mehr — kostenlos für 2026.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/rentenrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Rentenrechner</Link>
            <Link href="/gehaltsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Gehaltsrechner</Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(230,10,28,0.4)] text-sm"><HeartHandshake size={16} /> Brutto-Netto-Rechner <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
