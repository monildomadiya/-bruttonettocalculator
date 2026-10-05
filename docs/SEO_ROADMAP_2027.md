# bruttonettocalculator.com — SEO Growth Build (Oct 2026 → Jan 2027)

> **For Claude Code.** You are working inside the Next.js repository of bruttonettocalculator.com, a German gross-to-net salary calculator (~98 % of traffic from Germany, monetized with AdSense + affiliate links). This file is the complete spec. Read it fully before changing anything, then execute it phase by phase. All page content is German; all instructions here are English.

---

## Why: the data behind this plan

Keyword research with Google Trends (Germany, past 12 months + 5-year seasonality, pulled 05.10.2026). Values are relative Trends indices (0–100), not search volumes.

- Search interest in the head term "brutto netto rechner" is ~37 % lower than in 2023, but it peaks **every January** (+20–40 % vs. December). Growth has to come from (1) the 2027 seasonal wave, (2) long-tail calculators, (3) programmatic pages.
- "brutto netto rechner 2026" ≈ 20 % of all "brutto netto rechner" searches. Last cycle it went Oct 2025 (5) → Jan 2026 (36) → Mar 2026 (43, peak). "brutto netto rechner 2027" is already rising (+1,800 %), "gehaltsrechner 2027" +3,450 %.
- "Weihnachtsgeld" peaks every **November** at ~8–10× its off-season level.
- "zusatzbeitrag [Jahr]" peaks in **December**; "mindestlohn [Jahr]", "minijob [Jahr]" and "beitragsbemessungsgrenze [Jahr]" peak in **January**.
- "tvöd rechner" ≈ 12 % of the "brutto netto rechner" volume, the largest calculator cluster measured after the main calculator.

**Deadline logic:** every seasonal page must be live and indexed *before* its peak.

---

## 0. Operating rules (apply to every task)

1. **Persist the plan.** Copy this file to `docs/SEO_ROADMAP_2027.md` if it isn't there yet. Keep the checklist in §11 current after every task (☐ → ☑ + commit hash, ⛔ + reason if blocked). If the session is interrupted, resume from the first unchecked item.
2. **Git.** Create branch `seo/roadmap-2027` from the default branch. One commit per task (Conventional Commits, e.g. `feat(weihnachtsgeld): add calculator page`). **Do not push anything and never merge or deploy until I write "deploy"**. This repo auto-deploys via GitHub Actions (confirm the trigger in `.github/workflows` during Phase 0).
3. **Autonomy.** Work through the phases in order without waiting for me between tasks. Stop and ask only if (a) an official value is missing and §2 gives no provisional value, (b) a change would alter or remove an existing URL, or (c) the build fails and you can't fix it. If a task is blocked, mark it ⛔ with the reason and continue with the next task that doesn't depend on it.
4. **Reuse, don't duplicate.** Reuse the existing calculator engine, layouts, components, styles, ad slots, metadata helpers and JSON-LD helpers. Add a new dependency only when clearly necessary, and say why in the commit message.
5. **URLs.** Never change or delete an existing URL or slug. Don't touch the current canonical/www handling, `robots.txt` rules, `ads.txt`, Nginx or PM2 config.
6. **No invented numbers.** Every tax and social-insurance parameter lives in one versioned config per year with `source` (URL) and `status: "final" | "provisional"`. Provisional values show a visible "vorläufig" badge with a tooltip that lists what is provisional. Never fit or guess tariff coefficients. Verify every 2027 value from §2 against an official source before you use it, and log any mismatch.
7. **One primary keyword per URL** (map in §3). Before creating a page, search routes and blog content for that primary keyword. If something already targets it, extend that page instead of creating a new URL, and note it in the checklist.
8. **German content quality.** Native, precise German. Match the site's existing form of address (du or Sie) and tone. Answer first: the first 40–60 words answer the query with a concrete, computed number. Short paragraphs, tables over prose. No filler, no fake testimonials, reviews or author credentials, and no claim of being an official or government tool. Every page shows "Stand: <Datum>" (one constant per page, updated on content changes) and a "Quellen" list with official sources first. Disclaimer: "Alle Angaben ohne Gewähr, keine Steuerberatung."
9. **Rendering & performance.** Pages are statically generated (SSG/ISR). Calculators are client components on top of server-rendered content, and the default example result must already be in the HTML. New pages get the same ad slots as comparable existing pages, with space reserved (no CLS). Mobile-first.
10. **Verify before committing.** `npm run build` (plus `lint` and `test` if present) must pass after every task.

---

## 1. Phase 0 — Repo audit (read-only)

Write a short "Audit" section into `docs/SEO_ROADMAP_2027.md` covering:

- Next.js version, App Router or Pages Router, TypeScript, styling system.
- Calculator engine: location, how Lohnsteuer is computed (official BMF Programmablaufplan/PAP implementation or simplified), how tax years are parameterised, which years exist, existing tests.
- SEO plumbing: how title, description, canonical and OG tags are set; JSON-LD helpers; sitemap generation; breadcrumbs.
- Blog: file-based (MDX/MD/JSON in the repo) or database/admin editor? Where posts live and how they render.
- Inventory: all existing routes and blog slugs. Flag every page or post touching Minijob, Mindestlohn, Midijob, Weihnachtsgeld, Zusatzbeitrag, Beitragsbemessungsgrenze, Steuerreform, Steuerklasse, TVöD, Stundenlohn, Netto→Brutto, Rente, Aktivrente, Abfindung, Firmenwagen, Bundesländer, Austria.
- Ad components and placements; related-tools and internal-link components.
- Deploy trigger in `.github/workflows`.

Then map every row of §3 to "new URL" or "extend existing <path>", and continue with Phase 1.

---

## 2. Tax & social-insurance data (snapshot 05.10.2026)

**2026:** keep the values already in the code, but cross-check each one against official 2026 sources and fix and log any discrepancy.

**2027:** add to the 2027 config with status and source.

| Parameter | 2027 value | Status | Where to verify |
|---|---|---|---|
| Mindestlohn | 14,60 €/h | final | BMAS (Mindestlohnanpassungsverordnung) |
| Minijob-Grenze | 633 €/Monat | final (tied to Mindestlohn) | minijob-zentrale.de |
| Übergangsbereich (Midijob) | 633,01 € – 2.000 € | final | §20 SGB IV |
| Faktor F (Midijob) | Not published yet. Formula: F = Pauschalbeitragssatz (KV + RV for Minijobs) ÷ Gesamtsozialversicherungsbeitragssatz, 4 decimals. 2026: 28 ÷ 42,3 = 0,6619. If the Minijob KV-Pauschale rises to 17,5 %: 32,5 ÷ 42,3 = 0,7683 (projection by lohn-info.de) | provisional | BMAS announcement (usually December) |
| BBG KV/PV | 6.375 €/Monat · 76.500 €/Jahr | draft (Rechengrößenverordnung 2027 not yet adopted) | BMAS, GKV-Spitzenverband |
| BBG RV/AV | 8.850 €/Monat · 106.200 €/Jahr | draft | BMAS, Deutsche Rentenversicherung |
| Versicherungspflichtgrenze (JAEG) | 84.150 €/Jahr (7.012,50 €/Monat) | draft | BMAS |
| Bezugsgröße | 4.130 €/Monat | draft | BMAS |
| KV allgemeiner Beitragssatz | 14,6 % | unchanged | — |
| Ø Zusatzbeitrag | Set by the BMG around early November 2026 (2026: 2,9 %). Use 2,9 % as provisional until then. | provisional | bundesgesundheitsministerium.de |
| PV Beitragssatz | 3,6 % (Sachsen: AN 2,3 % / AG 1,3 %) | per draft sources | BMG |
| PV Kinderlosenzuschlag | ⚠ Sources disagree (0,7 % vs. 0,9 %; 2026: 0,6 %). Verify officially. If unresolved, keep the 2026 value and mark provisional. | open | BMG, GKV-Spitzenverband |
| RV / AV | 18,6 % / 2,6 % | per draft sources | DRV, BA |
| Einkommensteuer-Tarif | Regierungsentwurf "Einkommensteuerreformgesetz 2027" (Kabinett 02.09.2026): Grundfreibetrag 12.564 € (provisional pending the 16. Existenzminimumbericht); Zone 2 ends at 17.799 €; 42 % from 70.601 €; 45 % from 250.000 €; **new 47 % from 280.000 €** | provisional (draft law) | bundesfinanzministerium.de, Bundestag-Drucksache |
| Arbeitnehmer-Pauschbetrag | 1.430 € | provisional | same bill |
| Kinderfreibetrag / Kindergeld | 10.056 € / 267 € | provisional | same bill |
| Minijob-Pauschsteuer | 5 % (instead of 2 %) | provisional | same bill |
| Steuerfreie Sonntags-/Feiertagszuschläge (Grundlohn cap) | 75 €/h (instead of 50 €) | provisional | same bill |
| Minijob KV-Pauschale (employer) | 17,5 % (instead of 13 %) | ⚠ unverified (lohn-info.de only), verify | GKV-Spitzenverband, minijob-zentrale.de |
| Soli-Freigrenze | Not found. Keep the 2026 value, mark provisional. | open | BMF |

**Lohnsteuer 2027 rule.** Use the official BMF Programmablaufplan (PAP) 2027 for the maschinelle Lohnsteuerberechnung as soon as it is published (the BMF usually publishes a draft in November). Until then, run the 2026 PAP logic with the 2027 parameters above and the exact §32a EStG 2027 formula from the bill text. If you can't find the exact §32a coefficients, mark the 2027 tax part ⛔ and continue; do not approximate.

**Reference tests.** Add engine unit tests with at least 12 reference cases for 2026: SK I–VI, Kirchensteuer 8 % and 9 %, kinderlos 23+, Sachsen, income above the BBG, Midijob, and Weihnachtsgeld as a sonstiger Bezug. Expected values must come from the official BMF Lohnsteuerrechner (bmf-steuerrechner.de). If you can't query it, put the test inputs in a table and ask me to fill in the BMF results.

---

## 3. Keyword → URL map (single source of truth)

URLs are suggestions. If the site uses different conventions (folder, trailing slash), follow the site.

| # | Primary keyword | Secondary keywords | URL | Type | Phase |
|---|---|---|---|---|---|
| 1 | brutto netto rechner 2026 / 2027 | brutto netto rechner 2027, gehaltsrechner 2027, lohnrechner 2027, brutto netto rechner deutschland | `/` (existing main calculator) | Update | 1 |
| 2 | weihnachtsgeld rechner | weihnachtsgeld netto rechner, brutto netto rechner weihnachtsgeld, weihnachtsgeld berechnen, weihnachtsgeld steuerfrei, minijob weihnachtsgeld, weihnachtsgeld rechner tvöd | `/weihnachtsgeld-rechner` | New tool | 2 |
| 3 | weihnachtsgeld anspruch | wann weihnachtsgeld, weihnachtsgeld kündigung, weihnachtsgeld zurückzahlen, weihnachtsgeld elternzeit, weihnachtsgeld krankengeld | blog | Post | 2 |
| 4 | minijob grenze 2027 | minijob 2027, minijob 633 euro, minijob stunden 2027, minijob rentner, minijob abschaffung | blog (or extend existing) | Post | 3 |
| 5 | mindestlohn 2027 | mindestlohn 2027 netto, mindestlohn 2027 minijob grenze, mindestlohn 2027 deutschland | blog | Post | 3 |
| 6 | midijob rechner | midijob rechner 2026, midijob 2027, brutto netto rechner midijob, übergangsbereich rechner | `/midijob-rechner` | New tool | 3 |
| 7 | zusatzbeitrag 2027 | tk / aok / barmer / dak / hkk / bkk firmus zusatzbeitrag 2027, krankenkasse zusatzbeitrag 2027, durchschnittlicher zusatzbeitrag 2027 | `/zusatzbeitrag-2027` | New data page | 4 |
| 8 | beitragsbemessungsgrenze 2027 | bbg 2027, sozialversicherung 2027, rechengrößen 2027 | blog | Post | 4 |
| 9 | steuerreform 2027 | einkommensteuerreform 2027, grundfreibetrag 2027, steuertarif 2027 | blog | Post | 4 |
| 10 | tvöd rechner | netto rechner tvöd, tvöd rechner 2026, tvöd rechner sue, tvöd rechner pflege, tvöd tabelle 2026 rechner, tvöd bund, tvöd gehaltsrechner 2026, tvöd stundenlohn | `/tvoed-rechner` | New tool | 5 |
| 11 | stundenlohn rechner | stundenlohn netto, brutto netto stundenlohn, stundenlohn berechnen, stundenlohn netto rechner, minijob stundenlohn, stundenlohn 2026 | `/stundenlohn-rechner` | New tool | 5 |
| 12 | netto in brutto rechner | netto zu brutto rechner, netto auf brutto rechner | `/netto-brutto-rechner` | New tool | 5 |
| 13 | rente brutto netto rechner | rentenrechner netto, rente netto berechnen, rente brutto netto | `/rente-netto-rechner` | New tool | 5 |
| 14 | aktivrente | aktivrente steuerfrei, aktivrente sozialabgaben, aktivrente steuerfalle, was ist aktivrente | blog | Post | 5 |
| 15 | abfindungsrechner | abfindung rechner, abfindung steuer, fünftelregelung abfindung, abfindung versteuern, abfindung brutto netto, abfindung berechnen, abfindung nach 10 jahren | `/abfindungsrechner` | New tool | 5 |
| 16 | firmenwagen rechner | rechner firmenwagen, brutto netto firmenwagen, geldwerter vorteil firmenwagen, 1 regelung firmenwagen, firmenwagen elektro, firmenwagen hybrid, e auto firmenwagen | `/firmenwagen-rechner` | New tool | 5 |
| 17 | steuerklassen rechner | steuerklasse rechner, steuerklasse 3 und 5, steuerklasse 4 mit faktor, verheiratet steuerklasse, beste steuerklasse | `/steuerklassen-rechner` | New tool | 5 |
| 18 | welche steuerklasse | steuerklasse wechseln nach heirat, steuerklasse ändern, welche steuerklasse bin ich, alleinerziehend steuerklasse | blog | Post | 5 |
| 19 | [Betrag] brutto in netto | [Betrag] brutto netto, [Betrag] brutto steuerklasse 1, [Betrag] brutto wie viel netto, [Betrag] brutto in netto steuerklasse 3 | `/brutto-netto/[betrag]-euro` (38 pages) | Programmatic | 6 |
| 20 | brutto netto rechner [Bundesland] | e.g. brutto netto rechner bayern / nrw / berlin | `/brutto-netto-rechner/[bundesland]` (8 pages) | Programmatic | 7 |

---

## 4. Phase 1 — Main calculator: 2026 & 2027 (publish by 15.10.2026)

1.1 **Engine.** Add tax year 2027 from §2 with status flags. Add a year selector (2026 | 2027) to the main calculator. Default stays 2026 until 31.12.2026 and becomes 2027 on 01.01.2027 via one config constant (`DEFAULT_TAX_YEAR` plus a date check, with ISR revalidation ≤ 24 h if the setup allows, so it flips without a redeploy). Otherwise document the Jan-1 switch in §12.

1.2 **Vorläufig badge** on 2027 results, with a tooltip listing the provisional values.

1.3 **2026 vs. 2027 comparison** below the result: "2027 vs. 2026: ±X € netto/Monat", split into tax effect (Steuerreform) and social-insurance effect (BBG, Zusatzbeitrag).

1.4 **Metadata** (keep the site's existing brand-suffix pattern if any, title ≤ 60 characters):
- Title until 31.12.2026: `Brutto Netto Rechner 2026 & 2027: Gehalt netto berechnen`
- Title from 01.01.2027: `Brutto Netto Rechner 2027: Gehalt netto berechnen`
- Description: `Kostenloser Brutto Netto Rechner 2026 & 2027 für alle Steuerklassen – inkl. Steuerreform 2027, neuer Beitragsbemessungsgrenze und Zusatzbeitrag.`
- H1: `Brutto Netto Rechner 2026 & 2027` (switches with the title).

1.5 **New sections** (short, answer-first):
- "Was ändert sich 2027 beim Nettogehalt?": Grundfreibetrag, Tarif, BBG, Mindestlohn, Minijob, with links to the Phase 3/4 content.
- "Gehaltsrechner und Lohnrechner 2027": one paragraph covering the secondary keywords. No separate URL.
- FAQ additions: "Ab wann gilt der Brutto Netto Rechner 2027?", "Wie viel mehr Netto bringt die Steuerreform 2027?" (computed example), "Warum sind die Werte für 2027 vorläufig?"

1.6 **JSON-LD:** WebApplication (`applicationCategory: "FinanceApplication"`, free offer) + FAQPage + BreadcrumbList; extend the existing helpers. Update the sitemap `lastmod`.

---

## 5. Phase 2 — Weihnachtsgeld (publish by 15.10.2026; peak is November)

2.1 **New tool `/weihnachtsgeld-rechner`**

- Inputs: Monatsbrutto; Weihnachtsgeld brutto (€ or % of Monatsgehalt); Steuerklasse; Kinderfreibeträge; Bundesland (sets Kirchensteuer 8/9 % and Sachsen PV); Kirchensteuer yes/no; Kinder (PV); kinderlos 23+; Zusatzbeitrag (default: Ø 2026); Beschäftigungsmonate im Jahr (default 12); optional Einmalzahlungen already paid this year.
- Calculation uses tax year 2026 (the payout is Nov/Dec 2026):
  - Lohnsteuer on the sonstiger Bezug per PAP: Jahreslohnsteuer with vs. without the sonstiger Bezug.
  - Soli and Kirchensteuer accordingly.
  - Social insurance on the Einmalzahlung using the anteilige Jahres-BBG.
  - Mention the Märzklausel only in the FAQ (relevant for Jan–Mar payouts).
- Output: Weihnachtsgeld netto; deduction breakdown; a "Warum bleibt so wenig übrig?" explanation (progression effect); comparison with the normal Monatsnetto.
- Content:
  - Answer-first intro with a computed example ("Von 1.500 € Weihnachtsgeld bleiben bei 3.500 € Monatsbrutto in Steuerklasse 1 rund X € netto.").
  - "Wie wird Weihnachtsgeld versteuert?"
  - "Ist Weihnachtsgeld steuerfrei?"
  - "Weihnachtsgeld im Minijob": how it counts toward the annual limit; verify the current rule at minijob-zentrale.de.
  - "Weihnachtsgeld im TVöD (Jahressonderzahlung)": percentages by Entgeltgruppe, only from an official source. Otherwise add this section in Phase 5.
  - Computed table: Weihnachtsgeld netto for 500 / 1.000 / 1.500 / 2.000 / 3.000 € × SK I / III / IV.
- Metadata:
  - Title: `Weihnachtsgeld Rechner 2026: Wie viel bleibt netto?`
  - Description: `Wie viel Weihnachtsgeld bleibt netto? Kostenloser Rechner 2026 mit Lohnsteuer, Soli, Kirchensteuer und Sozialabgaben – für alle Steuerklassen.`
- FAQ (computed where numeric): "Wie viel Weihnachtsgeld bleibt netto?", "Warum wird Weihnachtsgeld so hoch versteuert?", "Ist Weihnachtsgeld steuerfrei?", "Zählt Weihnachtsgeld beim Minijob mit?", "Wann wird Weihnachtsgeld ausgezahlt?"
- Add a seasonal teaser on the main calculator (Oct–Dec, toggled via config) linking to this page.

2.2 **Blog draft** (see §10): "Weihnachtsgeld 2026: Anspruch, Auszahlung, Kündigung & Rückzahlung", focus `Weihnachtsgeld Anspruch`. It links to the calculator and must not target "weihnachtsgeld rechner".

---

## 6. Phase 3 — Minijob, Mindestlohn, Midijob 2027 (publish by 31.10.2026)

3.1 **Blog draft:** "Minijob 2027: 633-€-Grenze, 5 % Pauschsteuer & alle Änderungen", focus `Minijob Grenze 2027`.
- Max hours: 633 € ÷ 14,60 € ≈ 43 Stunden/Monat.
- Minijob for Rentner.
- The Rentenkommission's June 2026 proposal to abolish Minijobs: present it as a proposal, not law.
- Mark the Pauschsteuer and KV-Pauschale changes as planned/provisional per §2.
- If an existing Minijob post has a year-neutral slug, update that post instead. If its slug contains "2026", create the new post, add a prominent "Werte 2027 →" box to the 2026 post, and add a March-2027 301 decision to §12.

3.2 **Blog draft:** "Mindestlohn 2027: 14,60 € – so viel bleibt netto", focus `Mindestlohn 2027`.
- Computed table: netto at 14,60 €/h for 10 / 20 / 30 / 40 Stunden/Woche (SK I, 2027 provisional).
- Comparison with 13,90 € in 2026.
- Links to the Stundenlohn and Midijob calculators.

3.3 **New tool `/midijob-rechner`**
- Übergangsbereich calculation for 2026 and 2027 (Faktor F per §2).
- Shows reduced AN-Beitrag, AG-Beitrag, netto, and a comparison with a Minijob.
- Title: `Midijob Rechner 2026 & 2027: Netto im Übergangsbereich`
- Description: `Midijob Rechner für den Übergangsbereich bis 2.000 €: reduzierte Sozialabgaben, Netto und Arbeitgeberkosten für 2026 und 2027 berechnen.`

---

## 7. Phase 4 — Zusatzbeitrag, BBG, Steuerreform 2027 (publish by 15.11.2026)

4.1 **New data page `/zusatzbeitrag-2027`**
- Data file `data/zusatzbeitrag.json` (or the repo's data convention). One entry per Krankenkasse: name, type (AOK, BKK, IKK, Ersatzkasse, …), Zusatzbeitrag 2026, Zusatzbeitrag 2027 (`null` until announced), announcement date, source URL.
- Source: the GKV-Spitzenverband Krankenkassenliste. If you can't parse it reliably, ship the 20 largest Kassen with verified 2026 values and empty 2027 fields ("noch nicht bekannt").
- Client-side sortable and filterable table with a rise/fall indicator; the cheapest Kasse is highlighted.
- Mini calculator "Was kostet mich der neue Zusatzbeitrag?": brutto → monthly AN cost difference 2026 vs. 2027 for the selected Kasse, respecting the BBG.
- Explain the Sonderkündigungsrecht when a Kasse raises its Zusatzbeitrag (verify the current rule).
- Affiliate placeholder for a Krankenkassen comparison partner: labelled "Anzeige", `rel="sponsored"`. It renders nothing until I add the link in config.
- Title: `Zusatzbeitrag 2027: Alle Krankenkassen im Vergleich`
- Description: `Zusatzbeitrag 2027 aller Krankenkassen: TK, AOK, Barmer, DAK, hkk & mehr im Vergleich – plus Rechner, was der neue Beitrag netto kostet.`

4.2 **Blog draft:** "Beitragsbemessungsgrenze 2027: Neue Werte & was sie netto kosten", focus `Beitragsbemessungsgrenze 2027`.
- Table of all Rechengrößen, 2026 vs. 2027.
- Computed AN-Mehrbelastung for 5.000 / 6.000 / 7.000 / 9.000 € brutto.
- Clearly state the draft status of the Verordnung.

4.3 **Blog draft:** "Einkommensteuerreform 2027: So viel mehr Netto (Tabelle)", focus `Steuerreform 2027`.
- Computed table of netto 2026 vs. 2027 for 2.000–8.000 € (SK I and III). Show the tax relief and the higher social-insurance costs separately.
- Status: Regierungsentwurf; update when the law passes.
- Affiliate placeholder for a Steuererklärung partner, same rules as in 4.1.

---

## 8. Phase 5 — New evergreen calculators (Nov–Dec 2026)

Every tool page has: answer-first intro with a computed example → calculator → result explanation + "So rechnen wir" (methodology and assumptions) → computed example table → FAQ → Quellen → related tools → JSON-LD (WebApplication + FAQPage + BreadcrumbList). Every legal or tax rule must be verified from an official source before you code it.

5.1 **`/tvoed-rechner`: TVöD Netto Rechner**
- Data: official tables valid from 01.05.2026 for TVöD VKA (allgemein), TVöD Bund, TVöD SuE and TVöD P, as JSON with `validFrom` and `source`. Use only official sources (VKA, BMI, published tariff texts). Ship any table you can't source reliably later and mark it ⛔.
- Inputs: Tarif, Entgeltgruppe, Stufe, Arbeitszeit % (Teilzeit), plus the standard tax inputs. Output: Tabellenentgelt → netto, Jahressonderzahlung if sourced, and a link to `/weihnachtsgeld-rechner`.
- Content note: the current TVöD agreement runs until 31.03.2027 (verify). New tables follow in 2027; add this to §12.
- Title: `TVöD Rechner 2026: Netto nach Entgeltgruppe & Stufe`
- Description: `TVöD Rechner 2026: Brutto und Netto nach Entgeltgruppe und Stufe berechnen – für TVöD VKA, Bund, SuE und Pflege, inkl. Jahressonderzahlung.`

5.2 **`/stundenlohn-rechner`**
- Two modes: Stundenlohn → Monatsbrutto/-netto (Stunden/Woche, 4,33 Wochen/Monat), and Monatsgehalt → Stundenlohn brutto/netto.
- Mindestlohn check: 13,90 € (2026) / 14,60 € (2027), with a warning badge.
- Title: `Stundenlohn Rechner: Brutto Netto pro Stunde berechnen`
- Description: `Stundenlohn Rechner: Stundenlohn in Monatsbrutto und Netto umrechnen – oder Gehalt in Stundenlohn. Mit Mindestlohn-Check 2026 und 2027.`

5.3 **`/netto-brutto-rechner`**
- Reverse calculation: Wunschnetto → required Brutto, by numeric inversion of the engine (binary search to the cent).
- If the main calculator already has this mode, create the URL only if no existing page targets these keywords.
- Title: `Netto Brutto Rechner: Wunschnetto in Brutto umrechnen`
- Description: `Netto in Brutto umrechnen: welches Bruttogehalt für ein gewünschtes Nettogehalt nötig ist – für alle Steuerklassen, 2026 und 2027.`

5.4 **`/rente-netto-rechner`**
- Inputs: Bruttorente/Monat; Jahr des Rentenbeginns (→ Besteuerungsanteil per §22 EStG under current law); optional other income; Kinder (PV); Zusatzbeitrag; Kirchensteuer.
- KVdR (half the general rate + half the Zusatzbeitrag), PV at the full rate, income tax on the taxable portion. Verify every rule with Deutsche Rentenversicherung / BMF first.
- Section on the Aktivrente, linking to post 5.5.
- Title: `Rente Brutto Netto Rechner 2026: Was bleibt von der Rente?`
- Description: `Rente netto berechnen: Kranken- und Pflegeversicherung der Rentner, Besteuerungsanteil und Steuer – so viel bleibt von der Bruttorente 2026.`

5.5 **Blog draft:** "Aktivrente 2026: 2.000 € steuerfrei – was netto bleibt", focus `Aktivrente`.
- Cover: aktivrente steuerfrei, aktivrente sozialabgaben, aktivrente steuerfalle, was ist aktivrente, who is eligible.
- Computed example table.
- State only rules verified from official BMF/BMAS sources.

5.6 **`/abfindungsrechner`**
- Inputs: Abfindung brutto, Jahresbrutto without Abfindung, standard tax inputs.
- Output:
  - (a) Lohnsteuer deducted at payout (check the current rule on the Fünftelregelung in payroll since 2025);
  - (b) estimated final tax with the Fünftelregelung via the Steuererklärung;
  - (c) the expected refund.
- Social insurance treatment of severance pay: verify officially.
- Content:
  - "Wie hoch ist eine Abfindung?": present 0,5 Monatsgehälter pro Beschäftigungsjahr as a rule of thumb, not an entitlement.
  - Abfindung & Arbeitslosengeld (brief, verified).
  - Computed table.
- Affiliate placeholder for a Steuererklärung partner, same rules as in 4.1.
- Title: `Abfindungsrechner 2026: Abfindung brutto netto berechnen`
- Description: `Abfindung netto berechnen: Lohnsteuer bei Auszahlung, Fünftelregelung über die Steuererklärung und Erstattung – kostenloser Rechner 2026.`

5.7 **`/firmenwagen-rechner`**
- Inputs: Bruttolistenpreis; Antrieb (Verbrenner 1 %, Plug-in-Hybrid 0,5 % if conditions are met, E-Auto 0,25 % up to the price cap, otherwise 0,5 %); km Wohnung–Arbeit (0,03 %/km); Zuzahlung; plus the standard inputs.
- Output: geldwerter Vorteil, and Netto with vs. without Firmenwagen. Add a note on the Fahrtenbuch method.
- Reuse and re-verify the values from my existing Firmenwagen blog post (1 %-Regelung, 0,03 %, E-Auto 2026), and link post ↔ tool both ways.
- Title: `Firmenwagen Rechner 2026: Brutto Netto mit 1 %-Regelung`
- Description: `Firmenwagen Rechner: geldwerten Vorteil und Netto mit 1 %-, 0,5 %- oder 0,25 %-Regelung berechnen – für Verbrenner, Hybrid und E-Auto.`

5.8 **`/steuerklassen-rechner`**: Steuerklassenwahl für Ehepaare
- Inputs: Brutto partner A and B, Kinder, Kirchensteuer, plus the standard inputs.
- Output: Monatsnetto for III/V, V/III, IV/IV and IV/IV mit Faktor (§39f EStG), plus an annual comparison.
- Key messages:
  - The annual tax is the same after the Steuererklärung; only the monthly cash flow differs.
  - The choice affects Lohnersatzleistungen (Elterngeld, ALG I, Krankengeld). Show an example.
- Title: `Steuerklassen Rechner 2026: III/V, IV/IV oder Faktor?`
- Description: `Steuerklassen Rechner für Ehepaare: Netto bei III/V, IV/IV und IV mit Faktor vergleichen und die günstigste Kombination finden.`

5.9 **Blog draft:** "Welche Steuerklasse nach der Heirat? 3/5, 4/4 oder Faktor", focus `welche Steuerklasse`.
- Cover: steuerklasse wechseln nach heirat; steuerklasse ändern (ELSTER steps, verified); welche steuerklasse bin ich; alleinerziehend steuerklasse.

---

## 9. Phases 6–9

### Phase 6 — Programmatic salary pages (live by 15.12.2026, before the January peak)

- Route `/brutto-netto/[betrag]-euro` (e.g. `/brutto-netto/3000-euro`), statically generated.
- **38 amounts:** 1500; 2000–5000 in 100-€ steps; 5500; 6000; 6500; 7000; 8000; 10000.
  Trends demand order: 3000 > 4000 > 3500 > 2000 ≈ 2500 ≈ 5000 > 4500 ≈ 6000 ≈ 1500.
- Template:
  - Title: `3.000 € brutto in netto 2026 & 2027 – alle Steuerklassen`
  - Description: `3.000 € brutto in netto: So viel bleibt 2026 und 2027 in Steuerklasse 1 bis 6 – mit Abzügen, Jahresnetto und Stundenlohn.`
  - H1: `3.000 € brutto in netto`
- Content blocks. Every number is computed by the engine at build time; no randomised or spun text:
  1. Answer box: "Bei 3.000 € brutto bleiben 2026 in Steuerklasse 1 rund X € netto (kinderlos, ohne Kirchensteuer, Ø-Zusatzbeitrag)."
  2. Table: Netto for SK I–VI × 2026 / 2027 (vorläufig), with and without Kirchensteuer.
  3. Deduction breakdown for SK I (LSt, Soli, KiSt, KV, PV, RV, AV), plus total employer cost.
  4. Annual values and the Stundenlohn equivalent (40 h/Woche).
  5. "Gehaltserhöhung": the netto increase for +100 / +250 / +500 €, linking to those amount pages if they exist.
  6. Calculator pre-filled with the amount.
  7. FAQ with 3–5 computed answers.
  8. Links: neighbouring amounts, main calculator, Steuerklassen-Rechner, Bundesland pages.
- Hub page `/brutto-netto/` listing all amounts (table of SK I netto). Link it from the main calculator in a "Beliebte Gehälter" block.
- Quality gate: add `scripts/check-seo-uniqueness` that fails the build on duplicate titles, descriptions or H1s across all routes.

### Phase 7 — Bundesland pages (live by 15.12.2026)

- Route `/brutto-netto-rechner/[bundesland]`. Only the 8 states with measurable demand: bayern, nordrhein-westfalen, berlin, hamburg, hessen, niedersachsen, sachsen, baden-wuerttemberg.
- Demand order: Bayern ≈ NRW > Berlin > Hamburg > Hessen > Niedersachsen > Sachsen ≈ BW.
- Only real differences: Kirchensteuer 8 % (Bayern, Baden-Württemberg) vs. 9 %, and the higher employee PV share in Sachsen. No invented regional facts. Regional salary statistics only with a Destatis/state-statistics source.
- Content:
  - Calculator pre-filled with the state.
  - "Was ist in <Land> anders?" box.
  - Computed netto table for 2.500 / 3.000 / 3.500 / 4.000 / 5.000 € (SK I and III, with/without KiSt).
  - Links to the amount pages.
- Title pattern: `Brutto Netto Rechner Bayern 2026 & 2027`. Use "NRW" in the title for Nordrhein-Westfalen (full name in H1/intro), and `Brutto Netto Rechner Baden-Württemberg (BW) 2026 & 2027`.
- Description pattern: `Brutto Netto Rechner Bayern: Nettogehalt mit 8 % Kirchensteuer berechnen – alle Steuerklassen, Werte für 2026 und 2027.` Use 9 % for the other states; mention the Pflegeversicherung rule for Sachsen.

### Phase 8 — Internal linking, technical SEO, QA (finish by 20.12.2026)

- Add all new tools to the navigation, footer and related-tools component.
- Contextual links:
  - main calculator ↔ every tool;
  - Weihnachtsgeld ↔ TVöD ↔ Minijob;
  - Steuerklassen-Rechner ↔ amount pages;
  - Zusatzbeitrag page ↔ the Zusatzbeitrag input of the main calculator ("Zusatzbeitrag deiner/Ihrer Kasse nachschlagen").
- Sitemap: include all new URLs with `lastmod`.
- Valid JSON-LD on every new page. OG images: reuse the existing generator if present.
- Local crawl of all new routes: status 200, self-referencing canonical, unique title/description/H1, no `noindex`.
- Lighthouse mobile performance ≥ 90 on three representative new pages, if Lighthouse CLI is available.
- Final report in `docs/SEO_ROADMAP_2027.md`:
  - new and changed URLs;
  - blocked items and what you need from me;
  - URLs to submit in Google Search Console, top 10 first.

### Phase 9 — Austria hooks (only if an Austria section already exists)

If `/at` or an equivalent exists:
- Add the 2027 year toggle once official Austrian 2027 values exist (provisional badge otherwise).
- Target: `brutto netto rechner 2027 österreich` (Breakout in AT Trends), `brutto netto rechner pension` (rising), `brutto netto rechner wien`, `brutto netto teilzeit rechner`.

If no Austria section exists, skip this phase; it is a separate project.

---

## 10. Blog drafts — CMS format

If blog posts live in the repo (MDX/MD/JSON), create them in that format.

If posts are created through an admin editor or database, **do not write to the production database**. Instead, create one file per post at `content-drafts/<slug>.json` with exactly these fields:

- Article Headline
- URL Slug
- Category
- Tags (comma separated)
- Article Excerpt
- SEO Settings: Meta Title, Meta Description, Focus Keyword, Canonical URL
- Featured Image Alt Text
- Featured Image Caption
- Open Graph: OG Title, OG Description
- Blog Content: clean HTML for the Next.js editor (`h2`, `h3`, `p`, `ul`, `ol`, `li`, `table`, `strong`, `a` only; no `h1`, no inline styles)
- FAQ Section: array of `{ "Question": "", "Answer": "" }`

Also generate `content-drafts/preview.html`: standalone, no external dependencies, one card per post, every field with its own "Copy" button (`navigator.clipboard`, select-text fallback), and a rendered preview of the Blog Content.

| Post | Focus keyword | Publish by |
|---|---|---|
| Weihnachtsgeld 2026: Anspruch, Auszahlung, Kündigung & Rückzahlung | Weihnachtsgeld Anspruch | 15.10.2026 |
| Minijob 2027: 633-€-Grenze, 5 % Pauschsteuer & alle Änderungen | Minijob Grenze 2027 | 31.10.2026 |
| Mindestlohn 2027: 14,60 € – so viel bleibt netto | Mindestlohn 2027 | 31.10.2026 |
| Beitragsbemessungsgrenze 2027: Neue Werte & was sie netto kosten | Beitragsbemessungsgrenze 2027 | 15.11.2026 |
| Einkommensteuerreform 2027: So viel mehr Netto (Tabelle) | Steuerreform 2027 | 15.11.2026 |
| Aktivrente 2026: 2.000 € steuerfrei – was netto bleibt | Aktivrente | 30.11.2026 |
| Welche Steuerklasse nach der Heirat? 3/5, 4/4 oder Faktor | welche Steuerklasse | 30.11.2026 |

Every post:
- 1.200–1.800 words, answer-first;
- at least one table computed with the engine;
- one exact-match link to the matching calculator, plus a link to the main calculator;
- "Stand" date and Quellen;
- meta title ≤ 60 characters, meta description ≤ 155 characters.

---

## 11. Checklist (keep updated)

- ☑ Phase 0: Audit + mapping (see §14)
- ☑ 1.1 Default year switch (lib/steuerjahr2027.ts; engine 2027 already existed) bdda192 · ☑ 1.2 Vorläufig badge bdda192 · ☑ 1.3 tax/SV split bdda192 · ☑ 1.4 Metadata: title kept on purpose (cannibalization fix 691fdd7) · ☑ 1.5 Sections + FAQ bdda192 · ☑ 1.6 JSON-LD exists (WebPage instead of WebApplication on purpose, no fake rating)
- ☑ 2.1 Weihnachtsgeld-Rechner b14f870 · ☑ 2.2 Weihnachtsgeld post a784857
- ☑ 3.1 Minijob 2027 post ae103e5 · ☑ 3.2 Mindestlohn 2027 post 0e2b7f7 · ☑ 3.3 Midijob-Rechner exists (no change)
- ☑ 4.1 /zusatzbeitrag-2027 2e15666 · ☑ 4.2 BBG 2027: extended the existing page d189e9f (no post) · ☑ 4.3 Steuerreform: extended /brutto-netto-rechner-2027 612b5f3 (no post)
- ☑ 5.1 TVöD interactive calculator on /tvoed-rechner 0002d96 (VKA + SuE; ⛔ TVöD Bund and P tables: need official sources; title kept) · ☑ 5.2 Stundenlohn exists · ☑ 5.3 Netto→Brutto exists · ☑ 5.4 Rente: Aktivrente section 5cf4b2a · ☑ 5.5 Aktivrente post 5cf4b2a · ☑ 5.6 Abfindung rebuild b95aee2 · ☑ 5.7 Firmenwagen fix fa878c3 · ☑ 5.8 Steuerklassen § 39f 370d0af · ☑ 5.9 Steuerklasse-Heirat post 42bcd2e
- ☑ Phase 6: amount pages already exist (86 amounts ⊇ 38); `npm run check:seo` d00727c (482 pages, 0 duplicates; deliberately not part of `build`)
- ☑ Phase 7: 16 Bundesland pages: 2027 column, '2026 & 2027' titles, calculator pre-filled with KiSt rate + Sachsen PV f9b653a
- ☑ Phase 8: sitemap lastmod 1c24050, page images (20) committed, full local crawl (482 pages, 0 orphans, 0 pages without JSON-LD; 4 long descriptions fixed 63f8b30), report in §15
- ☑ Phase 9: Austria section exists, 2027 already built
- ◐ Engine reference tests: scaffold `npm run test:referenz` 0068f51 with 13 cases; ⛔ BMF values must be entered by the owner
- Note for Dec 2026: when the Kassen publish their 2027 rates, do NOT retitle the hub to 'Zusatzbeitrag 2027'; /zusatzbeitrag-2027 owns that keyword.

---

## 12. Update calendar (after launch)

| When | Update |
|---|---|
| Early Nov 2026 | Ø Zusatzbeitrag 2027 (BMG) → config + Zusatzbeitrag page; recompute Faktor F 2027 |
| Nov–Dec 2026 | Kassen-specific Zusatzbeiträge 2027 → `zusatzbeitrag.json` |
| Nov 2026 | BMF PAP 2027 (draft) → replace provisional 2027 tax logic; Rechengrößenverordnung adopted → status `final` |
| When the Bundesrat passes the Einkommensteuerreformgesetz 2027 | Tariff values → `final`; update the Steuerreform post |
| Dec 2026 | Official Faktor F 2027 |
| 01.01.2027 | Default year 2027 everywhere; titles drop "2026 &"; seasonal Weihnachtsgeld teaser off |
| Jan 2027 | Check GSC queries; add amount pages that show impressions |
| Mar 2027 | Decide 301s for year-specific 2026 posts → 2027 posts |
| Spring 2027 | TVöD agreement ends 31.03.2027 → new tables once agreed |

---

## 13. Deployment (only after I write "deploy")

1. Push `seo/roadmap-2027` and open a PR to `main`. Wait for my review and merge.
2. After the merge, GitHub Actions deploys automatically. Watch the workflow run and report the result.
3. On the live domain, check that the homepage, every new URL and the sitemap return 200 (`curl -I`), and that the browser console shows no errors.
4. If the PM2 process `bruttonetto_live` (port 3007) didn't come back cleanly, report it. Don't kill processes yourself.
5. Give me the Google Search Console submission list: sitemap first, then the top 10 new URLs.

---

## 14. Phase 0 — Audit (05.10.2026)

**Finding up front:** this roadmap was written without knowing the repo. **Most of the §3 URLs already exist and rank**, often under different slugs. Rule 7 ("extend the existing page, don't create a new URL") therefore drives most of the mapping below. On 04.10.2026 the site had a self-inflicted cannibalization incident on "brutto netto rechner 2027" (homepage vs. `/brutto-netto-rechner-2027`, fixed in `691fdd7`). That makes duplicate URLs an especially bad idea right now.

### Stack
- Next.js **14.2.35**, **App Router**, TypeScript, Tailwind CSS 3 (+ typography), lucide-react. No test runner: tests are `node --experimental-strip-types scripts/*.test.mts` (`npm run test:*`). `next lint` has no ESLint config, so it would start the interactive setup. Type checking happens in `next build`.
- Deploy: `.github/workflows/deploy.yml` runs **on push to `main`**. It SSHes to the Azure VM, runs `git reset` + `npm ci` + `next build` + `pm2 restart bruttonetto_live`, then does an optional Cloudflare purge. Branch `seo/roadmap-2027` does not deploy.

### Calculator engine — `lib/taxCalculator.ts`
- `calculateNetto(input)` is a pure function. `Steuerjahr = 2026 | 2027`.
  - 2027 runs as a **scenario**: `ohneReform` | `entwurf2027` | `stufe2028`. It uses the verbatim § 32a coefficients from the Regierungsentwurf EStRefG 2027 (BT-Drs. 21/8235), checked by `npm run verify:tarif`.
  - Sozialabgaben 2027 can use the official 2026 values (default) or the BMAS draft `SV_RECHENGROESSEN_2027_ENTWURF`.
- Lohnsteuer uses a **simplified zvE** (Brutto − actual AN-SV − Arbeitnehmer-Pauschbetrag − Sonderausgaben-Pauschbetrag), not the full PAP Vorsorgepauschale.
  - SK III = splitting. SK V/VI = exact PAP 2026 (MST5-6). SK II = Entlastungsbetrag 4.260 €.
  - So the engine is **close to, not identical with,** the BMF Lohnsteuerrechner. See "Reference tests" below.
- Helpers: `steuerNachKlasse()` and `lib/einmalzahlung.ts` (sonstiger Bezug per § 39b Abs. 3 EStG + anteilige Jahres-BBG per § 23a SGB IV).
  - Also `midijobArbeitnehmerBemessungMonat(…, jahr)` and `lib/renteNetto.ts`, `lib/krankengeld.ts`, `lib/sozialabgaben2027.ts` …
- §2 cross-check: every 2027 value in §2 that the engine uses matches the code and its cited source. That covers BBG 6.375/8.850, JAEG 84.150, Bezugsgröße 4.130 (BMAS Referentenentwurf 21.09.2026), the tariff, ANP 1.430, Kindergeld 267, Kinderfreibetrag (BT-Drs. 21/8235), Mindestlohn 14,60 and Minijob 633. Faktor F 2027 = `null` in code (not published), so no guess is used.
- Tests: `test:midijob`, `test:rente`, `test:steuerklassen`, `test:sv2027`, `test:azubi`, `test:neue-rechner`, `test:oesterreich`, `verify:tarif`.

### SEO plumbing
- Metadata is set per route via `export const metadata` / `generateMetadata`, with the canonical in `alternates.canonical`. OG image per page comes from `lib/pageImage.ts` (`npm run page:images`).
- JSON-LD is inline per page (`WebApplication`/`SoftwareApplication`, `FAQPage`, `BreadcrumbList`), with `ORG_ID` from `lib/seo.ts`.
- Sitemap: `app/sitemap.ts`. `siteConfig.lastUpdatedISO` (`lib/authors.ts`) drives the lastmod of the static routes; blog lastmod comes from `updatedISO`.
- Internal links:
  - `lib/navigation.ts` feeds the header/mega menu (JS, invisible to crawlers) and the footer `components/SiteFooter.tsx` (the real crawlable link surface).
  - `getRelatedCalculators` → `RelatedToolsAuto` (in the layout).
  - `ToolContent` blocks (`data/tool-content*.ts`).
- Ads: Auto Ads only (`components/GoogleAdSense.tsx`, `lib/adsConfig.ts`). No manual slots exist to replicate.
- Quality tooling: `scripts/seo-audit.mjs` (crawls the sitemap of a running server).

### Blog
- **File-based**: `content/blog/<slug>.ts` (`BlogPost` type in `lib/blog.ts`), registered in `content/blog/index.ts`, statically rendered at `/blog/<slug>`.
- The MySQL admin editor is decorative since 22.08.2026. So §10's `content-drafts/*.json` + `preview.html` path is **not needed**: posts are written directly in the repo format.
- Form of address: **Sie**.

### Inventory of roadmap topics (existing)
| Topic | Existing URL(s) |
|---|---|
| Main calculator 2026/2027 | `/` (year toggle, 3 reform scenarios, SV-2027 toggle, 2026↔2027 comparison, "Netto 2027" section, "Beliebte Gehälter" block) |
| Steuerreform 2027 | `/brutto-netto-rechner-2027` (= "Steuerreform 2027 Rechner"), blog `gehalt-2027-was-sich-aendert`, `/sozialabgaben-rechner-2027` |
| Weihnachtsgeld | `/weihnachtsgeld-rechner`, `/jahressonderzahlung-rechner` (TVöD/TV-L %), blog `weihnachtsgeld-urlaubsgeld-unterschied`, `/urlaubsgeld-rechner`, `/bonus-steuerrechner` |
| Minijob / Mindestlohn / Midijob | `/minijob-rechner`, `/mindestlohn` (Rechner 2026/2027), `/midijob-rechner` (2026 + 2027), blogs `minijob-grenze-2026`, `midijob-uebergangsbereich` |
| Zusatzbeitrag | `/brutto-netto-rechner-krankenkasse` (hub), 19 × `/krankenkasse/<slug>` (with data-driven 2027 section) |
| BBG | `/beitragsbemessungsgrenze-2026`, `/beitragsbemessungsgrenze-2027` (draft values + Mehrbelastung) |
| Steuerklasse | `/steuerklassen`, `/steuerklassenwechsel-rechner` (III/V vs IV/IV vs Faktor), `/welche-steuerklasse-bin-ich` (finder), blogs `steuerklasse-3-5-oder-4-4`, `steuerklasse-wechseln-frist-november`, `steuerklasse-2-alleinerziehende` |
| TVöD | `/tvoed-rechner` (VKA table + netto), 19 × `/tvoed/<gruppe>`, `/tvoed-sue-tabelle`, `/tv-l-rechner`, `/jahressonderzahlung-rechner` |
| Stundenlohn | `/stundenlohn-rechner` (both modes) |
| Netto→Brutto | `/rechner/netto-zu-brutto`, 27 × `/rechner/<n>-euro-netto-in-brutto` |
| Rente | `/rente-brutto-netto-rechner`, `/rentenrechner`, blog `rente-netto-berechnen` |
| Aktivrente | — (nothing) |
| Abfindung | `/abfindungsrechner` |
| Firmenwagen | `/firmenwagenrechner`, blog `geldwerter-vorteil-firmenwagen` |
| Amount pages | `/rechner/<n>-euro-brutto-netto` for 1.500–10.000 € in 100-€ steps (86 amounts ⊇ the 38 of §9) + `-steuerklasse-1` variants + Jahresgehalt pages; hub `/brutto-netto-gehaltstabelle` |
| Bundesländer | `/brutto-netto-rechner/<land>` for **all 16** states |
| Austria | `/brutto-netto-rechner-oesterreich`, `…-oesterreich-2027`, pension, Teilzeit, Lohnsteuer, Mindestlohn, Lehrer, Durchschnittsgehalt (AT 2027 already built) |

### §3 mapping
| # | Keyword | Decision |
|---|---|---|
| 1 | brutto netto rechner 2026/2027 | **extend `/`**. The title stays "Brutto Netto Rechner 2026/2027 — Gehaltsrechner kostenlos" (deliberate, see the cannibalization fix 691fdd7; GSC re-check due 12.–18.10.). Add the missing pieces only (badge, tax/SV split, FAQ, default-year switch). |
| 2 | weihnachtsgeld rechner | **extend `/weihnachtsgeld-rechner`**: correct engine (anteilige BBG), more inputs, computed table, Minijob/TVöD sections |
| 3 | weihnachtsgeld anspruch | **new blog post** `/blog/weihnachtsgeld-anspruch` |
| 4 | minijob grenze 2027 | **new blog post** `/blog/minijob-2027`. The existing post slug contains 2026 → add a "Werte 2027" box there and drop its "minijob grenze 2027" secondary keyword. |
| 5 | mindestlohn 2027 | **new blog post** `/blog/mindestlohn-2027` (informational; `/mindestlohn` keeps the "Rechner" intent) |
| 6 | midijob rechner | **exists** `/midijob-rechner` (2026 + 2027). No change. |
| 7 | zusatzbeitrag 2027 | **new data page `/zusatzbeitrag-2027`**: list intent ("alle Kassen im Vergleich") that no page targets. The hub keeps the calculator intent; the Kasse pages keep "<kasse> zusatzbeitrag". |
| 8 | beitragsbemessungsgrenze 2027 | **exists** `/beitragsbemessungsgrenze-2027`. No post (it would cannibalize). |
| 9 | steuerreform 2027 | **exists** `/brutto-netto-rechner-2027` (repositioned to exactly this keyword on 04.10.). No post (it would cannibalize). |
| 10 | tvöd rechner | **extend `/tvoed-rechner`** with an interactive calculator (EG/Stufe/Teilzeit). Bund + P tables ⛔ (need official sources). SuE exists separately. |
| 11 | stundenlohn rechner | **exists** `/stundenlohn-rechner` (both modes, Mindestlohn note) |
| 12 | netto in brutto rechner | **exists** `/rechner/netto-zu-brutto` + 27 amount pages |
| 13 | rente brutto netto rechner | **exists** `/rente-brutto-netto-rechner`. Add an Aktivrente section + link. |
| 14 | aktivrente | **new blog post** `/blog/aktivrente` |
| 15 | abfindungsrechner | **extend `/abfindungsrechner`**: the calculation is outdated (Fünftelregelung no longer in payroll since 2025; SK V approximated). Rebuild as payroll → assessment → refund. |
| 16 | firmenwagen rechner | **extend `/firmenwagenrechner`**: E-Auto price cap still 70.000 € (stale; the blog post says 100.000 €). Fix + link post ↔ tool. |
| 17 | steuerklassen rechner | **extend `/steuerklassenwechsel-rechner`**: Faktor is currently "Jahressteuer/12". Implement § 39f properly + the Lohnersatz example. |
| 18 | welche steuerklasse | **new blog post** `/blog/steuerklasse-nach-heirat`, focus "steuerklasse nach heirat". "welche steuerklasse bin ich" stays with the finder. |
| 19 | [Betrag] brutto in netto | **exists** `/rechner/<n>-euro-brutto-netto` (86 amounts). No new `/brutto-netto/[betrag]-euro` route (it would duplicate 86 pages; `/brutto-netto/` is already the Branchen hub). Add the uniqueness check script only. |
| 20 | brutto netto rechner [Bundesland] | **extend `/brutto-netto-rechner/<land>`** (16 states exist): add 2027 values + "2026 & 2027" titles |

### Reference tests (§2)
The engine's zvE is simplified (see above), so exact BMF parity is not expected yet. The BMF Lohnsteuerrechner (bmf-steuerrechner.de) is a JSF form; its API needs a registered code. The inputs are in `scripts/lohnsteuer-referenz.test.mts`, and the BMF results must be filled in by the owner (see the final report).


---

## 15. Final report (05.10.2026)

### New URLs
- `/zusatzbeitrag-2027`
- `/blog/weihnachtsgeld-anspruch`, `/blog/minijob-2027`, `/blog/mindestlohn-2027`, `/blog/aktivrente`, `/blog/steuerklasse-nach-heirat`

### Changed URLs (content/logic)
- `/` (2027 badge, tax/SV split, FAQ, Weihnachtsgeld teaser, default-year switch)
- `/weihnachtsgeld-rechner`, `/abfindungsrechner`, `/firmenwagenrechner`, `/steuerklassenwechsel-rechner` (calculations fixed or rebuilt)
- `/tvoed-rechner` (interactive calculator), `/beitragsbemessungsgrenze-2027`, `/brutto-netto-rechner-2027` (tables)
- `/rente-brutto-netto-rechner` (Aktivrente section), `/minijob-rechner` (KV-Pauschale 2027)
- 16 × `/brutto-netto-rechner/<land>` (2027 + titles)
- 19 × `/krankenkasse/<slug>` + hub (link to the 2027 overview)
- `/blog/minijob-grenze-2026` ("Werte 2027" box)

### Blocked / needs the owner
1. **BMF reference values:** enter 13 values from bmf-steuerrechner.de into `scripts/lohnsteuer-referenz.test.mts` (`bmf: null` → number).
2. **TVöD Bund + TVöD P tables:** need official tables (BMI / VKA). Not derived on purpose.
3. **Google Search Console:** no credentials in the repo. Resubmit the sitemap and request indexing (list below).
4. **Affiliate partners:** enter links in `lib/affiliate.ts` (Krankenkassen-Vergleich, Steuererklärung). Until then nothing renders.

### GSC submission order
1. `https://bruttonettocalculator.com/sitemap.xml` (resubmit)
2. `/zusatzbeitrag-2027`
3. `/weihnachtsgeld-rechner`
4. `/blog/weihnachtsgeld-anspruch`
5. `/abfindungsrechner`
6. `/blog/minijob-2027`
7. `/blog/mindestlohn-2027`
8. `/steuerklassenwechsel-rechner`
9. `/tvoed-rechner`
10. `/blog/aktivrente`
11. `/blog/steuerklasse-nach-heirat`

### Not done on purpose
- New URLs for the BBG/Steuerreform posts, `/firmenwagen-rechner`, `/steuerklassen-rechner`, `/netto-brutto-rechner`, `/rente-netto-rechner`, `/brutto-netto/[betrag]-euro`. Each would duplicate an existing ranking page (rule 7).
- Homepage title and Firmenwagen title: owner decisions from 691fdd7 / 0e3ea89.
- `WebApplication` schema: the site emits `WebPage` on purpose (no fabricated ratings).
- Lighthouse: no Lighthouse CLI in the repo; not run.
