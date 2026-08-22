"use client";

import { useMemo, useState, useEffect } from "react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";

/**
 * Schlanke Rechner-Variante für die iframe-Einbettung auf fremden Seiten.
 *
 * Bewusst NICHT der große Rechner aus components/Calculator.tsx: Der bringt
 * Werbung, Share-Buttons, Byline und Erklärtexte mit — alles Dinge, die in
 * einem fremden Layout stören und den Betreiber davon abhalten, das Widget
 * überhaupt einzubauen. Hier zählt: klein, schnell, ohne Ballast, funktioniert
 * in jeder Breite ab ~300 px.
 *
 * Die Rechenlogik ist dieselbe (lib/taxCalculator.ts) — ein Widget, das andere
 * Zahlen liefert als die eigene Website, wäre schlimmer als kein Widget.
 */

const STEUERKLASSEN: { value: Steuerklasse; label: string }[] = [
  { value: 1, label: "I — Alleinstehend" },
  { value: 2, label: "II — Alleinerziehend" },
  { value: 3, label: "III — Verheiratet, höheres Einkommen" },
  { value: 4, label: "IV — Verheiratet, gleiches Einkommen" },
  { value: 5, label: "V — Verheiratet, geringeres Einkommen" },
  { value: 6, label: "VI — Zweitjob" },
];

export default function EmbedCalculator({
  accent = "#E60A1C",
  defaultBrutto = 3500,
}: {
  accent?: string;
  defaultBrutto?: number;
}) {
  const [brutto, setBrutto] = useState(defaultBrutto);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos, setKinderlos] = useState(true);

  const r = useMemo(
    () =>
      calculateNetto({
        bruttoMonat: brutto || 0,
        jahr: 2026,
        verheiratet: steuerklasse === 3 || steuerklasse === 5,
        kinderlosUeber23: kinderlos,
        kirche,
        steuerklasse,
      }),
    [brutto, steuerklasse, kirche, kinderlos]
  );

  /**
   * Höhe an die einbettende Seite melden, damit dort kein Scrollbalken im
   * iframe entsteht. Ohne das müsste jeder Betreiber die Höhe raten — der
   * häufigste Grund, warum Widgets nach kurzer Zeit wieder ausgebaut werden.
   */
  useEffect(() => {
    const report = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: "bnc-embed-height", height: h }, "*");
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  const rows = [
    { label: "Lohnsteuer", value: r.steuer.einkommensteuerJahr / 12 },
    ...(r.steuer.soliJahr > 0 ? [{ label: "Solidaritätszuschlag", value: r.steuer.soliJahr / 12 }] : []),
    ...(kirche ? [{ label: "Kirchensteuer", value: r.steuer.kirchensteuerJahr / 12 }] : []),
    { label: "Rentenversicherung", value: r.sv.rente },
    { label: "Arbeitslosenversicherung", value: r.sv.arbeitslosen },
    { label: `Krankenversicherung (${r.sv.krankenSatzAnPct.toFixed(2)} %)`, value: r.sv.kranken },
    { label: `Pflegeversicherung (${r.sv.pflegeSatzAnPct.toFixed(2)} %)`, value: r.sv.pflege },
  ];

  return (
    <div className="bnc-embed">
      <div className="bnc-grid">
        {/* ── Eingaben ── */}
        <div className="bnc-inputs">
          <label className="bnc-field">
            <span>Bruttogehalt pro Monat</span>
            <div className="bnc-money">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={50}
                value={brutto}
                onChange={(e) => setBrutto(Math.max(0, Number(e.target.value)))}
                aria-label="Bruttogehalt pro Monat in Euro"
              />
              <span aria-hidden="true">€</span>
            </div>
          </label>

          <label className="bnc-field">
            <span>Steuerklasse</span>
            <select
              value={steuerklasse}
              onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
              aria-label="Steuerklasse"
            >
              {STEUERKLASSEN.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <div className="bnc-checks">
            <label>
              <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} />
              <span>Kirchensteuer</span>
            </label>
            <label>
              <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} />
              <span>Kinderlos (ab 23 J.)</span>
            </label>
          </div>
        </div>

        {/* ── Ergebnis ── */}
        <div className="bnc-result">
          <p className="bnc-result-label">Ihr Nettogehalt</p>
          <p className="bnc-result-value">{formatEUR(r.nettoMonat)}</p>
          <p className="bnc-result-sub">
            {formatEUR(r.nettoJahr)} pro Jahr · {((r.nettoMonat / (brutto || 1)) * 100).toFixed(1)} % vom Brutto
          </p>

          <dl className="bnc-rows">
            {rows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>− {formatEUR(row.value)}</dd>
              </div>
            ))}
            <div className="bnc-total">
              <dt>Abzüge gesamt</dt>
              <dd>− {formatEUR(r.sv.summeMonat + r.steuer.summeMonat)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/*
        Attribution. Bewusst der Markenname als Ankertext und nicht
        "brutto netto rechner 2026 kostenlos": Keyword-optimierte Pflicht-Links
        aus massenhaft verteilten Widgets wertet Google als Linkspam. Ein
        schlichter Markenverweis auf ein Werkzeug, das echten Nutzen stiftet,
        ist genau das, was er zu sein vorgibt.
      */}
      <p className="bnc-credit">
        Berechnung nach § 32a EStG (Stand 2026) ·{" "}
        <a href="https://bruttonettocalculator.com/" target="_blank" rel="noopener">
          BruttoNettoCalculator.com
        </a>
      </p>

      <style>{`
        .bnc-embed {
          --bnc-accent: ${accent};
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          color: #16181D;
          background: #fff;
          border: 1px solid rgba(0,0,0,.09);
          border-radius: 16px;
          padding: 18px;
          max-width: 760px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .bnc-embed *, .bnc-embed *::before, .bnc-embed *::after { box-sizing: inherit; }
        .bnc-grid { display: grid; gap: 16px; }
        @media (min-width: 620px) { .bnc-grid { grid-template-columns: 1fr 1fr; } }

        .bnc-field { display: block; margin-bottom: 12px; }
        .bnc-field > span {
          display: block; font-size: 12px; font-weight: 600;
          color: rgba(0,0,0,.55); margin-bottom: 5px;
        }
        .bnc-money { position: relative; }
        .bnc-money > span {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-weight: 700; color: rgba(0,0,0,.35); pointer-events: none;
        }
        .bnc-embed input[type="number"], .bnc-embed select {
          width: 100%; padding: 11px 30px 11px 12px;
          border: 1px solid rgba(0,0,0,.14); border-radius: 10px;
          font-size: 15px; font-weight: 600; background: #fff; color: #16181D;
          -webkit-appearance: none; appearance: none;
        }
        .bnc-embed select { padding-right: 12px; }
        .bnc-embed input:focus, .bnc-embed select:focus {
          outline: 2px solid var(--bnc-accent); outline-offset: 1px; border-color: transparent;
        }
        .bnc-checks { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 2px; }
        .bnc-checks label {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: rgba(0,0,0,.65); cursor: pointer;
        }
        .bnc-checks input { accent-color: var(--bnc-accent); width: 15px; height: 15px; }

        .bnc-result { background: #F7F8FA; border-radius: 12px; padding: 16px; }
        .bnc-result-label {
          margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: rgba(0,0,0,.45);
        }
        .bnc-result-value {
          margin: 4px 0 2px; font-size: 30px; font-weight: 800;
          letter-spacing: -.02em; color: var(--bnc-accent); line-height: 1.1;
        }
        .bnc-result-sub { margin: 0 0 12px; font-size: 12px; color: rgba(0,0,0,.5); }

        .bnc-rows { margin: 0; border-top: 1px solid rgba(0,0,0,.07); padding-top: 10px; }
        .bnc-rows > div {
          display: flex; justify-content: space-between; gap: 10px;
          font-size: 13px; padding: 3px 0;
        }
        .bnc-rows dt { color: rgba(0,0,0,.6); margin: 0; }
        .bnc-rows dd { margin: 0; font-variant-numeric: tabular-nums; font-weight: 600; }
        .bnc-total {
          border-top: 1px solid rgba(0,0,0,.07); margin-top: 6px; padding-top: 8px !important;
          font-weight: 700;
        }
        .bnc-total dt { color: #16181D !important; }

        .bnc-credit {
          margin: 14px 0 0; text-align: center;
          font-size: 11px; color: rgba(0,0,0,.45);
        }
        .bnc-credit a { color: var(--bnc-accent); font-weight: 700; text-decoration: none; }
        .bnc-credit a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
