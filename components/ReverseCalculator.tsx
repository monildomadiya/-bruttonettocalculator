"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  AlertCircle, Share2, Check, ChevronRight, Sparkles,
  CircleDollarSign, Landmark, HeartPulse, TrendingUp, Wallet,
} from "lucide-react";
import { solveBruttoForNetto, formatEUR, Steuerjahr } from "@/lib/taxCalculator";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Alleinstehende",
  2: "Alleinerziehende",
  3: "Verheiratet — höheres Einkommen",
  4: "Verheiratet — gleiches Einkommen",
  5: "Verheiratet — geringeres Einkommen",
  6: "Zweiter Job / Nebentätigkeit",
};

/* Animated number hook (matches the forward calculator) */
function useAnimatedValue(target: number, duration = 380) {
  const [display, setDisplay] = useState(target);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const startVal = display;
    const startTime = performance.now();
    if (raf.current) cancelAnimationFrame(raf.current);
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + (target - startVal) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return display;
}

export default function ReverseCalculator() {
  const [nettoZiel, setNettoZiel] = useState<number>(2500);
  const [inputStr, setInputStr] = useState<string>("2500");
  const [inputError, setInputError] = useState<string>("");
  const [jahr, setJahr] = useState<Steuerjahr>(2026);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kinderlosUeber23, setKinderlosUeber23] = useState(true);
  const [kirche, setKirche] = useState(false);
  const [isJahresansicht, setIsJahresansicht] = useState(false);
  const [copied, setCopied] = useState(false);

  const verheiratet = steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5;

  /* Restore a shared calculation from the URL */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const n = parseFloat(p.get("netto") ?? "");
    const j = parseInt(p.get("jahr") ?? "");
    const s = parseInt(p.get("sk") ?? "");
    if (!isNaN(n) && n > 0 && n <= 100000) { setNettoZiel(n); setInputStr(String(n)); }
    if (j === 2026 || j === 2027) setJahr(j as Steuerjahr);
    if (s >= 1 && s <= 6) setSteuerklasse(s as Steuerklasse);
  }, []);

  const handleNettoChange = useCallback((raw: string) => {
    setInputStr(raw);
    const val = parseFloat(raw.replace(",", "."));
    if (raw === "" || isNaN(val)) {
      setInputError("Bitte einen gültigen Betrag eingeben");
      setNettoZiel(0);
    } else if (val < 0) {
      setInputError("Der Betrag muss positiv sein");
      setNettoZiel(0);
    } else if (val > 100000) {
      setInputError("Maximales Wunsch-Netto: 100.000 €");
      setNettoZiel(100000);
    } else {
      setInputError("");
      setNettoZiel(val);
    }
  }, []);

  const sliderPct = Math.min((nettoZiel || 0) / 10000, 1) * 100;

  const solved = useMemo(
    () => solveBruttoForNetto({
      nettoMonatZiel: Math.max(0, nettoZiel || 0),
      jahr,
      verheiratet,
      kinderlosUeber23,
      kirche,
      kirchensteuerSatz: 0.09,
      steuerklasse,
    }),
    [nettoZiel, jahr, verheiratet, kinderlosUeber23, kirche, steuerklasse]
  );

  const r = solved.forward;
  const bruttoMonat = solved.bruttoMonat;
  const showVal = (monthly: number) => (isJahresansicht ? monthly * 12 : monthly);
  const animatedBrutto = useAnimatedValue(isJahresansicht ? bruttoMonat * 12 : bruttoMonat);

  const handleCopy = useCallback(async () => {
    const url = new URL(window.location.href.split("?")[0]);
    url.searchParams.set("netto", nettoZiel.toFixed(0));
    url.searchParams.set("jahr", String(jahr));
    url.searchParams.set("sk", String(steuerklasse));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }, [nettoZiel, jahr, steuerklasse]);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <ReviewerByline />
      </div>
      <div className="rounded-3xl overflow-hidden border border-black/[0.12] bg-[#FFFFFF] shadow-sm w-full max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] w-full max-w-full min-w-0">

          {/* ═══ LEFT — Inputs ════════════════════════════════════════ */}
          <div className="p-4 sm:p-10 bg-[#FFFFFF] border-b md:border-b-0 md:border-r border-black/[0.10] flex flex-col justify-between w-full max-w-full min-w-0">
            <div className="w-full max-w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-black/50 mb-1 font-bold">Eingabe · Wunsch-Netto</p>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D]">Gewünschtes Nettogehalt</h2>
                </div>
                <div className="flex items-center self-start sm:self-auto gap-1 bg-black/[0.04] border border-black/[0.10] rounded-2xl p-1.5 text-sm font-semibold flex-shrink-0">
                  {[{ label: "/Monat", val: false }, { label: "/Jahr", val: true }].map(({ label, val }) => (
                    <button
                      key={label}
                      onClick={() => setIsJahresansicht(val)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all ${
                        isJahresansicht === val ? "bg-[#E60A1C] text-white font-bold" : "text-black/60 hover:text-[#16181D]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Netto input */}
              <div className="mb-6 sm:mb-8 w-full max-w-full">
                <label htmlFor="netto-input" className="text-base font-bold text-[#16181D] block mb-3">
                  Wunsch-Netto pro Monat
                </label>
                <div className="relative w-full max-w-full">
                  <input
                    id="netto-input"
                    type="number"
                    inputMode="decimal"
                    value={inputStr}
                    onChange={(e) => handleNettoChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full max-w-full font-mono text-xl sm:text-2xl font-bold rounded-2xl border px-4 sm:px-6 py-3.5 sm:py-4.5 pr-14 sm:pr-20 transition-all outline-none ${
                      inputError
                        ? "border-red-500 bg-red-50 text-red-800 focus:border-red-500"
                        : "border-black/[0.12] bg-[#F1F3F5] text-[#16181D] focus:border-[#E60A1C] focus:bg-[#F1F3F5]"
                    }`}
                    min={0} max={100000} step={50}
                    aria-describedby={inputError ? "netto-error" : undefined}
                    aria-invalid={!!inputError}
                  />
                  <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-black/50 font-mono text-sm sm:text-base font-bold">EUR</span>
                </div>
                {inputError && (
                  <p id="netto-error" role="alert" className="flex items-center gap-2 text-sm text-red-600 mt-2 font-medium">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {inputError}
                  </p>
                )}

                {/* Slider */}
                <div className="mt-4 w-full max-w-full">
                  <input
                    type="range"
                    aria-label="Wunsch-Netto Schieberegler"
                    min={500} max={10000} step={50}
                    value={Math.min(Math.max(nettoZiel || 500, 500), 10000)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setNettoZiel(v);
                      setInputStr(String(v));
                      setInputError("");
                    }}
                    style={{ "--range-pct": `${sliderPct}%` } as React.CSSProperties}
                    className="w-full max-w-full block"
                  />
                  <div className="flex justify-between text-xs text-black/50 font-mono font-medium mt-1">
                    <span>500 €</span><span>10.000 €</span>
                  </div>
                </div>
              </div>

              {/* Steuerjahr */}
              <div className="mb-6 sm:mb-8 w-full max-w-full">
                <span className="text-base font-bold text-[#16181D] block mb-3">Steuerjahr</span>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
                  {([2026, 2027] as Steuerjahr[]).map((j) => (
                    <button
                      key={j}
                      onClick={() => setJahr(j)}
                      className={`w-full py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold border transition-all ${
                        jahr === j ? "text-white border-transparent" : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                      }`}
                      style={jahr === j ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                    >
                      {j}
                    </button>
                  ))}
                </div>
                {jahr === 2027 && (
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-700 mt-3 bg-amber-50 rounded-2xl p-3.5 sm:p-4 border border-amber-500/30 font-medium">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>Für 2027 liegen noch keine finalen Tarifwerte vor (Stand: Juli 2026). Es werden vorläufig die amtlichen 2026-Werte angesetzt.</span>
                  </div>
                )}
              </div>

              {/* Steuerklasse */}
              <div className="mb-6 sm:mb-8 w-full max-w-full min-w-0">
                <span className="text-base font-bold text-[#16181D] block mb-3">Steuerklasse</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full max-w-full min-w-0">
                  {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                    <button
                      key={sk}
                      onClick={() => setSteuerklasse(sk)}
                      title={STEUERKLASSE_INFO[sk]}
                      aria-pressed={steuerklasse === sk}
                      className={`sk-tab py-3 sm:py-3.5 rounded-2xl text-base sm:text-lg font-extrabold border transition-all w-full min-w-0 ${
                        steuerklasse === sk ? "text-white border-transparent" : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                      }`}
                      style={steuerklasse === sk ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-black/70 mt-2.5 flex items-center gap-2 font-medium">
                  <ChevronRight size={16} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">{STEUERKLASSE_INFO[steuerklasse]}</span>
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-6 border-t border-black/[0.10] mb-8">
                <p className="text-xs font-bold text-[#E60A1C] uppercase tracking-widest mb-4">Weitere Optionen</p>
                <Toggle checked={kinderlosUeber23} onChange={setKinderlosUeber23} label="Kinderlos & über 23 Jahre" hint="Pflegeversicherung +0,6 %" />
                <Toggle checked={kirche} onChange={setKirche} label="Kirchensteuerpflichtig" hint="9 % auf die Einkommensteuer" />
              </div>

              <AdUnit placement="content" className="!my-0 !px-0" />
            </div>

            <div className="flex gap-3 text-sm text-black/70 bg-[#F1F3F5] rounded-2xl p-4 border border-black/[0.10] leading-relaxed font-medium">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
              <span>Vereinfachte Rückrechnung nach § 32a EStG 2026. Unverbindliche Orientierung, keine Steuerberatung.</span>
            </div>
          </div>

          {/* ═══ RIGHT — Result ════════════════════════════════════════ */}
          <div className="p-4 sm:p-10 bg-[#F4F5F7] text-[#16181D] flex flex-col justify-between w-full max-w-full min-w-0">
            <div className="w-full max-w-full min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
                <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#E60A1C] rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#E60A1C] animate-pulse flex-shrink-0" />
                  BENÖTIGTES BRUTTO · {jahr}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Ergebnis-Link kopieren"
                  title="Link für dieses Ergebnis kopieren"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-xl border border-black/[0.10] text-black/80 bg-black/[0.04] hover:text-[#16181D] hover:bg-black/[0.06] hover:border-black/[0.18] transition-all"
                >
                  {copied ? <><Check size={14} className="text-[#E60A1C]" /><span>Kopiert!</span></> : <><Share2 size={14} /><span>Teilen</span></>}
                </button>
              </div>

              {/* Hero: required gross */}
              <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.12] rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E60A1C]/25 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-black/70 font-semibold mb-2">
                    <Wallet size={14} className="text-[#E60A1C] flex-shrink-0" />
                    <span>{isJahresansicht ? "Benötigtes Brutto-Jahresgehalt" : "Benötigtes Brutto-Monatsgehalt"}</span>
                  </div>
                  <p className="font-display font-black tabular-nums leading-none tracking-tight text-[#16181D] text-3xl sm:text-5xl md:text-6xl break-all sm:break-normal">
                    {formatEUR(animatedBrutto)}
                  </p>
                  <p className="text-xs sm:text-sm text-black/60 mt-3 font-medium">
                    für ein Wunsch-Netto von <strong className="text-[#16181D] font-bold">{formatEUR(showVal(nettoZiel || 0))}</strong> {isJahresansicht ? "/ Jahr" : "/ Monat"}
                  </p>
                </div>
              </div>

              {!solved.reachable && nettoZiel > 0 && (
                <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-700 mb-6 bg-amber-50 rounded-2xl p-4 border border-amber-500/30 font-medium">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-600" />
                  <span>Dieses Wunsch-Netto liegt außerhalb des berechenbaren Bereichs. Bitte geben Sie einen realistischeren Betrag ein.</span>
                </div>
              )}

              {/* Breakdown of the solved gross */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-black/60 font-bold mb-3">So setzt sich das Brutto zusammen</p>

                <div className="flex justify-between items-center py-3.5 sm:py-4 px-4 sm:px-5 bg-black/[0.04] rounded-2xl border border-black/[0.10] text-base sm:text-lg font-bold text-[#16181D] gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <CircleDollarSign size={18} className="text-[#E60A1C] flex-shrink-0" />
                    <span className="truncate">Benötigtes Bruttogehalt</span>
                  </span>
                  <span className="font-mono font-extrabold text-lg sm:text-xl text-[#16181D] tabular-nums flex-shrink-0">{formatEUR(showVal(bruttoMonat))}</span>
                </div>

                <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-black/[0.02] rounded-xl border border-black/[0.08] text-sm sm:text-lg font-bold text-[#16181D] mt-4 gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <Landmark size={16} className="text-[#E60A1C] flex-shrink-0" />
                    <span className="truncate">Steuern Gesamt</span>
                  </span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(r.steuer.summeMonat))}</span>
                </div>

                <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-black/[0.02] rounded-xl border border-black/[0.08] text-sm sm:text-lg font-bold text-[#16181D] mt-2 gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <HeartPulse size={16} className="text-[#E60A1C] flex-shrink-0" />
                    <span className="truncate">Sozialabgaben Gesamt</span>
                  </span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(r.sv.summeMonat))}</span>
                </div>

                <div className="flex justify-between items-center py-3.5 sm:py-4 px-4 sm:px-5 bg-[#0E9F6E]/10 rounded-2xl border border-[#0E9F6E]/30 text-base sm:text-lg font-bold text-[#16181D] mt-4 gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <Wallet size={18} className="text-[#0E9F6E] flex-shrink-0" />
                    <span className="truncate">Resultierendes Nettogehalt</span>
                  </span>
                  <span className="font-mono font-extrabold text-lg sm:text-xl text-emerald-600 tabular-nums flex-shrink-0">{formatEUR(showVal(r.nettoMonat))}</span>
                </div>
              </div>
            </div>

            {/* Rate footer */}
            <div className="bg-[#F1F3F5] border border-black/[0.10] rounded-2xl p-4 sm:p-5 mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-base text-black/80 font-medium">
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#E60A1C] flex-shrink-0" />
                <span>Netto-Quote: <strong className="text-[#16181D] ml-1 font-bold">{bruttoMonat > 0 ? Math.round((r.nettoMonat / bruttoMonat) * 100) : 0} %</strong></span>
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#E60A1C] flex-shrink-0" />
                <span>Grenzsteuersatz: <strong className="text-[#16181D] ml-1 font-bold">{r.grenzsteuersatzPct.toFixed(1)} %</strong></span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <label className="flex items-center gap-3.5 cursor-pointer select-none group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(!checked); } }}
        className="relative flex-shrink-0 rounded-full transition-all duration-200 focus:outline-none"
        style={{
          width: "50px", height: "28px",
          background: checked ? "#E60A1C" : "rgba(16,24,40,0.12)",
          boxShadow: checked ? "0 1px 3px rgba(16,24,40,0.20)" : "none",
        }}
      >
        <span
          className="absolute top-[3px] left-[3px] rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ width: "22px", height: "22px", transform: checked ? "translateX(22px)" : "none" }}
        />
      </button>
      <span>
        <span className="text-base text-black/90 group-hover:text-[#16181D] transition-colors font-semibold">{label}</span>
        {hint && <span className="block text-xs text-black/60 font-normal mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}
