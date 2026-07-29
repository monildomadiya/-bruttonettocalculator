# Sitemap Validation Report — bruttonettocalculator.com

**Analyzed:** 2026-07-29 · Live sitemap at `https://bruttonettocalculator.com/sitemap.xml`
**Generator:** Next.js App Router (`app/sitemap.ts`)

## Summary

| Check | Result |
|---|---|
| Sitemap discovered | ✅ `/sitemap.xml` (only candidate; no index file needed) |
| Declared in robots.txt | ✅ `Sitemap:` line present (+ `Host:` directive) |
| Valid XML (urlset) | ✅ |
| Size limits | ✅ 162 URLs / 30.6 KB — far under 50.000 URLs & 50 MB |
| Duplicate URLs | ✅ 0 (162 unique of 162) |
| HTTPS-only | ✅ 0 `http://`, 0 `www.` — all on canonical non-WWW host |
| URL health (25 sampled across all page types) | ✅ 25/25 → HTTP 200, no redirects |
| Blog URLs (all 7, DB-driven slugs) | ✅ 7/7 → 200 |
| Noindexed URLs in sitemap | ✅ None found (sampled pages: `index, follow`) |
| Non-canonical URLs in sitemap | ✅ Sampled pages self-canonicalize to the exact sitemap URL |
| www → non-www redirect | ✅ 308 permanent |
| `<lastmod>` format | ✅ Valid W3C date (`YYYY-MM-DD`) |
| Route coverage | ✅ All public routes present (calculators, hubs, legal, en/pl) |

**URL composition (162):** 87 programmatic amount pages · 16 Bundesland pages · 7 blog articles · 2 i18n (en/pl) · 50 calculators/hubs/legal.

## Issues

| # | Issue | Severity | Detail | Fix |
|---|---|---|---|---|
| 1 | **Deployment gap: live sitemap is stale vs. code** | 🔴 High (opportunity, not defect) | Live = 162 URLs. Local `app/sitemap.ts` now emits **331** (88 Steuerklasse-1 pages, 76 Jahresgehalt pages, Steuerklassen-Finder, Beamten-Rechner, MwSt-Rechner, Steuerfreibetrag-2026, 1.300-€ pages). None are live/indexable yet. | Commit + push `main` → verify deploy → submit new URLs via IndexNow (key already installed). |
| 2 | Suspiciously uniform `<lastmod>` | 🟡 Medium | 155 of 162 entries share `2026-07-28` (the `contentUpdated` constant ≈ last deploy). Google only honors `lastmod` when it verifiably tracks real content changes — a fleet-wide identical date is treated as noise, so recrawl prioritization is lost. Blog entries (real DB `updated_at`) are the only accurate ones. | In `app/sitemap.ts`, stop tying `contentUpdated` to deploys: keep a small per-section "last significant change" map (e.g. bump amount pages only when `taxCalculator.ts`/`wage-stats.ts` change), or omit `lastmod` where unknown. |
| 3 | `<priority>` + `<changefreq>` on all entries | ⚪ Info | Both ignored by Google (and largely by Bing). Harmless; adds ~30 % file weight. | Optional cleanup in `app/sitemap.ts`. No urgency. |
| 4 | No `xhtml:link` hreflang alternates | ⚪ Info / enhancement | Site has de/en/pl variants (`/`, `/en/tax-calculator-germany`, `/pl/kalkulator-brutto-netto-niemcy`) but the sitemap carries no hreflang clusters (page-level tags may exist; sitemap-level would reinforce them). | Next 14 supports `alternates.languages` per sitemap entry — add for the 3-language cluster. Or run `/seo-hreflang` for a full audit. |

## Notes

- No image/video/news extension namespaces in use — no subtype validation needed.
- Legal pages (`/impressum`, `/datenschutz`, `/kontakt`) are included; harmless, though they earn no search value.
- At the current growth rate (331 soon, +blog), a single urlset stays fine until ~50k URLs — no sitemap index needed for years.

## Recommended action order

1. **Ship the pending commit** (biggest SEO lever — +169 URLs incl. 4 new tools).
2. After deploy: re-fetch `/sitemap.xml`, confirm 331 URLs, submit via IndexNow + resubmit sitemap in GSC (GSC resubmit is already a standing owed task).
3. Fix `lastmod` semantics (issue 2) in the same or next deploy.
4. Optionally drop priority/changefreq and add hreflang alternates (issues 3–4).
