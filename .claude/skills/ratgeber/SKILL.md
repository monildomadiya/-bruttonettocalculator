---
name: ratgeber
description: Recherchiert per Google-Autocomplete echte Suchanfragen, findet Themenlücken gegenüber den bestehenden Seiten und schreibt daraus fertige, quellenbelegte Ratgeber-Artikel nach content/blog/. Nutzen, wenn neue Blogartikel, SEO-Content, Keyword-Recherche oder Themenideen für bruttonettocalculator.com gefragt sind — Trigger: "neuer Artikel", "Blog schreiben", "Keyword-Recherche", "Content", "Ratgeber", "neue Themen".
---

# Ratgeber-Pipeline

Vollautomatischer Weg von echten Suchanfragen zum veröffentlichten Artikel.
Der Nutzer schreibt nichts selbst — dieser Skill führt Recherche, Auswahl,
Faktenprüfung, Text und Registrierung durch.

## Ablauf

### 1. Keyword-Recherche

```bash
node scripts/keyword-discovery.mjs
```

Holt ~16.000 reale deutsche Suchanfragen über Google Autocomplete, klassifiziert
sie nach Suchintention (informational = Artikel, transactional = Rechnerseite)
und bündelt sie zu Themen-Clustern. Ergebnis: `data/keyword-research.json`.

Kostenlos und ohne Kontingent — Semrush-Units sind endlich, Autocomplete nicht.
Läuft ~3 Minuten.

### 2. Lücke auswählen

Aus `data/keyword-research.json` die Top-Cluster prüfen und **nur** solche
nehmen, die beide Kriterien erfüllen:

- **Keine bestehende Seite deckt das Thema ab.** Gegen `app/`-Routen und
  `content/blog/` prüfen. Ein Artikel, der mit einer Rechnerseite um dasselbe
  Keyword konkurriert, kannibalisiert die eigene Geldseite.
- **Mindestens 5–8 Query-Varianten im Cluster.** Weniger heißt: zu schmal für
  eine eigene Seite, besser als Abschnitt in einen bestehenden Artikel.

Informational-Cluster gehören in den Ratgeber, transactional-Cluster sind ein
Hinweis auf eine fehlende **Rechnerseite** — die gehört nach `app/`, nicht in
den Blog.

### 3. Zahlen verifizieren — nicht verhandelbar

Das ist eine YMYL-Seite (Geld/Steuern). Eine falsche Zahl kostet mehr Vertrauen,
als zehn Artikel aufbauen.

- **Rechenbare Werte** kommen aus der eigenen Engine. In
  `scripts/article-figures.mts` einen Abschnitt ergänzen und ausführen:
  ```bash
  node --experimental-strip-types scripts/article-figures.mts
  ```
  Der Ratgeber muss dieselben Zahlen nennen wie die Rechner — sonst ist der
  Widerspruch für jeden Leser sichtbar.
- **Gesetzliche Werte** (Freibeträge, Sätze, Grenzen) gegen eine primäre Quelle
  prüfen: gesetze-im-internet.de, BMF, BMAS, Haufe. Nie aus dem Gedächtnis.
- Jede genannte Zahl braucht am Ende einen Eintrag in `sources`.

### 4. Artikel schreiben

Datei `content/blog/<slug>.ts` nach dem Muster eines bestehenden Beitrags.
Pflichtfelder siehe `BlogPost` in `lib/blog.ts`.

Was gute von belangloser Konkurrenz unterscheidet:

- **`answer`** — 40–60 Wörter, beantwortet die Hauptfrage vollständig und
  eigenständig lesbar. Genau solche geschlossenen Passagen zitieren Featured
  Snippets und KI-Antwortsysteme.
- **`keyFacts`** — die 5–6 Zahlen, wegen denen jemand die Seite öffnet.
- **Tabellen** — mindestens zwei. Sie gewinnen Snippets und sind der Grund,
  warum Leser bleiben.
- **Der Punkt, den sonst niemand nennt.** Jeder Artikel braucht mindestens eine
  Erkenntnis, die die Top-10-Konkurrenz auslässt — der Kinderfreibetrag-Artikel
  erklärt, warum der Zähler die Lohnsteuer *nicht* senkt; der Homeoffice-Artikel
  rechnet vor, dass die Pauschale allein den Pauschbetrag nie schlägt. Ohne so
  einen Punkt ist der Artikel austauschbar und rankt nicht.
- **`relatedCalculators`** — 3–5 echte Routen aus `lib/navigation.ts`. Der
  Übergang vom Ratgeber zum Rechner ist der eigentliche Zweck des Beitrags.
- **`faqs`** — 5–6 Fragen, wortwörtlich aus den Autocomplete-Varianten des
  Clusters, jede Antwort 2–4 Sätze und eigenständig lesbar (FAQPage-Schema).
- **Ehrlicher Ton.** Wenn sich etwas nicht lohnt, steht das da. Werbetext rankt
  in YMYL nicht.

Umfang: 900–1.400 Wörter Fließtext. Länge ohne Substanz hilft nicht;
Vollständigkeit bei der konkreten Frage schon.

### 5. Registrieren

Import und Eintrag in `content/blog/index.ts`. Sitemap, Related-Links,
Kategorien und Schema ziehen automatisch nach.

### 6. Prüfen

```bash
npx tsc --noEmit
```

Danach Dev-Server über das `preview_start`-Tool starten (nie über Bash) und
die neue Seite aufrufen: eine H1, Antwortbox, Tabellen, Rechner-Block, Quellen.

### 7. Ausliefern

```bash
node scripts/indexnow-submit.mjs
```

Nach dem Deploy ausführen — meldet die neuen URLs an Bing (und damit an
Microsoft Copilot). Für Google genügen Sitemap und interne Verlinkung.

## Harte Regeln

- **Slugs sind unveränderlich.** Ein veröffentlichter Slug ist eine indexierte
  URL. Muss er doch weichen, gehört ein 301 in `next.config.mjs` — ein 404
  verschenkt alle aufgelaufenen Signale.
- **Keine Zahl ohne Quelle.**
- **Kein Artikel zu einem Thema, für das schon eine Rechnerseite rankt.**
- **Keine erfundenen Autoren.** Inhalte laufen unter der Redaktion
  (`lib/authors.ts`) — nie unter einer erfundenen Person mit Titel.

## Dateien

| Zweck | Pfad |
|---|---|
| Keyword-Recherche | `scripts/keyword-discovery.mjs` |
| Recherche-Ergebnis | `data/keyword-research.json` |
| Zahlen aus der Engine | `scripts/article-figures.mts` |
| Artikel | `content/blog/<slug>.ts` |
| Registry | `content/blog/index.ts` |
| Typen & Abfragen | `lib/blog.ts` |
| IndexNow | `scripts/indexnow-submit.mjs` |
