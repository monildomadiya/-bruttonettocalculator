"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PiggyBank, Calculator, Info, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

// Schonvermögen Bürgergeld / neue Grundsicherung 2026 (SGB II)
// Karenzzeit-Regeln (laufende Fälle / bis 30.6.2026):
const KARENZ_ANTRAGSTELLER = 40000;
const KARENZ_WEITERE = 15000;
const NACH_KARENZ_PRO_PERSON = 15000;
// Neuregelung für Neuanträge ab 1.7.2026 — altersgestaffelt je Person:
function neuFreibetrag(alter: number): number {
  if (alter <= 30) return 5000;
  if (alter <= 40) return 10000;
  if (alter <= 50) return 12500;
  return 20000;
}

const faqs = [
  { q: "Wie viel Schonvermögen gilt beim Bürgergeld 2026?", a: "Das hängt vom Zeitpunkt ab. In der Karenzzeit (erstes Bezugsjahr, laufende Fälle) bleiben 40.000 € für die antragstellende Person plus 15.000 € für jede weitere Person der Bedarfsgemeinschaft anrechnungsfrei. Nach der Karenzzeit gelten 15.000 € pro Person." },
  { q: "Was ändert sich ab dem 1. Juli 2026?", a: "Mit der neuen Grundsicherung entfällt für Neuanträge ab dem 1. Juli 2026 die Karenzzeit für Geldvermögen. Stattdessen gelten altersgestaffelte Freibeträge je Person: bis 30 Jahre 5.000 €, bis 40 Jahre 10.000 €, bis 50 Jahre 12.500 € und über 50 Jahre 20.000 €. Wer vor dem Stichtag im laufenden Bewilligungszeitraum ist, behält bis zu dessen Ende die bisherigen Regeln." },
  { q: "Zählt das selbstgenutzte Eigenheim zum Vermögen?", a: "Ein angemessenes selbstgenutztes Haus oder eine Eigentumswohnung sowie ein angemessenes Auto und Vermögen zur Altersvorsorge (z. B. Riester) bleiben grundsätzlich unangetastet und zählen nicht zum verwertbaren Vermögen." },
  { q: "Was passiert, wenn mein Vermögen über dem Freibetrag liegt?", a: "Übersteigt Ihr verwertbares Vermögen den Freibetrag, müssen Sie den übersteigenden Teil zunächst für den Lebensunterhalt einsetzen, bevor ein Anspruch auf Bürgergeld besteht. Erst danach kann Bürgergeld gezahlt werden." },
];

export default function SchonvermoegenRechner() {
  const [regelung, setRegelung] = useState<"karenz" | "neu">("karenz");
  const [personen, setPersonen] = useState(1);
  const [imErstenJahr, setImErstenJahr] = useState(true);
  const [alter, setAlter] = useState(35);

  const r = useMemo(() => {
    const p = Math.max(1, personen);
    if (regelung === "karenz") {
      const freibetrag = imErstenJahr
        ? KARENZ_ANTRAGSTELLER + KARENZ_WEITERE * (p - 1)
        : NACH_KARENZ_PRO_PERSON * p;
      return { freibetrag, proPerson: neuFreibetrag(alter) };
    }
    const proPerson = neuFreibetrag(alter);
    return { freibetrag: proPerson * p, proPerson };
  }, [regelung, personen, imErstenJahr, alter]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <PiggyBank size={14} /> Bürgergeld · Schonvermögen · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Schonvermögen-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel Vermögen bleibt beim <strong className="text-[#16181D]">Bürgergeld</strong> anrechnungsfrei? Der Rechner
            zeigt Ihren <strong className="text-[#16181D]">Vermögensfreibetrag</strong> — nach Karenzzeit-Regeln und nach der
            <strong className="text-[#16181D]"> Neuregelung ab dem 1. Juli 2026</strong>.
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
                <label className="block text-sm font-semibold text-black/70 mb-2">Welche Regelung?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setRegelung("karenz")} className={`rounded-xl px-3 py-3 text-xs sm:text-sm font-bold border transition-all ${regelung === "karenz" ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Karenzzeit-Regeln<br /><span className="font-normal opacity-80">laufende Fälle</span></button>
                  <button onClick={() => setRegelung("neu")} className={`rounded-xl px-3 py-3 text-xs sm:text-sm font-bold border transition-all ${regelung === "neu" ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Neuregelung<br /><span className="font-normal opacity-80">Neuantrag ab 1.7.2026</span></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Personen in der Bedarfsgemeinschaft: {personen}</label>
                <input type="range" min={1} max={8} step={1} value={personen} onChange={(e) => setPersonen(Number(e.target.value))}
                  className="w-full accent-[#E60A1C]" />
              </div>
              {regelung === "karenz" ? (
                <label className="flex items-center gap-3 cursor-pointer bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3">
                  <input type="checkbox" checked={imErstenJahr} onChange={(e) => setImErstenJahr(e.target.checked)} className="w-5 h-5 accent-[#E60A1C]" />
                  <span className="text-sm font-semibold text-black/70">Im ersten Bezugsjahr (Karenzzeit)</span>
                </label>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Alter (für Staffelung): {alter} Jahre</label>
                  <input type="range" min={18} max={70} step={1} value={alter} onChange={(e) => setAlter(Number(e.target.value))}
                    className="w-full accent-[#E60A1C]" />
                  <p className="text-xs text-black/50 mt-1">Freibetrag je Person: bis 30 → 5.000 €, bis 40 → 10.000 €, bis 50 → 12.500 €, über 50 → 20.000 €.</p>
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <ShieldCheck size={22} className="text-[#E60A1C]" /> Ihr Schonvermögen
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Orientierung — maßgeblich ist das Jobcenter im Einzelfall
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Anrechnungsfreies Vermögen (Freibetrag)</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.freibetrag)}</div>
              <div className="text-xs text-black/50 mt-2">
                {regelung === "karenz"
                  ? (imErstenJahr ? "Karenzzeit: 40.000 € + 15.000 € je weiterer Person" : "Nach Karenzzeit: 15.000 € je Person")
                  : `Neuregelung: ${formatEUR(r.proPerson)} je Person (nach Alter)`}
              </div>
            </div>
            {regelung === "neu" && personen > 1 && (
              <p className="text-xs text-amber-600 mb-3">
                Hinweis: Der Freibetrag wird je Person nach dem individuellen Alter bestimmt. Hier wird das eingegebene Alter auf alle {personen} Personen angewandt (Schätzung).
              </p>
            )}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Personen</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{Math.max(1, personen)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Angewandte Regelung</span>
                <span className="text-sm font-bold text-[#16181D]">{regelung === "karenz" ? "Karenzzeit / laufend" : "ab 1.7.2026"}</span>
              </div>
            </div>
            <Link href="/buergergeld-rechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Bürgergeld-Höhe berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Schonvermögen beim Bürgergeld 2026</h2>
          <p>
            Als <strong className="text-[#16181D]">Schonvermögen</strong> bezeichnet man das Vermögen, das beim Bürgergeld
            anrechnungsfrei bleibt. Nach den <strong className="text-[#16181D]">Karenzzeit-Regeln</strong> (erstes Bezugsjahr,
            laufende Fälle) sind das 40.000 € für die antragstellende Person plus 15.000 € für jede weitere Person der
            Bedarfsgemeinschaft. Nach Ablauf der Karenzzeit gelten 15.000 € pro Person.
          </p>
          <p>
            Mit der <strong className="text-[#16181D]">neuen Grundsicherung ab dem 1. Juli 2026</strong> entfällt für Neuanträge die
            Karenzzeit. Stattdessen gelten altersgestaffelte Freibeträge je Person: bis 30 Jahre 5.000 €, bis 40 Jahre 10.000 €,
            bis 50 Jahre 12.500 € und über 50 Jahre 20.000 €. Ein angemessenes selbstgenutztes Eigenheim, ein angemessenes Auto
            und Altersvorsorgevermögen (z. B.{" "}
            <Link href="/riester-rechner" className="text-[#E60A1C] font-semibold hover:underline">Riester</Link>) bleiben zusätzlich
            geschützt. Die Höhe Ihres Bürgergeldes berechnen Sie im{" "}
            <Link href="/buergergeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Bürgergeld-Rechner</Link>.
          </p>
          <p>
            Dieser Rechner liefert eine Orientierung. Über die Anrechnung im Einzelfall entscheidet das zuständige Jobcenter.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Schonvermögen</h2>
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
