import { calculateNetto, type Steuerjahr, type Steuerklasse } from "@/lib/taxCalculator";

/**
 * Server-rendered Brutto→Netto-Aufteilung als gestapelter Balken.
 * Werte kommen immer aus der Engine (calculateNetto) — nie hartkodiert,
 * damit Chart, Rechner und Tabellen bei Parameter-Updates konsistent bleiben.
 */

const ROMAN = ["I", "II", "III", "IV", "V", "VI"] as const;

// Kategoriale Farben, validiert (CVD-Separation, Chroma, Kontrast) gegen
// hellen Hintergrund: Lohnsteuer / Sozialversicherung / Netto (Brand-Akzent).
const SEGMENT_COLORS = { steuer: "#B44A0F", sv: "#2E5E9E", netto: "#E60A1C" } as const;

const fmt0 = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function BruttoNettoBreakdownChart({
  bruttoMonat = 3000,
  jahr = 2026,
  steuerklasse = 1,
}: {
  bruttoMonat?: number;
  jahr?: Steuerjahr;
  steuerklasse?: Steuerklasse;
}) {
  const result = calculateNetto({
    bruttoMonat,
    jahr,
    verheiratet: steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse,
  });

  const sk = ROMAN[steuerklasse - 1];
  const segments = [
    { key: "steuer", label: "Lohnsteuer & Soli", value: result.steuer.summeMonat, color: SEGMENT_COLORS.steuer },
    { key: "sv", label: "Sozialversicherung", value: result.sv.summeMonat, color: SEGMENT_COLORS.sv },
    { key: "netto", label: "Netto", value: result.nettoMonat, color: SEGMENT_COLORS.netto },
  ].map((s) => ({ ...s, pct: (s.value / bruttoMonat) * 100 }));

  return (
    <figure className="my-6">
      {/* Gestapelter Balken — 100 % = Brutto; 2px Lücken trennen die Segmente */}
      <div
        role="img"
        aria-label={`Aufteilung von ${fmt0.format(bruttoMonat)} Brutto ${jahr} in Steuerklasse ${sk}: ${segments
          .map((s) => `${s.label} ${fmt0.format(s.value)}`)
          .join(", ")}`}
        className="flex w-full h-9 gap-[2px]"
      >
        {segments.map((s, i) => (
          <div
            key={s.key}
            title={`${s.label}: ${fmt0.format(s.value)} (${s.pct.toFixed(0)} %)`}
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            className={`h-full min-w-[6px] ${i === 0 ? "rounded-l-lg" : ""} ${i === segments.length - 1 ? "rounded-r-lg" : ""}`}
          />
        ))}
      </div>

      {/* Legende + Werte (zugleich Tabellen-Ansicht der Daten) */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span aria-hidden className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-black/70">{s.label}</span>
            <span className="font-mono font-semibold text-[#16181D]">{fmt0.format(s.value)}</span>
            <span className="text-black/50">({s.pct.toFixed(0)} %)</span>
          </div>
        ))}
      </div>

      <figcaption className="mt-3 text-sm text-black/60 leading-relaxed">
        Von {fmt0.format(bruttoMonat)} Brutto verbleiben {jahr} in Steuerklasse {sk}{" "}
        {fmt0.format(result.nettoMonat)} netto ({segments[2].pct.toFixed(0)} % des Brutto):{" "}
        {fmt0.format(result.steuer.summeMonat)} entfallen auf Lohnsteuer und Solidaritätszuschlag,{" "}
        {fmt0.format(result.sv.summeMonat)} auf Kranken-, Pflege-, Renten- und Arbeitslosenversicherung —
        berechnet mit der amtlichen Einkommensteuer-Formel nach § 32a EStG {jahr}.
      </figcaption>
    </figure>
  );
}
