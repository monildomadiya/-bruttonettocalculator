import Link from "next/link";
import { type ReactNode } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { siteConfig } from "@/lib/authors";
import AdUnit from "@/components/AdUnit";

/**
 * The shared long-form content block that sits under every calculator.
 *
 * Why it exists: measured on production 2026-08-31, the secondary tool pages
 * carried 343–427 words of main content against ~1.620 on the homepage. That is
 * the reason the homepage ranks and the other ~70 tools do not — they are thin
 * pages competing for commercial German finance keywords against 1.500–3.000
 * word competitors.
 *
 * Deliberately a **server** component, imported per page rather than injected
 * globally from the layout. Injecting it globally would need the pathname, and
 * reading `headers()` in the layout opts every route out of static rendering —
 * the site currently serves `x-nextjs-cache: HIT`, which is worth more than the
 * saved import lines. As a server component the prose also never enters the
 * client bundle.
 *
 * Structure is chosen for how answers get extracted, not just for reading:
 *  - `answer` is a self-contained 40–60 word direct answer that restates the
 *    question — the shape Google lifts for featured snippets and the shape
 *    ChatGPT/Perplexity/AI Overviews quote;
 *  - `facts` renders as a definition table of specific figures with units and a
 *    year, which is what AI answers cite in preference to prose;
 *  - `steps` and `sections` carry the depth and the contextual internal links.
 */

export interface ToolFact {
  label: string;
  value: string;
}

export interface ToolStep {
  title: string;
  text: string;
}

export interface ToolTable {
  caption: string;
  head: string[];
  rows: string[][];
  note?: string;
}

export interface ToolSection {
  h3: string;
  /** Paragraphs. Supports `**bold**` and `[label](/pfad)` internal links. */
  body: string[];
}

export interface ToolContentConfig {
  heading: string;
  answer: string;
  facts: ToolFact[];
  steps: ToolStep[];
  table?: ToolTable;
  sections: ToolSection[];
  /** Legal basis / data source line, e.g. "§ 3 Nr. 63 EStG". */
  source?: string;
}

/**
 * Minimal inline renderer for `**bold**` and `[label](/pfad)`.
 *
 * Kept to those two forms on purpose: the configs are hand-written German copy,
 * and a full Markdown dependency for bold-plus-links would be more surface than
 * the feature needs. Internal links go through next/link so they prefetch; the
 * pattern only accepts hrefs starting with "/", so a typo can never emit an
 * outbound link from body copy we did not intend.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((\/[^)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      out.push(
        <Link
          key={keyPrefix + "-l" + i++}
          href={m[2]}
          className="text-[#E60A1C] font-semibold hover:underline underline-offset-2"
        >
          {m[1]}
        </Link>
      );
    } else if (m[3]) {
      out.push(
        <strong key={keyPrefix + "-b" + i++} className="text-[#16181D] font-bold">
          {m[3]}
        </strong>
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ToolContent({ config }: { config: ToolContentConfig }) {
  const { heading, answer, facts, steps, table, sections, source } = config;

  return (
    <section className="max-w-6xl mx-auto px-5 py-6" aria-labelledby="tool-content-heading">
      <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-10 space-y-8">
        <h2
          id="tool-content-heading"
          className="text-2xl sm:text-3xl font-extrabold text-[#16181D] leading-tight"
        >
          {heading}
        </h2>

        {/* Direct answer — the passage built to be quoted verbatim. */}
        <div className="bg-white border-l-4 border-[#E60A1C] border-y border-r border-black/[0.08] rounded-r-2xl px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[#16181D] text-base sm:text-lg leading-relaxed font-medium">
            {inline(answer, "ans")}
          </p>
        </div>

        {/* Key figures — the citable ones, with units and a year. */}
        {facts.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-4">
              Die wichtigsten Werte auf einen Blick
            </h3>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-4 border-b border-black/[0.07] py-3"
                >
                  <dt className="text-sm text-black/65 font-medium">{f.label}</dt>
                  <dd className="text-sm font-mono font-extrabold text-[#16181D] text-right whitespace-nowrap">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Mid-content ad. Placed after the key figures rather than before
            them: the reader gets what they came for first, and the unit then
            sits between two text blocks, which is where a square renders best
            and where AdSense's own placement guidance puts in-content units. */}
        <AdUnit slot="midContent" className="!my-2" />

        {/* Engine-computed example table. */}
        {table && (
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-4">{table.caption}</h3>
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-[480px] text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-black/[0.12]">
                    {table.head.map((h, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={
                          "py-3 px-3 font-extrabold text-[#16181D] text-xs uppercase tracking-wide " +
                          (i === 0 ? "text-left" : "text-right")
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-black/[0.07]">
                      {r.map((c, ci) => (
                        <td
                          key={ci}
                          className={
                            "py-3 px-3 " +
                            (ci === 0
                              ? "text-left font-semibold text-[#16181D]"
                              : "text-right font-mono text-black/75")
                          }
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.note && (
              <p className="flex items-start gap-2 text-xs text-black/55 mt-3 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                <span>{inline(table.note, "tn")}</span>
              </p>
            )}
          </div>
        )}

        {/* Method — ordered, so the calculation is auditable. */}
        {steps.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-4">
              So wird gerechnet — Schritt für Schritt
            </h3>
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E60A1C] text-white text-xs font-extrabold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#16181D] text-sm sm:text-base">{s.title}</div>
                    <p className="text-black/70 text-sm sm:text-base leading-relaxed mt-1">
                      {inline(s.text, "st" + i)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Depth + the contextual internal links that spread ranking signal. */}
        {sections.map((sec, i) => (
          <div key={i}>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-3">{sec.h3}</h3>
            <div className="space-y-4">
              {sec.body.map((p, pi) => (
                <p key={pi} className="text-black/70 text-sm sm:text-base leading-relaxed">
                  {inline(p, "s" + i + "p" + pi)}
                </p>
              ))}
            </div>
          </div>
        ))}

        <p className="flex items-start gap-2 text-xs text-black/50 pt-2 border-t border-black/[0.07] leading-relaxed">
          <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5 text-emerald-600" />
          <span>
            {source ? source + " · " : ""}
            Rechenwerte {siteConfig.sourceSV}. Stand: {siteConfig.lastUpdatedDisplay}. Keine
            Steuerberatung.
          </span>
        </p>
      </div>
    </section>
  );
}
