"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Award, Calculator, Minus } from "lucide-react";
import type { Kassenart, Krankenkasse } from "@/data/krankenkassen";

/*
 * Tabelle und Mini-Rechner der Seite /zusatzbeitrag-2027.
 * Regel wie überall auf der Site: Ein Kassensatz 2027 erscheint nur, wenn er in
 * data/krankenkassen.ts gepflegt ist. Sonst "noch nicht bekannt" — keine Schätzung.
 * Im Rechner zeigt die Spalte 2027 bis dahin nur den Effekt der neuen
 * Beitragsbemessungsgrenze bei unverändertem Satz, klar beschriftet.
 */

type SortKey = "z2026" | "z2027" | "name" | "diff";
const ARTEN: (Kassenart | "alle")[] = ["alle", "AOK", "BKK", "IKK", "Ersatzkasse", "Knappschaft"];

const pct = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";
const eur = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const inputCls =
  "w-full bg-[#FFFFFF] border border-black/[0.12] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function ZusatzbeitragVergleich({
  kassen,
  bbgMonat2026,
  bbgMonat2027,
}: {
  kassen: Krankenkasse[];
  bbgMonat2026: number;
  /** BMAS-Referentenentwurf — vorläufig. */
  bbgMonat2027: number;
}) {
  const [art, setArt] = useState<Kassenart | "alle">("alle");
  const [nurBundesweit, setNurBundesweit] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "z2026", asc: true });
  const [brutto, setBrutto] = useState(4000);
  const [slug, setSlug] = useState("tk");

  const hat2027 = kassen.some((k) => k.zusatzbeitrag2027 !== undefined);
  const guenstigste2026 = useMemo(() => [...kassen].sort((a, b) => a.zusatzbeitrag - b.zusatzbeitrag)[0], [kassen]);
  const guenstigste2027 = useMemo(
    () =>
      [...kassen]
        .filter((k) => k.zusatzbeitrag2027 !== undefined)
        .sort((a, b) => (a.zusatzbeitrag2027 ?? 0) - (b.zusatzbeitrag2027 ?? 0))[0],
    [kassen],
  );
  const highlight = guenstigste2027 ?? guenstigste2026;

  const zeilen = useMemo(() => {
    const val = (k: Krankenkasse): number | string => {
      switch (sort.key) {
        case "name":
          return k.name.toLowerCase();
        case "z2027":
          return k.zusatzbeitrag2027 ?? Number.POSITIVE_INFINITY;
        case "diff":
          return k.zusatzbeitrag2027 !== undefined ? k.zusatzbeitrag2027 - k.zusatzbeitrag : Number.POSITIVE_INFINITY;
        default:
          return k.zusatzbeitrag;
      }
    };
    return kassen
      .filter((k) => (art === "alle" || k.art === art) && (!nurBundesweit || k.bundesweit))
      .sort((a, b) => {
        const x = val(a);
        const y = val(b);
        const c = typeof x === "string" ? x.localeCompare(y as string, "de") : (x as number) - (y as number);
        return sort.asc ? c : -c;
      });
  }, [kassen, art, nurBundesweit, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }));

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 font-mono uppercase tracking-wider hover:text-[#E60A1C]"
      aria-label={`Nach ${label} sortieren`}
    >
      {label}
      {sort.key === k ? (sort.asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="opacity-40" />}
    </button>
  );

  // Mini-Rechner: Arbeitnehmeranteil am Zusatzbeitrag pro Monat.
  const kasse = kassen.find((k) => k.slug === slug) ?? kassen[0];
  const b = Math.max(0, brutto || 0);
  const kosten = (satz: number, bbg: number) => (Math.min(b, bbg) * satz) / 100 / 2;
  const k2026 = kosten(kasse.zusatzbeitrag, bbgMonat2026);
  const k2027 = kasse.zusatzbeitrag2027 !== undefined ? kosten(kasse.zusatzbeitrag2027, bbgMonat2027) : null;
  const k2027BbgEffekt = kosten(kasse.zusatzbeitrag, bbgMonat2027);
  const guenstigBundesweit = [...kassen].filter((k) => k.bundesweit).sort((x, y) => x.zusatzbeitrag - y.zusatzbeitrag)[0];
  const ersparnis = k2026 - kosten(guenstigBundesweit.zusatzbeitrag, bbgMonat2026);

  return (
    <>
      {/* Mini-Rechner */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm mb-10" id="rechner">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-1 flex items-center gap-2">
          <Calculator size={22} className="text-[#E60A1C]" /> Was kostet mich der neue Zusatzbeitrag?
        </h2>
        <p className="text-sm text-black/60 mb-5">Ihr Anteil am Zusatzbeitrag pro Monat. Den Zusatzbeitrag teilen sich Arbeitnehmer und Arbeitgeber je zur Hälfte.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label htmlFor="zb-brutto" className="block text-sm font-semibold text-black/70 mb-2">Monatsbrutto</label>
            <input id="zb-brutto" type="number" min={0} inputMode="decimal" value={brutto} onChange={(e) => setBrutto(Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="zb-kasse" className="block text-sm font-semibold text-black/70 mb-2">Ihre Krankenkasse</label>
            <select id="zb-kasse" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls}>
              {[...kassen].sort((x, y) => x.name.localeCompare(y.name, "de")).map((k) => (
                <option key={k.slug} value={k.slug}>{k.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-live="polite">
          <div className="rounded-2xl bg-[#F4F5F7] border border-black/[0.08] p-4">
            <p className="text-xs font-semibold text-black/60">2026 ({pct(kasse.zusatzbeitrag)})</p>
            <p className="text-xl font-mono font-extrabold text-[#16181D] mt-1">{eur(k2026)}</p>
          </div>
          <div className="rounded-2xl bg-[#F4F5F7] border border-black/[0.08] p-4">
            {k2027 !== null ? (
              <>
                <p className="text-xs font-semibold text-black/60">2027 ({pct(kasse.zusatzbeitrag2027!)})</p>
                <p className="text-xl font-mono font-extrabold text-[#16181D] mt-1">{eur(k2027)}</p>
                <p className={`text-xs font-bold mt-1 ${k2027 - k2026 > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                  {k2027 - k2026 >= 0 ? "+" : ""}{eur(k2027 - k2026)} im Monat
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-black/60">2027: Satz noch nicht bekannt</p>
                <p className="text-xl font-mono font-extrabold text-[#16181D] mt-1">{eur(k2027BbgEffekt)}</p>
                <p className="text-xs text-black/60 mt-1">
                  bei gleichem Satz, nur mit der höheren Beitragsbemessungsgrenze (Entwurf)
                  {k2027BbgEffekt - k2026 > 0.005 ? `: +${eur(k2027BbgEffekt - k2026)}` : ""}
                </p>
              </>
            )}
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-500/25 p-4">
            <p className="text-xs font-semibold text-black/60">Wechsel zur {guenstigBundesweit.name}</p>
            <p className="text-xl font-mono font-extrabold text-emerald-700 mt-1">
              {ersparnis > 0.005 ? `−${eur(ersparnis)}` : eur(0)}
            </p>
            <p className="text-xs text-black/60 mt-1">
              {ersparnis > 0.005 ? `im Monat, ${eur(ersparnis * 12)} im Jahr (Sätze 2026)` : "Sie sind schon bei der günstigsten bundesweiten Kasse der Auswahl."}
            </p>
          </div>
        </div>
        <p className="text-xs text-black/50 mt-4">
          Beitragsbemessungsgrenze 2026: {eur(bbgMonat2026)} im Monat; 2027 laut BMAS-Entwurf {eur(bbgMonat2027)} (vorläufig). Ihr
          vollständiges Netto mit dem Satz Ihrer Kasse rechnet der{" "}
          <Link href="/brutto-netto-rechner-krankenkasse" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner mit Krankenkasse</Link>.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label="Kassenart filtern">
        {ARTEN.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={art === a}
            onClick={() => setArt(a)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-bold border transition-colors ${
              art === a ? "bg-[#E60A1C] text-white border-transparent" : "bg-[#FFFFFF] text-black/70 border-black/[0.12] hover:border-black/30"
            }`}
          >
            {a === "alle" ? "Alle" : a}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
          <input type="checkbox" checked={nurBundesweit} onChange={(e) => setNurBundesweit(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
          nur bundesweit wählbar
        </label>
      </div>

      {/* Tabelle */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px] text-sm sm:text-base">
          <caption className="sr-only">Zusatzbeitrag 2026 und 2027 der Krankenkassen</caption>
          <thead>
            <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs text-black/70">
              <th className="py-3.5 px-4"><SortBtn k="name" label="Kasse" /></th>
              <th className="py-3.5 px-4 font-mono uppercase tracking-wider">Art</th>
              <th className="py-3.5 px-4 text-right"><SortBtn k="z2026" label="2026" /></th>
              <th className="py-3.5 px-4 text-right"><SortBtn k="z2027" label="2027" /></th>
              <th className="py-3.5 px-4 text-right"><SortBtn k="diff" label="Änderung" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {zeilen.map((k) => {
              const diff = k.zusatzbeitrag2027 !== undefined ? k.zusatzbeitrag2027 - k.zusatzbeitrag : null;
              const top = k.slug === highlight.slug;
              return (
                <tr key={k.slug} className={top ? "bg-emerald-50/70" : undefined}>
                  <td className="py-3 px-4">
                    <Link href={`/krankenkasse/${k.slug}`} className="font-semibold text-[#16181D] hover:text-[#E60A1C]">{k.name}</Link>
                    {top && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-full px-2 py-0.5 align-middle">
                        <Award size={11} /> günstigste {guenstigste2027 ? "2027" : "2026"}
                      </span>
                    )}
                    {!k.bundesweit && <span className="block text-xs text-black/50">nur {k.region}</span>}
                  </td>
                  <td className="py-3 px-4 text-black/70">{k.art}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">{pct(k.zusatzbeitrag)}</td>
                  <td className="py-3 px-4 text-right font-mono">
                    {k.zusatzbeitrag2027 !== undefined ? <strong>{pct(k.zusatzbeitrag2027)}</strong> : <span className="text-black/45 text-xs sm:text-sm">noch nicht bekannt</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {diff === null ? (
                      <span className="text-black/35">–</span>
                    ) : diff > 0.0001 ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold"><ArrowUp size={13} />+{diff.toLocaleString("de-DE", { maximumFractionDigits: 2 })} Pp.</span>
                    ) : diff < -0.0001 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold"><ArrowDown size={13} />{diff.toLocaleString("de-DE", { maximumFractionDigits: 2 })} Pp.</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-black/60"><Minus size={13} />unverändert</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!hat2027 && (
        <p className="text-xs text-black/55 mt-3">
          Noch hat keine Kasse dieser Auswahl ihren Satz für 2027 veröffentlicht. Die meisten beschließen ihn im Dezember; wir tragen
          jeden Wert nach, sobald die Kasse ihn bekannt gibt.
        </p>
      )}
    </>
  );
}
