"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  AlertCircle, Share2, Check, ChevronRight,
  TrendingUp, Landmark, HeartPulse, Briefcase,
  CircleDollarSign, Sparkles, MapPin, Calendar, ChevronDown, ChevronUp,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerjahr } from "@/lib/taxCalculator";
import ReviewerByline from "@/components/ReviewerByline";

/* ─── Steuerklasse type ───────────────────────────────────────────── */
type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Alleinstehende",
  2: "Alleinerziehende",
  3: "Verheiratet — höheres Einkommen",
  4: "Verheiratet — gleiches Einkommen",
  5: "Verheiratet — geringeres Einkommen",
  6: "Zweiter Job / Nebentätigkeit",
};

/* ─── Animated number hook ─────────────────────────────────────────── */
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

/* ─── SVG Donut chart (LARGE PROPER SIZE) ──────────────────────────── */
function DonutChart({ steuer, sv, netto, total }: {
  steuer: number; sv: number; netto: number; total: number;
}) {
  const R    = 58;
  const circ = 2 * Math.PI * R;
  const pct  = (v: number) => (total > 0 ? v / total : 0);

  const nettoArc  = pct(netto)  * circ;
  const steuerArc = pct(steuer) * circ;
  const svArc     = pct(sv)     * circ;

  const svOff     = nettoArc + steuerArc;
  const steuerOff = nettoArc;

  const arc = (len: number, off: number, color: string) => (
    <circle
      r={R} cx={70} cy={70}
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeDasharray={`${len} ${circ - len}`}
      strokeDashoffset={-off + circ * 0.25}
      strokeLinecap="butt"
      style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)" }}
    />
  );

  return (
    <svg viewBox="0 0 140 140" className="w-[130px] h-[130px] sm:w-[140px] sm:h-[140px] -rotate-90 flex-shrink-0" aria-hidden="true">
      <circle r={R} cx={70} cy={70} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} />
      {arc(svArc,     svOff,     "#808080")}
      {arc(steuerArc, steuerOff, "#E60A1C")}
      {arc(nettoArc,  0,         "#FFFFFF")}
    </svg>
  );
}

/* ─── Breakdown progress bar ───────────────────────────────────────── */
function BreakdownBar({ steuer, sv, netto, total }: {
  steuer: number; sv: number; netto: number; total: number;
}) {
  const pct = (v: number) => `${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%`;
  return (
    <div className="flex h-3.5 rounded-full overflow-hidden w-full gap-1 p-0.5 bg-black/50 border border-white/10" role="img" aria-label="Gehaltsverteilung">
      <div className="progress-bar-fill rounded-l-full shadow-sm" style={{ width: pct(netto),  background: "#FFFFFF" }} />
      <div className="progress-bar-fill shadow-sm"                style={{ width: pct(steuer), background: "#E60A1C" }} />
      <div className="progress-bar-fill rounded-r-full shadow-sm" style={{ width: pct(sv),     background: "#808080" }} />
    </div>
  );
}

/* ─── Main Calculator ──────────────────────────────────────────────── */
interface CalculatorProps {
  initialBrutto?: number;
  initialJahr?: Steuerjahr;
  initialSk?: Steuerklasse;
}

export default function Calculator({ initialBrutto = 3800, initialJahr = 2026, initialSk = 1 }: CalculatorProps = {}) {
  const [bruttoMonat,  setBruttoMonat]  = useState<number>(initialBrutto);
  const [inputStr,     setInputStr]     = useState<string>(String(initialBrutto));
  const [inputError,   setInputError]   = useState<string>("");
  const [jahr,         setJahr]         = useState<Steuerjahr>(initialJahr);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(initialSk);
  const [kinderlosUeber23, setKinderlosUeber23] = useState(true);
  const [kirche,       setKirche]       = useState(false);
  const [isJahresansicht, setIsJahresansicht]   = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [showBundesland, setShowBundesland] = useState(false);
  const [showYearCompare, setShowYearCompare] = useState(false);

  const verheiratet = steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5;

  /* Sync URL params on mount */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = parseFloat(p.get("brutto") ?? "");
    const j = parseInt(p.get("jahr")    ?? "");
    const s = parseInt(p.get("sk")      ?? "");
    if (!isNaN(b) && b > 0 && b <= 200000) { setBruttoMonat(b); setInputStr(String(b)); }
    if (j === 2026 || j === 2027)           setJahr(j as Steuerjahr);
    if (s >= 1 && s <= 6)                   setSteuerklasse(s as Steuerklasse);
  }, []);

  /* Input validation */
  const handleBruttoChange = useCallback((raw: string) => {
    setInputStr(raw);
    const val = parseFloat(raw.replace(",", "."));
    if (raw === "" || isNaN(val)) {
      setInputError("Bitte einen gültigen Betrag eingeben");
      setBruttoMonat(0);
    } else if (val < 0) {
      setInputError("Der Betrag muss positiv sein");
      setBruttoMonat(0);
    } else if (val > 200000) {
      setInputError("Maximaler Betrag: 200.000 €");
      setBruttoMonat(200000);
    } else {
      setInputError("");
      setBruttoMonat(val);
    }
  }, []);

  const sliderPct = Math.min((bruttoMonat || 0) / 20000, 1) * 100;

  const result = useMemo(
    () => calculateNetto({
      bruttoMonat: Math.max(0, bruttoMonat || 0),
      jahr,
      verheiratet,
      kinderlosUeber23,
      kirche,
      kirchensteuerSatz: 0.09,
      steuerklasse,
    }),
    [bruttoMonat, jahr, verheiratet, kinderlosUeber23, kirche, steuerklasse]
  );

  const resBW_BY = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr,
    verheiratet,
    kinderlosUeber23,
    kirche: true,
    kirchensteuerSatz: 0.08,
    steuerklasse,
  }), [bruttoMonat, jahr, verheiratet, kinderlosUeber23, steuerklasse]);

  const resOtherStates = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr,
    verheiratet,
    kinderlosUeber23,
    kirche: true,
    kirchensteuerSatz: 0.09,
    steuerklasse,
  }), [bruttoMonat, jahr, verheiratet, kinderlosUeber23, steuerklasse]);

  const otherYear = jahr === 2026 ? 2027 : 2026;
  const resOtherYear = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr: otherYear,
    verheiratet,
    kinderlosUeber23,
    kirche,
    kirchensteuerSatz: 0.09,
    steuerklasse,
  }), [bruttoMonat, otherYear, verheiratet, kinderlosUeber23, kirche, steuerklasse]);

  const diffYear = result.nettoMonat - resOtherYear.nettoMonat;

  const animatedNetto = useAnimatedValue(
    isJahresansicht ? result.nettoJahr : result.nettoMonat
  );

  /* Share / copy link */
  const handleCopy = useCallback(async () => {
    const url = new URL(window.location.href.split("?")[0]);
    url.searchParams.set("brutto", bruttoMonat.toFixed(0));
    url.searchParams.set("jahr",   String(jahr));
    url.searchParams.set("sk",     String(steuerklasse));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }, [bruttoMonat, jahr, steuerklasse]);

  const showVal = (monthly: number) => isJahresansicht ? monthly * 12 : monthly;
  const sm = result.sv.summeMonat;
  const tm = result.steuer.summeMonat;
  const nm = result.nettoMonat;
  const bm = result.bruttoMonat;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <ReviewerByline />
      </div>
      <div className="rounded-3xl overflow-hidden border border-white/20 bg-[#101010] shadow-[0_0_60px_rgba(0,0,0,0.95)] w-full max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] w-full max-w-full min-w-0">

        {/* ═══ LEFT — Inputs ════════════════════════════════════════ */}
        <div className="p-4 sm:p-10 bg-[#101010] border-b md:border-b-0 md:border-r border-white/15 flex flex-col justify-between w-full max-w-full min-w-0">

          <div className="w-full max-w-full min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1 font-bold">Eingabe · Parameter</p>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">Ihr Bruttogehalt</h2>
              </div>
              {/* Monthly / Annual toggle */}
              <div className="flex items-center self-start sm:self-auto gap-1 bg-black/80 border border-white/15 rounded-2xl p-1.5 text-sm font-semibold flex-shrink-0">
                {[{ label: "/Monat", val: false }, { label: "/Jahr", val: true }].map(({ label, val }) => (
                  <button
                    key={label}
                    id={`ansicht-${val ? "jahr" : "monat"}`}
                    onClick={() => setIsJahresansicht(val)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all ${
                      isJahresansicht === val ? "bg-[#E60A1C] text-white shadow-[0_0_15px_rgba(230,10,28,0.6)] font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Brutto input ────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full">
              <label htmlFor="brutto-input" className="text-base font-bold text-white block mb-3">
                Bruttogehalt pro Monat
              </label>
              <div className="relative w-full max-w-full">
                <input
                  id="brutto-input"
                  type="number"
                  inputMode="decimal"
                  value={inputStr}
                  onChange={(e) => handleBruttoChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={`w-full max-w-full font-mono text-xl sm:text-2xl font-bold rounded-2xl border px-4 sm:px-6 py-3.5 sm:py-4.5 pr-14 sm:pr-20 transition-all outline-none ${
                    inputError
                      ? "border-red-500 bg-red-950/40 text-red-200 focus:border-red-500"
                      : "border-white/20 bg-[#161616] text-white focus:border-[#E60A1C] focus:bg-[#1C1C1C]"
                  }`}
                  min={0} max={200000} step={50}
                  aria-describedby={inputError ? "brutto-error" : undefined}
                  aria-invalid={!!inputError}
                />
                <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 font-mono text-sm sm:text-base font-bold">EUR</span>
              </div>
              {inputError && (
                <p id="brutto-error" role="alert" className="flex items-center gap-2 text-sm text-red-500 mt-2 font-medium">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {inputError}
                </p>
              )}

              {/* Salary slider */}
              <div className="mt-4 w-full max-w-full">
                <input
                  type="range"
                  id="brutto-slider"
                  aria-label="Bruttogehalt Schieberegler"
                  min={500} max={20000} step={50}
                  value={Math.min(Math.max(bruttoMonat || 500, 500), 20000)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setBruttoMonat(v);
                    setInputStr(String(v));
                    setInputError("");
                  }}
                  style={{ "--range-pct": `${sliderPct}%` } as React.CSSProperties}
                  className="w-full max-w-full block"
                />
                <div className="flex justify-between text-xs text-white/50 font-mono font-medium mt-1">
                  <span>500 €</span><span>20.000 €</span>
                </div>
              </div>
            </div>

            {/* ── Steuerjahr ────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full">
              <span className="text-base font-bold text-white block mb-3">Steuerjahr</span>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
                {([2026, 2027] as Steuerjahr[]).map((j) => (
                  <button
                    key={j}
                    id={`jahr-${j}`}
                    onClick={() => setJahr(j)}
                    className={`w-full py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold border transition-all ${
                      jahr === j
                        ? "text-white border-transparent shadow-[0_0_20px_rgba(230,10,28,0.4)]"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                    style={jahr === j ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                  >
                    {j}
                  </button>
                ))}
              </div>
              {jahr === 2027 && (
                <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-300 mt-3 bg-amber-950/40 rounded-2xl p-3.5 sm:p-4 border border-amber-500/30 font-medium">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-400" />
                  <span>Für 2027 liegen noch keine finalen Tarifwerte vor (Stand: Juli 2026). Es werden vorläufig die amtlichen 2026-Werte angezeigt.</span>
                </div>
              )}
            </div>

            {/* ── Steuerklasse ──────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full min-w-0">
              <span className="text-base font-bold text-white block mb-3">Steuerklasse</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full max-w-full min-w-0">
                {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                  <button
                    key={sk}
                    id={`sk-${sk}`}
                    onClick={() => setSteuerklasse(sk)}
                    title={STEUERKLASSE_INFO[sk]}
                    aria-pressed={steuerklasse === sk}
                    className={`sk-tab py-3 sm:py-3.5 rounded-2xl text-base sm:text-lg font-extrabold border transition-all w-full min-w-0 ${
                      steuerklasse === sk
                        ? "text-white border-transparent shadow-[0_0_20px_rgba(230,10,28,0.4)]"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                    style={steuerklasse === sk ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                  >
                    {sk}
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-2.5 flex items-center gap-2 font-medium">
                <ChevronRight size={16} className="text-[#E60A1C] flex-shrink-0" />
                <span className="truncate">{STEUERKLASSE_INFO[steuerklasse]}</span>
              </p>
            </div>

            {/* ── Toggles ───────────────────────────────────────── */}
            <div className="space-y-4 pt-6 border-t border-white/15 mb-8">
              <p className="text-xs font-bold text-[#E60A1C] uppercase tracking-widest mb-4">Weitere Optionen</p>
              <Toggle
                id="toggle-pflegeversicherung"
                checked={kinderlosUeber23}
                onChange={setKinderlosUeber23}
                label="Kinderlos & über 23 Jahre"
                hint="Pflegeversicherung +0,6 %"
              />
              <Toggle
                id="toggle-kirchensteuer"
                checked={kirche}
                onChange={setKirche}
                label="Kirchensteuerpflichtig"
                hint="9 % auf die Einkommensteuer"
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-3 text-sm text-white/70 bg-[#161616] rounded-2xl p-4 border border-white/15 leading-relaxed font-medium">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
            <span>Vereinfachte Berechnung nach § 32a EStG 2026. Keine Steuerberatung.</span>
          </div>
        </div>

        {/* ═══ RIGHT — Results (LUXURY FINTECH DASHBOARD) ════════════ */}
        <div className="p-4 sm:p-10 bg-[#0B0B0B] text-white flex flex-col justify-between w-full max-w-full min-w-0">

          <div className="w-full max-w-full min-w-0">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#E60A1C] rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#E60A1C] animate-pulse flex-shrink-0" />
                ERGEBNIS · {jahr}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/15 text-white/60 bg-white/5">
                  Juli 2026
                </span>
                <button
                  id="copy-link-btn"
                  onClick={handleCopy}
                  aria-label="Ergebnis-Link kopieren"
                  title="Link für dieses Ergebnis kopieren"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-xl border border-white/15 text-white/80 bg-white/5 hover:text-white hover:bg-white/15 hover:border-white/35 transition-all"
                >
                  {copied
                    ? <><Check size={14} className="text-[#E60A1C]" /><span>Kopiert!</span></>
                    : <><Share2 size={14} /><span>Teilen</span></>
                  }
                </button>
              </div>
            </div>

            {/* ── Main Netto Hero Card ───────────────────────────── */}
            <div className="bg-gradient-to-br from-[#181818] via-[#121212] to-[#0D0D0D] border border-white/20 rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E60A1C]/25 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="w-full">
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-white/70 font-semibold mb-2">
                    <Sparkles size={14} className="text-[#E60A1C] flex-shrink-0" />
                    <span>{isJahresansicht ? "Jahres-Nettogehalt" : "Monatliches Nettogehalt"}</span>
                  </div>
                  <p className="font-display font-black tabular-nums leading-none tracking-tight text-white text-3xl sm:text-5xl md:text-6xl number-animate break-all sm:break-normal">
                    {formatEUR(animatedNetto)}
                  </p>
                  {isJahresansicht && (
                    <p className="text-xs sm:text-sm text-white/60 mt-3 font-medium flex items-center gap-1.5">
                      Entspricht <strong className="text-white font-bold">{formatEUR(result.nettoMonat)}</strong> / Monat
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <span className="text-xs sm:text-sm font-medium text-white/60">Netto-Anteil</span>
                  <span className="text-2xl sm:text-4xl font-extrabold font-display text-white mt-0.5">
                    {bm > 0 ? Math.round((nm / bm) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* ── Donut + legend + bar Card ────────────────────────── */}
            <div className="bg-[#121212] border border-white/15 rounded-3xl p-5 sm:p-7 mb-6 sm:mb-8 shadow-lg">
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/60 font-bold mb-5">Verteilung von Brutto zu Netto</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 mb-5">
                {/* LARGE Donut */}
                <div className="relative flex-shrink-0">
                  <DonutChart netto={nm} steuer={tm} sv={sm} total={bm} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] sm:text-xs font-mono uppercase text-white/50 font-bold leading-none">Netto</p>
                      <p className="text-lg sm:text-xl font-black text-white leading-tight mt-1">
                        {bm > 0 ? Math.round((nm / bm) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clear Legend */}
                <div className="flex-1 w-full sm:w-auto min-w-0 space-y-3">
                  {[
                    { color: "#FFFFFF", label: "Nettogehalt",          val: showVal(nm), icon: CircleDollarSign },
                    { color: "#E60A1C", label: "Lohnsteuer & Soli",    val: showVal(tm), icon: Landmark },
                    { color: "#808080", label: "Sozialversicherungen", val: showVal(sm), icon: HeartPulse },
                  ].map(({ color, label, val, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between text-sm sm:text-base font-semibold gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: color }} />
                        <Icon size={16} className="text-white/70 flex-shrink-0" />
                        <span className="text-white/90 truncate">{label}</span>
                      </div>
                      <span className="font-mono font-bold text-white tabular-nums text-base sm:text-lg flex-shrink-0">{formatEUR(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <BreakdownBar netto={nm} steuer={tm} sv={sm} total={bm} />
              </div>
            </div>

            {/* ── Detailed breakdown (PROPER STRATIFIED CARDS) ──────── */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/60 font-bold mb-3">Detaillierte Aufschlüsselung</p>

              {/* Brutto Row */}
              <div className="flex justify-between items-center py-3.5 sm:py-4 px-4 sm:px-5 bg-white/[0.04] rounded-2xl border border-white/15 text-base sm:text-lg font-bold text-white gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <CircleDollarSign size={18} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">Bruttogehalt</span>
                </span>
                <span className="font-mono font-extrabold text-lg sm:text-xl text-white tabular-nums flex-shrink-0">{formatEUR(showVal(bm))}</span>
              </div>

              {/* Lohnsteuer Group */}
              <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-white/[0.02] rounded-xl border border-white/10 text-sm sm:text-lg font-bold text-white mt-4 gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <Landmark size={16} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">Steuern Gesamt</span>
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(tm))}</span>
              </div>
              
              <div className="pl-2 sm:pl-6 pr-1 sm:pr-4 space-y-1.5 text-xs sm:text-base text-white/80 font-medium py-1">
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-white/5 gap-2">
                  <span className="leading-snug">Einkommensteuer (Lohnsteuer)</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.einkommensteuerJahr / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-white/5 gap-2">
                  <span className="leading-snug">Solidaritätszuschlag</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.soliJahr / 12))}</span>
                </div>
                {result.steuer.kirchensteuerJahr > 0 && (
                  <div className="flex justify-between items-start sm:items-center py-1.5 gap-2">
                    <span className="leading-snug">Kirchensteuer</span>
                    <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.kirchensteuerJahr / 12))}</span>
                  </div>
                )}
              </div>

              {/* Sozialabgaben Group */}
              <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-white/[0.02] rounded-xl border border-white/10 text-sm sm:text-lg font-bold text-white mt-4 gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <HeartPulse size={16} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">Sozialabgaben Gesamt</span>
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(sm))}</span>
              </div>

              <div className="pl-2 sm:pl-6 pr-1 sm:pr-4 space-y-1.5 text-xs sm:text-base text-white/80 font-medium py-1">
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-white/5 gap-2">
                  <span className="leading-snug">Rentenversicherung (9,30 %)</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.sv.rente / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-white/5 gap-2">
                  <span className="leading-snug">Krankenversicherung (ca. 8,75 %)</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.sv.kranken / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-white/5 gap-2">
                  <span className="leading-snug">Pflegeversicherung</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.sv.pflege / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 gap-2">
                  <span className="leading-snug">Arbeitslosenversicherung (1,30 %)</span>
                  <span className="font-mono font-semibold tabular-nums text-white/90 flex-shrink-0">-{formatEUR(showVal(result.sv.arbeitslosen / 12))}</span>
                </div>
              </div>

            </div>

          </div>

          {/* ── Tax rates footer ────────────────────────────── */}
          <div className="bg-[#141414] border border-white/15 rounded-2xl p-4 sm:p-5 mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-base text-white/80 font-medium">
            <span className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#E60A1C] flex-shrink-0" />
              <span>Grenzsteuersatz: <strong className="text-white ml-1 font-bold">{result.grenzsteuersatzPct.toFixed(1)} %</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Briefcase size={16} className="text-[#E60A1C] flex-shrink-0" />
              <span>Ø-Steuersatz: <strong className="text-white ml-1 font-bold">{result.durchschnittssteuersatzPct.toFixed(1)} %</strong></span>
            </span>
          </div>

          {/* ── Expandable: Bundesland Comparison ──────────────────────── */}
          <div className="mt-4 bg-[#141414] border border-white/15 rounded-2xl overflow-hidden transition-all shadow-lg">
            <button
              type="button"
              onClick={() => setShowBundesland(!showBundesland)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#E60A1C] font-bold shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#E60A1C] transition-colors">
                    So unterscheidet sich Ihr Netto je Bundesland
                  </div>
                  <div className="text-xs text-white/50">
                    Kirchensteuer-Tarife (8 % vs. 9 %) & Pflegeversicherung regional
                  </div>
                </div>
              </div>
              <div className="text-white/60 group-hover:text-white ml-2 shrink-0">
                {showBundesland ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showBundesland && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 space-y-4 text-xs sm:text-sm text-white/80">
                <p className="leading-relaxed text-white/70">
                  Die Höhe der Abzüge hängt in Deutschland von Ihrem Wohnsitz-Bundesland ab. Bei Kirchensteuerpflicht gilt in Bayern und Baden-Württemberg ein ermäßigter Satz von <strong>8 %</strong>, in allen anderen 14 Bundesländern <strong>9 %</strong>. Zudem tragen Arbeitnehmer in Sachsen einen um 0,5 % höheren Eigenanteil an der Pflegeversicherung.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <div className="text-xs font-mono text-amber-400 font-bold mb-1">8 % K-Steuer</div>
                    <div className="font-bold text-white text-sm sm:text-base mb-1">Bayern & Baden-Württemberg</div>
                    <div className="text-xs text-white/60 mb-2">Bei Kirchensteuerpflicht im Jahr {jahr}:</div>
                    <div className="font-mono font-extrabold text-white text-base sm:text-lg bg-black/50 p-2 rounded border border-white/10 flex justify-between items-center">
                      <span>Netto ({isJahresansicht ? "Jahr" : "Mon."}):</span>
                      <span className="text-emerald-400">{formatEUR(showVal(resBW_BY.nettoMonat))}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <div className="text-xs font-mono text-rose-400 font-bold mb-1">9 % K-Steuer</div>
                    <div className="font-bold text-white text-sm sm:text-base mb-1">Übrige 14 Bundesländer</div>
                    <div className="text-xs text-white/60 mb-2">Bei Kirchensteuerpflicht im Jahr {jahr}:</div>
                    <div className="font-mono font-extrabold text-white text-base sm:text-lg bg-black/50 p-2 rounded border border-white/10 flex justify-between items-center">
                      <span>Netto ({isJahresansicht ? "Jahr" : "Mon."}):</span>
                      <span className="text-emerald-400">{formatEUR(showVal(resOtherStates.nettoMonat))}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Expandable: Year Comparison ────────────────────────────── */}
          <div className="mt-3 bg-[#141414] border border-white/15 rounded-2xl overflow-hidden transition-all shadow-lg">
            <button
              type="button"
              onClick={() => setShowYearCompare(!showYearCompare)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#E60A1C] font-bold shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#E60A1C] transition-colors">
                    Vergleich {jahr} vs. {otherYear} (Steuerreform & Tarifverlauf)
                  </div>
                  <div className="text-xs text-white/50">
                    {diffYear !== 0 ? (
                      <span>Differenz: <strong className={diffYear > 0 ? "text-emerald-400" : "text-rose-400"}>{diffYear > 0 ? `+${formatEUR(showVal(diffYear))}` : formatEUR(showVal(diffYear))}</strong> Netto ({isJahresansicht ? "/ Jahr" : "/ Monat"})</span>
                    ) : (
                      <span>Vergleichen Sie Ihr Netto zwischen Steuerjahr 2026 und 2027</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-white/60 group-hover:text-white ml-2 shrink-0">
                {showYearCompare ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showYearCompare && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 space-y-4 text-xs sm:text-sm text-white/80">
                <p className="leading-relaxed text-white/70">
                  Durch den angepassten Steuertarif nach § 32a EStG und modifizierte Beitragsbemessungsgrenzen verändert sich Ihr Nettogehalt bei gleichem Bruttogehalt wie folgt:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <div className="text-xs font-mono text-white/50 uppercase mb-1">Ausgewähltes Jahr</div>
                    <div className="font-bold text-white text-base mb-2">Steuerjahr {jahr}</div>
                    <div className="font-mono font-extrabold text-white text-base sm:text-lg bg-black/50 p-2.5 rounded border border-white/10 flex justify-between items-center">
                      <span>Netto ({isJahresansicht ? "Jahr" : "Mon."}):</span>
                      <span className="text-white font-bold">{formatEUR(showVal(result.nettoMonat))}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <div className="text-xs font-mono text-white/50 uppercase mb-1">Vergleichsjahr</div>
                    <div className="font-bold text-white text-base mb-2">Steuerjahr {otherYear}</div>
                    <div className="font-mono font-extrabold text-white text-base sm:text-lg bg-black/50 p-2.5 rounded border border-white/10 flex justify-between items-center">
                      <span>Netto ({isJahresansicht ? "Jahr" : "Mon."}):</span>
                      <span className="text-emerald-400 font-bold">{formatEUR(showVal(resOtherYear.nettoMonat))}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#E60A1C]/10 border border-[#E60A1C]/30 rounded-xl text-white/90 text-xs sm:text-sm flex items-center justify-between font-medium">
                  <span>Rechnerische Netto-Differenz ({isJahresansicht ? "jährlich" : "monatlich"}):</span>
                  <span className={`font-mono font-bold text-sm sm:text-base ${diffYear >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {diffYear > 0 ? `+${formatEUR(showVal(diffYear))}` : formatEUR(showVal(diffYear))}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */
function Toggle({
  id, checked, onChange, label, hint,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-3.5 cursor-pointer select-none group">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(!checked); } }}
        className="relative flex-shrink-0 rounded-full transition-all duration-200 focus:outline-none"
        style={{
          width: "50px", height: "28px",
          background: checked ? "#E60A1C" : "rgba(255,255,255,0.15)",
          boxShadow: checked ? "0 0 15px rgba(230,10,28,0.60)" : "none",
        }}
      >
        <span
          className="absolute top-[3px] left-[3px] rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ width: "22px", height: "22px", transform: checked ? "translateX(22px)" : "none" }}
        />
      </button>
      <span>
        <span className="text-base text-white/90 group-hover:text-white transition-colors font-semibold">{label}</span>
        {hint && <span className="block text-xs text-white/60 font-normal mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}
