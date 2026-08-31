import { calculateNetto, type CalculatorInput, type Steuerklasse } from "@/lib/taxCalculator";

/**
 * Formatting and tax-engine helpers shared by the `tool-content*` config
 * modules.
 *
 * Split into its own module so the config files can import them without
 * importing each other — `tool-content.ts` owns the registry and pulls in
 * `tool-content-extra.ts`, so any helper living in the former would make that a
 * cycle.
 *
 * Server-only in practice: every consumer is a `page.tsx` server component, so
 * neither these helpers nor the tax engine they call reach the browser.
 */

/** Whole euros, German grouping — "3.000 €". */
export const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " €";

/** Euros with cents — "603,01 €". */
export const eur2 = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + " €";

/** Percentage with a German decimal comma — "21,15 %". */
export const pct = (n: number, digits = 1) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n) + " %";

/**
 * One 2026 net calculation with the site's default assumptions
 * (Steuerklasse 1, childless over 23, no church tax, average GKV top-up).
 *
 * `verheiratet` is derived from the tax class rather than passed separately, so
 * a caller cannot produce the impossible combination of class 3 or 5 with
 * single assessment.
 */
export function netto(bruttoMonat: number, opts: Partial<CalculatorInput> = {}) {
  const steuerklasse = (opts.steuerklasse ?? 1) as Steuerklasse;
  return calculateNetto({
    bruttoMonat,
    jahr: 2026,
    verheiratet: steuerklasse === 3 || steuerklasse === 5,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse,
    ...opts,
  });
}

/** Monthly gross levels used across the example tables. */
export const LADDER = [2000, 3000, 4000, 5000, 6000, 8000];
