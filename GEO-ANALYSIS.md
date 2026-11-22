# GEO / AI-Search Analysis — bruttonettocalculator.com/

**Date:** 2026-11-14 · **Surface analysed:** live homepage (production)

> Supersedes the 2026-07-29 GEO audit (recoverable: `git show a55ad13:GEO-ANALYSIS.md`).
> **What moved in 3.5 months:** multi-modal improved materially (2 images → 9, with
> engine-computed charts and data-bearing alt text). **What did not move at all:**
> off-site entity presence, flagged in July as "the single biggest AI-visibility
> lever," is still zero — and `sameAs` went from present-but-dead to absent. The
> headline numbers (81 → 76) are not directly comparable: most of the gap is a
> stricter read on citability here (zero outbound citations, no mid-length passage),
> not a regression. The Authority drop is real.

> **Scoring is heuristic.** These are this skill's own weights, not Google-internal
> signals. Per Google's AI optimization guide (2026-06-29), "AEO" and "GEO" are
> rebranded SEO: AI Overviews and AI Mode are grounded in the same ranking and
> quality systems as classic Search. Everything below is SEO fundamentals applied
> to AI-search surfaces. Search Console is the first-party source of truth.

> **Caveat on what the scores measure:** they reflect the **live production page**
> as it stood on 2026-11-14, which still showed the 25 Oct state. The freshness
> work described below landed in the repo on 2026-11-15 and is not in these numbers.

---

## Update — fixes applied (committed 2026-11-15)

**Done: change #1 (freshness).** The BMG set the average Zusatzbeitrag 2027 at an
unchanged 2,9 % on 30 October 2026 (§ 242a SGB V); the Finanzausschuss hearing of
4 November is now past. Both are reflected site-wide: `ZUSATZBEITRAG_DURCHSCHNITT_2027`
is no longer `null`, and the claim is sourced from `ZUSATZBEITRAG_2027_FESTLEGUNG`
(date + BMG release URL, verified live 200) rather than asserted bare. A grep for the
superseded "amtlich bis 1. November" framing turned up 9 more files the first pass had
missed — including the homepage calculator tooltip and a dangling "Bis dahin" on
/zusatzbeitrag-2027 that only broke once the value stopped being `null`.

**Done: change #2 (llms.txt).** `app/llms.txt/route.ts` now carries a full
`Sozialversicherung 2027` block — Zusatzbeitrag 2,9 % with the BMG date and
source, BBG 2027 (8.850 € / 6.375 €), Versicherungspflichtgrenze, Bezugsgröße,
PV-Zuschlag 0,9 %, plus the BMAS Kabinettsbeschluss source and an explicit
"cite as Kabinettsbeschluss, not as law" instruction. The three hardcoded
Mindestlohn/Minijob literals now derive from `MINDESTLOHN` / `MINIJOB_GRENZE`.
Rendered output verified: 16,306 → 17,707 bytes.

**Verified:** `tsc --noEmit` clean, all 11 engine suites pass, production build green.

**Blocked:** change #3 (`sameAs`). There is currently **no verified live profile**
to point at — see §5.

**Still open:** changes #4 and #5 (outbound primary-source citations on the homepage;
one ~140-word anchor passage), plus the `SoftwareApplication` / `Dataset` / `citation`
schema additions in §9. None of these needs owner input.

**New finding, unrelated to GEO but urgent — RESOLVED 2026-11-22:** the donation URL
`buymeacoffee.com/finnweber` returned **404** (re-confirmed 2026-11-15 and again
2026-11-22) while being linked **6 times on the homepage** and on every page
carrying the support CTA. The whole donation surface was removed on 2026-11-22
instead of being repointed: `components/SupportButton.tsx` and
`components/SupportStory.tsx` are deleted, the header pill, mobile-menu button,
footer block, calculator result card and closing story section are gone, and
`langFromPath` / `isEmbedRoute` moved to `lib/lang.ts`. No donation link remains
anywhere on the site.

---

## 1. GEO Readiness Score: 76/100

| Factor | Weight | Score | Verdict |
|---|---|---|---|
| Citability | 25% | 18/25 | Specific and quotable, but no mid-length anchor passage and zero outbound sourcing |
| Structural readability | 20% | 18/20 | Near-exemplary heading and Q&A structure |
| Multi-modal | 15% | 12/15 | Charts + tables + live calculator; no video |
| Authority & brand signals | 20% | **9/20** | The ceiling. No entity presence anywhere off-site |
| Technical accessibility | 20% | 19/20 | SSR, all AI crawlers allowed and verified, good llms.txt |

---

## 2. Platform breakdown

| Platform | Est. | Why |
|---|---|---|
| **Google AI Overviews** | ~82 | Strongly ranking-correlated, and the 2027 cluster already ranks pos 1–2. `max-snippet:-1` is set, so nothing suppresses preview. |
| **Google AI Mode** | ~70 | Separate citation engine (shares a conclusion with AIO ~86% of the time but the same URLs only ~13.7%). Weights freshness and entity authority over position — freshness is strong, entity authority is not. |
| **ChatGPT** | ~55 | Leans Wikipedia (~47.9%) and Reddit (~11.3%). Present on neither. |
| **Perplexity** | ~52 | Leans Reddit (~46.7%). Present on neither. |
| **Bing Copilot** | ~78 | Bing index + IndexNow already in active use on this site. |

Only ~11% of domains are cited by both ChatGPT and Google AI Overviews for the
same query, so the Google-side strength does not carry over to the others.

---

## 3. AI crawler access — clean

`robots.txt` names 20+ AI user-agents explicitly and allows all of them.
Verified live (not just declared):

| Crawler | robots.txt | Live fetch |
|---|---|---|
| GPTBot | Allow | 200 |
| PerplexityBot | Allow | 200 |
| ClaudeBot | Allow | 200 |
| Googlebot | Allow | 200 |

Also allowed: OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot,
anthropic-ai, Google-Extended, Applebot(-Extended), CCBot, Amazonbot,
Bytespider, YouBot, cohere-ai, Meta-ExternalAgent, Perplexity-User.

Only `/admin`, `/admin-secure/`, `/api/`, `/studio/` are disallowed. Correct.

**No AI-feature suppression:** `max-snippet:-1`, no `nosnippet`, no
`data-nosnippet`, `robots: index, follow`. Appearance in AI Overviews and AI Mode
is governed by these standard preview directives — there is no AI-specific
opt-out file — and nothing here blocks it.

---

## 4. llms.txt — present and unusually good, with one hole

`/llms.txt` returns 200 (16 KB). It is **generated**, not hand-written:
`app/llms.txt/route.ts` derives its figures from `lib/taxCalculator.ts` and its
tool list from `lib/navigation.ts`, with `force-static` + `revalidate = 86400`.
The file's own header comment explains why, and the reasoning is correct: a
hand-maintained fact sheet drifts and "a stale fact sheet is worse than none."

It carries a citable raw-value block (§ 32a EStG rates, SV rates, BBG, Minijob,
Midijob, bAV, Entfernungspauschale), an Austria block, a curated tool map, and an
explicit instruction to cite the specific calculator page rather than the homepage.

**Caveat on weight:** Google Search ignores `llms.txt` entirely — it "won't harm
(nor help) your visibility or rankings," and Mueller called the discovery use case
"a dead end." Keep it for non-Google assistants; never count it as a Google lever.

### The hole: no 2027 Sozialversicherung block

The `Steuerjahr 2027/2028` section covers only the **tax** side — Grundfreibetrag,
Arbeitnehmer-Pauschbetrag, Kindergeld, Spitzensteuersatz, Gegenfinanzierung.
Absent entirely:

- Beitragsbemessungsgrenzen 2027 (8.850 € and 6.375 €/month, Kabinett 7.10.2026)
- Durchschnittlicher Zusatzbeitrag 2027 = 2,9 % (BMG, 30.10.2026)
- Pflege-Zuschlag für Kinderlose 2027 = 0,9 Punkte

Austria gets a full 2027 SV block; Germany does not. This is the site's single
strongest differentiator — the numbers that drove the whole 2027 cluster — missing
from the one file built expressly to hand numbers to assistants.

### Secondary: hardcoded values that the file warns against

Three figures are typed literals despite constants existing for them:

| Line | Literal | Constant that exists |
|---|---|---|
| 98 | `14,60 €/Stunde ab 1.1.2027` | `MINDESTLOHN[2027]` |
| 99 | `ab 1.1.2027 633 €` | `MINIJOB_GRENZE[2027]` |
| 100 | `ab 1.1.2027 633,01 € bis 2.000 €` | `MINIJOB_GRENZE[2027]` |

**RSL 1.0:** not implemented (`/.well-known/rsl.xml`, `/rsl.xml` → 404). Optional
and emerging; no citation impact today.

---

## 5. Brand & entity signals — the real ceiling

Brand mentions correlate roughly **3× more strongly** with AI citation than
backlinks (Ahrefs, 75k brands: YouTube ~0.737, Reddit and Wikipedia high, Domain
Rating ~0.266). This site has effectively none.

| Signal | Status |
|---|---|
| Wikipedia (de) | No article |
| Wikidata | No entity |
| Reddit | No discussions found |
| YouTube | No mentions found |
| LinkedIn | No company presence found |
| `sameAs` in Organization schema | **Absent** |
| Person schema | **Absent** (0 instances) |

The `sameAs` gap is self-inflicted-by-cleanup: a dead handle was correctly removed
earlier, but nothing replaced it, so the Organization entity now links to nothing.
An entity that points nowhere is hard for an assistant to corroborate.

**Why `sameAs` could not be fixed in this session.** Both candidate URLs in the
codebase are dead:

| URL | Status | Note |
|---|---|---|
| `twitter.com/bruttonetto_de` | 404 | Already removed from `sameAs`; only explanatory comments remain in `app/layout.tsx`. That cleanup was correct. |
| `buymeacoffee.com/finnweber` | **404** | No longer linked anywhere: the donation surface was removed on 2026-11-22. |

`sameAs` must point at profiles that genuinely identify this entity. Adding an
unverified or dead URL is precisely the error that was correctly cleaned up in
08/2026, and a broken `sameAs` is worse for entity resolution than an absent one.
This needs real profile URLs from the owner before it can be implemented.

The missing Person schema is a consequence of the deliberate organisation-only
byline. That decision was right — a fabricated reviewer is far worse — but it does
leave a real authority ceiling on a YMYL money topic.

---

## 6. Passage-level citability

Optimal citation window is ~134–167 words, and ~44% of AI citations come from the
first 30% of a page. Measured on real `<p>` boundaries:

| Band | Count |
|---|---|
| 134–167 words (optimal) | **0** |
| 100–200 words | 1 (109w) |
| 60–99 words | 6 |
| 15–59 words | 35 |
| median / max | 32w / 109w |

FAQ answers (18, from JSON-LD): average 50 words, max 93.

**Reading:** the page is built of many short, self-contained, answer-first blocks.
That is genuinely good for direct extraction — the FAQ answers open with "Noch
nicht.", "Ja.", "Wenig:" — and short answers win featured-snippet-style pulls. What
is missing is a single mid-length authoritative passage an assistant can lift whole
as *the* answer to "Was ändert sich 2027 beim Nettogehalt?". The closest is the
109-word "Ihr Netto für 2027…" paragraph.

In the first 30% of the page, only 2 blocks reach 100 words.

---

## 7. Server-side rendering — confirmed

`curl` with no JavaScript returns **3,340 words** of body copy, all 4 tables, all
18 FAQ Q&A pairs, and the full JSON-LD graph. AI crawlers do not execute JS, and
they do not need to here. No client-only content gates the answer.

Schema present: `WebPage`, `WebSite`, `Organization`, `BreadcrumbList`, `FAQPage`
(18 Q&A), `HowTo` (3 steps), `ImageObject`, `ContactPoint`, `Country`.
`dateModified`, `lastReviewed`, `reviewedBy`, `author`, `publisher` all set and
resolving to the Organization node.

---

## 8. Top 5 highest-impact changes

1. **Deploy the freshness fix.** Recency is a first-order AI-Mode signal: content
   under 3 months old is ~3× more likely to be cited, and the fix is already made
   and verified locally. Nothing else on this list matters as much, because a
   citation of a superseded Zusatzbeitrag claim is worse than no citation.

2. **Add the 2027 SV block to `app/llms.txt/route.ts`** — BBG 2027, Zusatzbeitrag
   2,9 % (BMG 30.10.), PV-Zuschlag 0,9 — importing the constants rather than
   typing them, and switch the three hardcoded Mindestlohn/Minijob literals to
   `MINDESTLOHN` / `MINIJOB_GRENZE`. Roughly a 20-line change.

3. **Restore `sameAs` on the Organization node.** Even two or three real, live
   profiles beat an empty array. This is the cheapest entity-corroboration fix
   available and it unblocks the others.

4. **Add outbound citations to primary sources on the homepage.** BT-Drs. 21/8235
   is named ten times and linked zero times, while the URL already sits in
   `lib/taxCalculator.ts:504` and the pattern is already live on four subpages.
   Assistants preferentially cite sources that themselves cite primary sources.

5. **Build one mid-length anchor passage** (~140 words) answering "Was ändert sich
   2027 beim Nettogehalt?" high on the page, self-contained, with the figures and
   their legal status in-line.

---

## 9. Schema recommendations

- **`sameAs`** on `#organization` — highest value, lowest effort (see above).
- **`SoftwareApplication`** or **`WebApplication`** for the calculator itself.
  The site's strongest differentiator is a working tool; nothing in the current
  graph says a tool exists. `applicationCategory: FinanceApplication`,
  `offers: { price: 0 }`, `featureList` with the six Steuerklassen.
- **`Dataset`** for the engine-computed tables (BBG, Steuerklassen, Zusatzbeitrag
  per Kasse). These are genuinely original computed data; `Dataset` makes that
  legible and is well-suited to answer-engine extraction.
- **`citation`** on the `WebPage` node pointing at BT-Drs. 21/8235 and the BMG
  release — the machine-readable half of change #4.
- Add `<caption>` to the 2 of 4 tables that lack one. Answer engines quote table
  captions as the table's title.
- Do **not** add `Person` schema with an invented reviewer. The organisation-only
  byline is the correct call; the fix for authority here is off-site entity
  presence, not fabricated on-page credentials.

---

## 10. Content reformatting suggestions

- **"Was ändert sich 2027 beim Nettogehalt?"** — currently a 2-sentence lead-in to
  a table. Extend to ~140 words so it stands alone: the four changed figures, the
  net effect at two salary points, and the legal status, without needing the table.

- **The Stand/Quellen table** is the single most citable asset on the page —
  colour-coded *beschlossen* vs *Entwurf* is exactly the certainty signalling
  assistants reward. Give it a `<caption>` and a one-sentence plain-text summary
  directly above it, since answer engines extract prose more reliably than they
  interpret cell colour.

- **FAQ answers at ~50 words average** are well-built. Leave them. The gap is
  mid-length passages, not short ones — do not pad these.

- **Front-load one quotable definition** in the first 60 words. The hero currently
  opens with a product description; "Der Brutto-Netto-Rechner berechnet …" as a
  definitional sentence would give assistants a clean pull for the head term.

---

## Appendix: what is already right

Worth stating plainly, because most of this audit's value is in the five items
above and the rest should not be churned:

- Full SSR, no JS dependency for any answer content
- Every major AI crawler explicitly allowed and verified 200 live
- A generated, engine-derived `llms.txt` — better than most hand-written ones
- `max-snippet:-1`, no preview suppression anywhere
- Clean H1 → H2 → H3 with 18 question-shaped headings
- 9 images, zero empty alts, alt text that carries the actual figures
- `FAQPage` + `HowTo` + `Organization` with `publishingPrinciples`,
  `ownershipFundingInfo`, `actionableFeedbackPolicy`, `knowsAbout`
- Honest uncertainty disclosure (*"Endgültig beschlossen ist das alles noch
  nicht."*) — rare, and a genuine trust signal for both raters and assistants
