"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

const ORIGIN = "https://bruttonettocalculator.com";

/**
 * Erzeugt den Einbettungscode und zeigt eine Live-Vorschau.
 *
 * Wichtig am Snippet: Der Markenverweis steht AUSSERHALB des iframes. Inhalte
 * in einem iframe gehören für Suchmaschinen zur Quell-Domain — ein Link darin
 * wäre ein Link von uns auf uns und damit wertlos. Nur der Absatz unter dem
 * iframe steht wirklich im HTML der einbettenden Seite.
 */
export default function WidgetBuilder() {
  const [accent, setAccent] = useState("E60A1C");
  const [brutto, setBrutto] = useState(3500);
  const [height, setHeight] = useState(520);
  const [withCredit, setWithCredit] = useState(true);
  const [copied, setCopied] = useState(false);

  const src = `${ORIGIN}/embed/brutto-netto?accent=${accent}&brutto=${brutto}`;

  const code = useMemo(() => {
    const iframe = `<iframe
  src="${src}"
  title="Brutto-Netto-Rechner 2026"
  width="100%"
  height="${height}"
  loading="lazy"
  style="border:0;max-width:760px;display:block;margin:0 auto"
  id="bnc-widget"
></iframe>`;

    const resize = `<script>
  // Passt die iframe-Höhe an den Inhalt an (verhindert Scrollbalken).
  window.addEventListener("message", function (e) {
    if (e.origin !== "${ORIGIN}") return;
    if (e.data && e.data.type === "bnc-embed-height") {
      var f = document.getElementById("bnc-widget");
      if (f) f.style.height = e.data.height + "px";
    }
  });
</script>`;

    const credit = `<p style="text-align:center;font-size:12px;margin-top:6px">
  Rechner bereitgestellt von <a href="${ORIGIN}/" target="_blank" rel="noopener">BruttoNettoCalculator.com</a>
</p>`;

    return [iframe, withCredit ? credit : null, resize].filter(Boolean).join("\n\n");
  }, [src, height, withCredit]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard gesperrt — der Code steht sichtbar im Textfeld. */
    }
  }

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
      {/* ── Einstellungen ── */}
      <div className="bg-white border border-black/[0.08] rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-black text-lg text-[#16181D]">Anpassen</h2>

        <label className="block">
          <span className="block text-xs font-bold text-black/55 mb-2">Akzentfarbe</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={`#${accent}`}
              onChange={(e) => setAccent(e.target.value.replace("#", ""))}
              className="w-11 h-11 rounded-lg border border-black/10 cursor-pointer bg-white p-1"
              aria-label="Akzentfarbe wählen"
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => setAccent(e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6))}
              className="flex-1 px-3 py-2.5 rounded-lg border border-black/[0.14] font-mono text-sm"
              aria-label="Akzentfarbe als Hex-Wert"
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-black/55 mb-2">Vorbelegtes Bruttogehalt</span>
          <input
            type="number"
            value={brutto}
            min={0}
            step={100}
            onChange={(e) => setBrutto(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2.5 rounded-lg border border-black/[0.14] text-sm font-semibold"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-black/55 mb-2">Starthöhe (px)</span>
          <input
            type="number"
            value={height}
            min={300}
            step={20}
            onChange={(e) => setHeight(Math.max(300, Number(e.target.value)))}
            className="w-full px-3 py-2.5 rounded-lg border border-black/[0.14] text-sm font-semibold"
          />
          <span className="block text-[11px] text-black/40 mt-1.5">
            Wird per Skript automatisch an den Inhalt angepasst.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={withCredit}
            onChange={(e) => setWithCredit(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#E60A1C]"
          />
          <span className="text-sm text-black/70 leading-snug">
            Quellenhinweis unter dem Rechner
            <span className="block text-[11px] text-black/40 mt-0.5">
              Freiwillig. Wir freuen uns darüber, das Widget funktioniert aber auch ohne.
            </span>
          </span>
        </label>
      </div>

      {/* ── Code + Vorschau ── */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-black text-lg text-[#16181D] flex items-center gap-2">
              <Code2 size={18} className="text-[#E60A1C]" />
              Einbettungscode
            </h2>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: copied ? "#16a34a" : "linear-gradient(135deg,#E60A1C,#FF2436)" }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Kopiert" : "Kopieren"}
            </button>
          </div>
          <textarea
            readOnly
            value={code}
            rows={14}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full font-mono text-[12px] leading-relaxed p-4 rounded-2xl border border-black/[0.12] bg-[#16181D] text-[#E6E8EB] resize-y"
            aria-label="Einbettungscode zum Kopieren"
          />
        </div>

        <div>
          <h2 className="font-display font-black text-lg text-[#16181D] mb-3">Live-Vorschau</h2>
          <div className="rounded-2xl border border-black/[0.12] bg-[#F7F8FA] p-4">
            <iframe
              key={src}
              src={src.replace(ORIGIN, "")}
              title="Vorschau des Brutto-Netto-Widgets"
              width="100%"
              height={height}
              style={{ border: 0, display: "block", maxWidth: 760, margin: "0 auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
