"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Gift, Info } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { TVOED_VKA_2026, JAHRESSONDERZAHLUNG_VKA_PROZENT, GUELTIG_AB } from "@/data/tvoed";
import { TVOED_SUE_2026 } from "@/data/tvoedSue";

/*
 * Interaktiver TVöD-Netto-Rechner. Nur Tabellen mit geprüfter Quelle:
 * TVöD VKA allgemein (data/tvoed.ts) und SuE (data/tvoedSue.ts), beide gültig
 * ab 1.5.2026. TVöD Bund und die P-Tabelle fehlen bewusst — sie haben eigene
 * Beträge und dürfen nicht abgeleitet werden.
 * Jahressonderzahlung VKA 85 % (auch S-Tabelle), Netto über lib/einmalzahlung.
 * Vereinfachung: Bemessung der JSZ mit dem aktuellen Monatsentgelt statt dem
 * Durchschnitt Juli bis September.
 */

type Tarif = "vka" | "sue";
const TARIFE: Record<Tarif, { label: string; gruppen: { slug: string; label: string; stufen: (number | null)[] }[] }> = {
  vka: { label: "TVöD VKA (allgemein, E 1 bis E 15Ü)", gruppen: TVOED_VKA_2026 },
  sue: { label: "TVöD SuE (Sozial- und Erziehungsdienst, S-Gruppen)", gruppen: TVOED_SUE_2026 },
};

const SK_LABEL: Record<Steuerklasse, string> = {
  1: "I — Ledig", 2: "II — Alleinerziehend", 3: "III — Verheiratet", 4: "IV — Verheiratet", 5: "V — Verheiratet", 6: "VI — Zweitjob",
};

const cls =
  "w-full bg-[#FFFFFF] border border-black/[0.12] rounded-xl px-3.5 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function TvoedNettoRechner() {
  const [tarif, setTarif] = useState<Tarif>("vka");
  const [slug, setSlug] = useState("e9b");
  const [stufe, setStufe] = useState(3);
  const [teilzeit, setTeilzeit] = useState(100);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos, setKinderlos] = useState(true);

  const gruppen = TARIFE[tarif].gruppen;
  const gruppe = gruppen.find((g) => g.slug === slug) ?? gruppen[0];
  const belegte = gruppe.stufen.map((v, i) => ({ stufe: i + 1, v })).filter((x) => x.v !== null);
  const stufeEff = belegte.some((x) => x.stufe === stufe) ? stufe : belegte[0].stufe;
  const tabellenentgelt = gruppe.stufen[stufeEff - 1] ?? 0;

  const r = useMemo(() => {
    const brutto = (tabellenentgelt * Math.min(100, Math.max(1, teilzeit))) / 100;
    const n = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      steuerklasse: sk,
      verheiratet: sk === 3 || sk === 4 || sk === 5,
      kinderlosUeber23: kinderlos,
      kirche,
    });
    const jsz = (brutto * JAHRESSONDERZAHLUNG_VKA_PROZENT) / 100;
    const jszNetto = nettoEinmalzahlung({ bruttoMonat: brutto, einmal: jsz, steuerklasse: sk, kirche, kinderlosUeber23: kinderlos, auszahlungsMonat: 11 });
    return { brutto, n, jsz, jszNetto };
  }, [tabellenentgelt, teilzeit, sk, kirche, kinderlos]);

  return (
    <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-1 flex items-center gap-2">
        <Calculator size={22} className="text-[#E60A1C]" /> TVöD Netto-Rechner
      </h2>
      <p className="text-sm text-black/60 mb-5">Tabellen gültig ab {GUELTIG_AB}. Entgeltgruppe, Stufe und Arbeitszeit wählen.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="tv-tarif" className="block text-sm font-semibold text-black/70 mb-1.5">Tabelle</label>
            <select
              id="tv-tarif"
              value={tarif}
              onChange={(e) => {
                const t = e.target.value as Tarif;
                setTarif(t);
                setSlug(t === "vka" ? "e9b" : "s8a");
              }}
              className={cls}
            >
              {(Object.keys(TARIFE) as Tarif[]).map((t) => (
                <option key={t} value={t}>{TARIFE[t].label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tv-eg" className="block text-sm font-semibold text-black/70 mb-1.5">Entgeltgruppe</label>
              <select id="tv-eg" value={gruppe.slug} onChange={(e) => setSlug(e.target.value)} className={cls}>
                {gruppen.map((g) => (
                  <option key={g.slug} value={g.slug}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tv-stufe" className="block text-sm font-semibold text-black/70 mb-1.5">Stufe</label>
              <select id="tv-stufe" value={stufeEff} onChange={(e) => setStufe(Number(e.target.value))} className={cls}>
                {belegte.map((x) => (
                  <option key={x.stufe} value={x.stufe}>Stufe {x.stufe}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="tv-tz" className="block text-sm font-semibold text-black/70 mb-1.5">
              Arbeitszeit: {teilzeit} % {teilzeit < 100 ? "(Teilzeit)" : "(Vollzeit)"}
            </label>
            <input id="tv-tz" type="range" min={20} max={100} step={5} value={teilzeit} onChange={(e) => setTeilzeit(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label htmlFor="tv-sk" className="block text-sm font-semibold text-black/70 mb-1.5">Steuerklasse</label>
            <select id="tv-sk" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={cls}>
              {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((k) => (
                <option key={k} value={k}>{SK_LABEL[k]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
              <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
              Kirchensteuer (9 %)
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
              <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
              Kinderlos ab 23
            </label>
          </div>
        </div>

        <div className="space-y-3" aria-live="polite">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-500/25 p-4">
            <p className="text-sm font-semibold text-black/70">
              {gruppe.label}, Stufe {stufeEff}{teilzeit < 100 ? `, ${teilzeit} %` : ""}: netto im Monat
            </p>
            <p className="text-3xl font-mono font-extrabold text-emerald-700 mt-1">{formatEUR(r.n.nettoMonat)}</p>
          </div>
          <div className="divide-y divide-black/[0.06] text-sm">
            {[
              { l: "Tabellenentgelt (Vollzeit)", v: tabellenentgelt },
              { l: "Brutto bei Ihrer Arbeitszeit", v: r.brutto },
              { l: "Lohnsteuer, Soli, Kirchensteuer", v: -r.n.steuer.summeMonat },
              { l: "Sozialabgaben", v: -r.n.sv.summeMonat },
            ].map((z) => (
              <div key={z.l} className="flex flex-wrap items-center justify-between gap-x-3 py-1.5">
                <span className="text-black/65">{z.l}</span>
                <span className="ml-auto font-mono tabular-nums">{z.v < 0 ? "−" : ""}{formatEUR(Math.abs(z.v))}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#F4F5F7] border border-black/[0.08] p-4 text-sm">
            <p className="font-bold text-[#16181D] flex items-center gap-1.5">
              <Gift size={15} className="text-[#E60A1C]" /> Jahressonderzahlung (November)
            </p>
            <p className="mt-1 text-black/70">
              {JAHRESSONDERZAHLUNG_VKA_PROZENT} % = {formatEUR(r.jsz)} brutto, davon rund{" "}
              <strong className="text-[#16181D]">{formatEUR(r.jszNetto.netto)} netto</strong>. Genauer rechnet der{" "}
              <Link href="/weihnachtsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Weihnachtsgeld-Rechner</Link>.
            </p>
          </div>
          <p className="text-xs text-black/50 flex gap-1.5">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Ohne Zulagen, Zuschläge und Zusatzversorgung (VBL/ZVK-Umlage). Steuerjahr 2026, Ø-Zusatzbeitrag 2,9 %. Alle Angaben
            ohne Gewähr.
          </p>
        </div>
      </div>
    </div>
  );
}
