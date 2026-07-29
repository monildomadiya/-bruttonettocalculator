# GEO / AI-Search Analysis — bruttonettocalculator.com

_Analyzed: 2026-07-29 · Homepage `https://bruttonettocalculator.com/`_

> Framing (per Google's AI Optimization Guide, updated 2026-06-29): optimizing for
> generative AI search **is still SEO**. These findings are SEO fundamentals applied
> to AI-search surfaces, not a separate discipline.

## 1. GEO Readiness Score: **81 / 100** — Strong on-page, weak off-site

The page is technically and structurally near-ideal for AI citation. The only thing
holding the score back is **entity/brand presence off the domain** — the single
biggest AI-visibility lever (brand mentions correlate ~3× more strongly with AI
citations than backlinks).

| Criterion | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 88 | Self-contained answers, specific stats (§32a, 42% Spitzensteuersatz, Grundfreibetrag), definition patterns |
| Structural Readability | 20% | 95 | Clean H1→H2→H3, question-based headings, FAQ, lists/tables |
| Multi-Modal | 15% | 65 | Strong interactive calculator, but only 2 images, no charts/video |
| Authority & Brand | 20% | 55 | On-site authority strong; **off-site presence near-zero** |
| Technical Accessibility | 20% | 97 | Full SSR, all AI crawlers allowed, llms.txt present |

## 2. Platform Breakdown

| Platform | Est. | Why |
|---|---|---|
| **Google AI Overviews** | ~80 | Cites already-ranking pages; strong on-page + freshness helps where you rank |
| **Google AI Mode** (Gemini 2.5) | ~72 | Broader pool, rewards freshness (good) + entity authority (weak off-site) |
| **ChatGPT** | ~55 | Leans Wikipedia (48%) + Reddit (11%) — you have neither |
| **Perplexity** | ~55 | Leans Reddit (47%) + Wikipedia — same off-site gap |
| **Bing Copilot** | ~78 | Fed by Bing index + IndexNow (set up 2026-07-29); on-site strong, improving as Bing ingests |

AI Overviews and AI Mode agree ~86% of the time but cite the **same URLs only ~14%** —
score both as separate surfaces.

## 3. AI Crawler Access Status — ✅ Excellent

robots.txt explicitly allows **every** major AI crawler; only `/admin`, `/api`, `/studio`
are disallowed. No AI search or training crawler is blocked:

- **Allowed (search + training):** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User,
  Applebot, Applebot-Extended, CCBot, Amazonbot, Bytespider, YouBot, cohere-ai,
  Meta-ExternalAgent, Google-Extended, Bingbot.
- `Google-Extended` allowed → content is eligible for Gemini grounding.
- Sitemap declared; `Host:` directive present (Yandex-only, harmless).

Nothing to fix here.

## 4. llms.txt Status — ✅ Present & well-formed

`/llms.txt` returns 200 with a proper title, description, and a "Wichtige Fakten"
section. Note: **Google Search ignores llms.txt** (confirmed by Google + Mueller) — it
neither helps nor hurts Google ranking. Keep it for non-Google AI services.
`/llms-full.txt` is absent (optional).

## 5. Brand Mention Analysis — 🔴 The main gap

External search shows essentially **no third-party entity presence**:

- **Wikipedia / Wikidata:** none found.
- **Reddit:** no threads mentioning the brand (competitors + generic tools dominate).
- **YouTube:** no channel or mentions.
- **LinkedIn:** no company presence surfaced.
- The brand's own pages rank, but the SERP for the category is owned by
  `brutto-netto-rechner.com.de`, `stepstone.de`, `brutto-netto-rechner.info`, and the
  "Bruno" app.

**Counterweight (positive):** the calculator carries an **honest editorial reviewer
byline** — "Redaktion BruttoNettoCalculator" — with dates and § sources. This is a
genuine E-E-A-T signal. (Note: an earlier "Dr. Thomas Weber" persona was a fabrication
the site *deliberately removed* per `lib/authors.ts`; do **not** re-introduce a named
individual reviewer without a real, verifiable person.)

This is the #1 lever: ChatGPT and Perplexity draw ~half their citations from
Wikipedia + Reddit, and this brand appears on neither.

## 6. Passage-Level Citability

Strong foundation. The homepage (~1,620 words SSR) already has:

- Self-contained factual answers with specific numbers ("Der Spitzensteuersatz von 42 %
  greift 2026 ab einem zvE von 69.xxx €", "Der Grundfreibetrag liegt 2026 bei 12.xxx €").
- Definition patterns ("Die Düsseldorfer Tabelle 2026 ist eine Leitlinie der deutschen
  Oberlandesgerichte für …").
- 14 question-based FAQ H3s that mirror real query phrasing.

**Opportunity:** most answers are 1–3 sentences (great for snippets). Add a few
**134–167-word cornerstone blocks** for the highest-value queries (e.g. "Wie berechnet
man Netto aus Brutto?"), front-loaded into the **first 30%** of the page (~44% of AI
citations come from there).

## 7. Server-Side Rendering — ✅ Full SSR

AI crawlers do **not** execute JavaScript. Verified (JS disabled) that title, meta
description, canonical, hreflang, the full JSON-LD `@graph`, and all body headings/copy
are present in the **raw HTML**. Next.js SSR delivers everything AI crawlers need.

## 8. Top 5 Highest-Impact Changes

1. **Build off-site entity presence (the 3× lever).** Priority order: a Wikidata entry
   for the brand; genuine participation/mentions in r/Finanzen and r/de; a short YouTube
   explainer ("Brutto zu Netto in 60 Sekunden"); a LinkedIn company page. This is what
   unlocks ChatGPT/Perplexity/AI-Mode citations.
2. **Strengthen the reviewer/authorship signal honestly.** The visible "geprüft von
   Redaktion BruttoNettoCalculator" byline already exists — back it with schema (add
   `reviewedBy`/`author`/`dateModified` on the `WebPage` node, referencing the existing
   `Organization`). Done 2026-07-29. Do **not** invent a named `Person` reviewer.
3. **Add multi-modal assets** — a brutto→netto breakdown chart/infographic and a short
   explainer video or GIF on top pages (multi-modal content sees ~156% higher AI selection).
4. **Add 1–2 front-loaded 134–167-word answer blocks** for top queries, with a
   "X ist …" definition in the first 40–60 words.
5. **Quick wins:** one-time full-sitemap IndexNow submission (Bing Copilot), and prompt
   your audience to add the brand as a Google **Preferred Source**.

## 9. Schema Recommendations (for AI discoverability)

Already present and good: `WebSite`+`SearchAction`, `Organization`, `WebPage`,
`BreadcrumbList`, `FAQPage` (14 Q&A), `ImageObject`. Add:

- **`reviewedBy`/`author`/`publisher`** on the `WebPage` node → reference the existing
  `Organization` (`#organization`). Done 2026-07-29. (No named `Person` — the editorial
  team is the honest author entity; only add a `Person` if a real, verifiable reviewer exists.)
- **`Organization.sameAs`** → social/entity profiles once they exist (LinkedIn, YouTube,
  Wikidata).
- **`HowTo`** for the "In 3 Schritten zum Nettogehalt" section.
- Consider **`Dataset`/table markup** for the salary tables (Beliebte Gehälter,
  Steuerklassen comparison).

## 10. Content Reformatting Suggestions

- Under each question H3, lead with a **direct 40–60-word answer**, then detail (some
  already do this — make it consistent).
- Open definition sections with an explicit **"X ist …"** sentence.
- Convert prose comparisons into **tables** (e.g. a Steuerklassen I–VI net-comparison
  table) — AI strongly favors tabular data for comparative queries.
- Keep the freshness signal loud: "Stand: Juli 2026 · aktualisiert 28.07.2026" is exactly
  right (content <3 months is ~3× more citation-eligible) — maintain a scheduled refresh.

---

### Bottom line

On-page GEO is already near-best-practice — SSR, llms.txt, question-headings, dated
content, an honest editorial reviewer byline, and full AI-crawler access. The gap is **off the page**:
zero brand/entity footprint on the platforms (Wikipedia, Reddit, YouTube) that ChatGPT,
Perplexity, and AI Mode lean on. Closing that, plus surfacing the reviewer and adding
multi-modal assets, is where the AI-visibility upside is.
