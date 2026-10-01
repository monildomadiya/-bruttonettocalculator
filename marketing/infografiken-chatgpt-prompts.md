# Infografiken (/infografiken): ChatGPT-Prompts, Bild + Details

Stand: 01.10.2026. Alle Zahlen kommen aus unserer Engine (`calculateNetto`, Jahr 2026,
ohne Kirchensteuer, Ø-Zusatzbeitrag 2,9 %). **ChatGPT darf keine Zahl selbst ausrechnen.**

Pro Infografik zwei Schritte: **(A) Bild erzeugen**, **(B) Details für das Admin-Formular erzeugen**.

---

## A — Bild-Prompt (gleicher Look wie „3.000 € brutto")

Einmal am Anfang des Chats einfügen:

```
You design infographics for the German salary website bruttonettocalculator.com.
Recreate EXACTLY this layout for every infographic I send you:

FORMAT: 1080 x 1350 px, portrait 4:5. 80 px safe margin on every side,
nothing may touch the edge (the website shows the image uncropped).

BACKGROUND: flat light grey #F4F5F7, no gradients, no photos, no people.

1. HEADLINE (top, centered): very large, extra-bold, red #E60A1C,
   e.g. "3.000 € brutto".
2. SUBLINE directly under it: large, extra-bold, near-black #16181D,
   e.g. "So viel bleibt netto 2026".
3. HORIZONTAL BAR CHART (middle): 4 rows. Left: small bold black label.
   Middle: rounded bar, length proportional to the value. Right: bold black value.
   All bars light grey #C9CBCF, ONLY the highest value bar in red #E60A1C.
4. TWO WHITE CARDS side by side (bottom): white #FFFFFF, rounded corners 20 px,
   very soft shadow. Each card: bold black label on top, big red number below.
5. FOOTNOTE (very bottom, centered): tiny grey #6B7280 text.

FONT: bold geometric sans-serif (like Inter / Manrope ExtraBold), tight spacing.
TEXT: German only, correct umlauts (ä ö ü ß), German number format
(2.067 € / 652,50 €). Copy every number EXACTLY as I give it. Do not add any
extra text, logo, icon, watermark or decoration.

Reply "OK" and wait for my data.
```

Dann pro Grafik nur den **Bild-Block** aus Teil C senden.

> Falls ein Wert falsch gerendert wird: *„Change only the number X to Y. Keep everything else identical."*

---

## B — Details-Prompt (Felder im Admin-Formular)

Das Admin-Formular braucht: Titel, Slug, Beschreibung, Kategorie, Alt-Text, Kernfakten, Text und Rechner.
Unter **80 Wörtern** lehnt die API den Text ab. Empfohlen sind **150+ Wörter**.

```
Du schreibst die SEO-Texte für eine Infografik auf bruttonettocalculator.com
(Seite /infografiken/<slug>). Zielgruppe: Arbeitnehmer in Deutschland.
Verwende NUR die Zahlen aus meinen Daten. Rechne nichts selbst, runde nichts
um, erfinde keine Quellen, Experten oder Studien.

Gib genau diese Felder aus:

TITEL: max. 60 Zeichen, Hauptkeyword vorne.
  Muster: "3.000 € brutto in netto 2026: So viel bleibt übrig"
SLUG: kleinbuchstaben-mit-bindestrichen, ä→ae ö→oe ü→ue ß→ss, keine €-Zeichen.
  Muster: "3000-euro-brutto-in-netto-2026"
BESCHREIBUNG: 120–155 Zeichen (min. 50, max. 160), mit konkretem Nettobetrag.
KATEGORIE: genau eine aus: Gehalt & Netto | Steuern | Sozialversicherung |
  Krankenversicherung | Rente & Vorsorge | Immobilien & Finanzen |
  Familie & Sozialleistungen | Arbeit & Recht
ALT-TEXT: max. 150 Zeichen, beschreibt was auf dem Bild steht inkl. Zahlen.
KERNFAKTEN: 4–6 Zeilen im Format "Label | Wert", jede Seite max. 60 Zeichen.
TEXT: 180–250 Wörter. Format: Leerzeile = neuer Absatz, "## " = Zwischen-
  überschrift, "- " = Listenpunkt, **fett** erlaubt. Kein anderes Markdown,
  keine Links, keine Tabellen. Aufbau:
  1) Antwort im ersten Satz (Brutto → Netto mit Betrag)
  2) ## Warum die Steuerklasse den Unterschied macht
  3) ## Wohin die Abzüge gehen (Liste)
  4) ## Was die Rechnung nicht berücksichtigt (Kirchensteuer, Kinder,
     anderer Zusatzbeitrag, Freibeträge → "mit dem Rechner selbst prüfen")
  Sachlich, du-Form, keine Werbesprache, kein "ohne Gewähr" im Text.
RECHNER: den Pfad, den ich in den Daten angebe.

Antworte nur mit den Feldern, ohne Einleitung.
```

Dann pro Grafik den **Daten-Block** aus Teil C senden.

---

## C — Fertige Daten-Pakete (Engine-geprüft)

Fußnote auf allen Gehalts-Grafiken:
`kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 % · Steuerklasse II mit 1 Kind`

> **Wichtig zu Steuerklasse II:** SK II gibt es nur für Alleinerziehende, also **mit Kind**.
> Dann fällt der Kinderlosenzuschlag in der Pflegeversicherung weg. Die Werte unten
> berücksichtigen das. **Die bereits veröffentlichte 3.000-€-Grafik zeigt 2.161 €. Richtig
> ist 2.174 €** (siehe Paket 0).

### Paket 0 — 3.000 € brutto (Korrektur der bestehenden Grafik)

**Bild:** Headline `3.000 € brutto` · Subline `So viel bleibt netto 2026`
Balken: `Steuerklasse I 2.067 €` · `Steuerklasse II 2.174 €` · `Steuerklasse III 2.320 €` (rot) · `Steuerklasse IV 2.067 €`
Karten: `Sozialabgaben 652,50 €` · `Lohnsteuer (SK I) 280,07 €`

**Daten:** Brutto 3.000 €/Monat (36.000 €/Jahr). Netto SK I 2.067,43 € · SK II 2.174,47 € · SK III 2.319,88 € · SK IV 2.067,43 €.
Sozialabgaben SK I 652,50 € (RV 279,00 · KV 262,50 · PV 72,00 · ALV 39,00). Lohnsteuer SK I 280,07 € · Soli 0 €.
Rechner: `/brutto-netto-rechner`

### Paket 1 — 2.000 € brutto

**Bild:** `2.000 € brutto` · `So viel bleibt netto 2026`
Balken: I `1.484 €` · II `1.564 €` · III `1.565 €` (rot) · IV `1.484 €`
Karten: `Sozialabgaben 435,00 €` · `Lohnsteuer (SK I) 80,61 €`

**Daten:** Netto SK I 1.484,39 · SK II 1.563,91 · SK III 1.565,00 · SK IV 1.484,39 €. SV 435,00 € (RV 186,00 · KV 175,00 · PV 48,00 · ALV 26,00). LSt 80,61 € · Soli 0 €. Rechner: `/brutto-netto-rechner`

### Paket 2 — 2.500 € brutto

**Bild:** `2.500 € brutto` · `So viel bleibt netto 2026`
Balken: I `1.779 €` · II `1.878 €` · III `1.956 €` (rot) · IV `1.779 €`
Karten: `Sozialabgaben 543,75 €` · `Lohnsteuer (SK I) 177,13 €`

**Daten:** Netto SK I 1.779,12 · SK II 1.878,40 · SK III 1.956,25 · SK IV 1.779,12 €. SV 543,75 € (RV 232,50 · KV 218,75 · PV 60,00 · ALV 32,50). LSt 177,13 € · Soli 0 €. Rechner: `/brutto-netto-rechner`

### Paket 3 — 3.500 € brutto

**Bild:** `3.500 € brutto` · `So viel bleibt netto 2026`
Balken: I `2.349 €` · II `2.464 €` · III `2.640 €` (rot) · IV `2.349 €`
Karten: `Sozialabgaben 761,25 €` · `Lohnsteuer (SK I) 389,37 €`

**Daten:** Netto SK I 2.349,38 · SK II 2.464,08 · SK III 2.640,07 · SK IV 2.349,38 €. SV 761,25 € (RV 325,50 · KV 306,25 · PV 84,00 · ALV 45,50). LSt 389,37 € · Soli 0 €. Rechner: `/brutto-netto-rechner`

### Paket 4 — 4.000 € brutto

**Bild:** `4.000 € brutto` · `So viel bleibt netto 2026`
Balken: I `2.625 €` · II `2.747 €` · III `2.944 €` (rot) · IV `2.625 €`
Karten: `Sozialabgaben 870,00 €` · `Lohnsteuer (SK I) 505,02 €`

**Daten:** Netto SK I 2.624,98 · SK II 2.747,24 · SK III 2.943,58 · SK IV 2.624,98 €. SV 870,00 € (RV 372,00 · KV 350,00 · PV 96,00 · ALV 52,00). LSt 505,02 € · Soli 0 €. Rechner: `/brutto-netto-rechner`

### Paket 5 — 5.000 € brutto

**Bild:** `5.000 € brutto` · `So viel bleibt netto 2026`
Balken: I `3.157 €` · II `3.294 €` · III `3.531 €` (rot) · IV `3.157 €`
Karten: `Sozialabgaben 1.087,50 €` · `Lohnsteuer (SK I) 755,41 €`

**Daten:** Netto SK I 3.157,09 · SK II 3.294,18 · SK III 3.531,22 · SK IV 3.157,09 €. SV 1.087,50 € (RV 465,00 · KV 437,50 · PV 120,00 · ALV 65,00). LSt 755,41 € · Soli 0 €. Rechner: `/brutto-netto-rechner`

### Paket 6 — 6.000 € brutto

**Bild:** `6.000 € brutto` · `So viel bleibt netto 2026`
Balken: I `3.677 €` · II `3.828 €` · III `4.121 €` (rot) · IV `3.677 €`
Karten: `Sozialabgaben 1.284,09 €` · `Lohnsteuer (SK I) 1.038,92 €`

**Daten:** Netto SK I 3.676,98 · SK II 3.828,04 · SK III 4.121,34 · SK IV 3.676,98 €. SV 1.284,09 € (RV 558,00 · KV 508,59 · PV 139,50 · ALV 78,00). LSt 1.038,92 € · Soli 0 €.
Besonderheit: 72.000 €/Jahr liegt über der Beitragsbemessungsgrenze KV/PV 2026 (69.750 €). KV und PV werden nur bis zu dieser Grenze berechnet. Rechner: `/brutto-netto-rechner`

### Paket 7 — „Wohin gehen 3.000 €?" (andere Balken, gleiches Design)

**Bild:** Headline `3.000 € brutto` · Subline `Wohin dein Geld geht`
Balken (6 Zeilen, nur Netto rot): `Netto 2.067,43 €` · `Lohnsteuer 280,07 €` · `Rente 279,00 €` · `Krankenkasse 262,50 €` · `Pflege 72,00 €` · `Arbeitslosen 39,00 €`
Karten: `Abzüge gesamt 932,57 €` · `Netto-Quote 68,9 %`
Fußnote: `Steuerklasse I, kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 %`

**Daten:** wie Paket 0, Summe Abzüge 932,57 €, Netto = 68,9 % vom Brutto. Kategorie: Sozialversicherung. Rechner: `/lohnabrechnung-rechner`

### Paket 8 — „Brutto-Netto-Leiter" Steuerklasse I

**Bild:** Headline `Steuerklasse I` · Subline `Brutto → Netto 2026`
Balken (5 Zeilen, Label = Brutto, Wert = Netto, längster Balken rot): `2.000 € → 1.484 €` · `3.000 € → 2.067 €` · `4.000 € → 2.625 €` · `5.000 € → 3.157 €` · `6.000 € → 3.677 €`
Karten: `Soli bis 6.000 €` `0 €` · `Grundfreibetrag` `12.348 €`
Fußnote: `kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 %`

**Daten:** Netto-Werte aus Paket 1, 0, 4, 5, 6. Grundfreibetrag 2026: 12.348 €. Rechner: `/brutto-netto-gehaltstabelle`

### Paket 9 — 2026 vs. 2027 (Regierungsentwurf)

**Bild:** Headline `Netto 2027` · Subline `Was die Steuerreform bringt`
Balken (3 Zeilen, Wert = Plus pro Monat, größter rot): `3.000 € brutto +8,09 €` · `4.000 € brutto +9,13 €` · `5.000 € brutto +10,53 €`
Karten: `Grundfreibetrag 2027` `12.564 €` · `Status` `Entwurf`
Fußnote: `Steuerklasse I, kinderlos · Regierungsentwurf EStRefG 2027, nicht beschlossen · Sozialabgaben Stand 2026`

**Daten:** Netto SK I 2026 → 2027: 3.000 € 2.067,43 → 2.075,52 · 4.000 € 2.624,98 → 2.634,11 · 5.000 € 3.157,09 → 3.167,62. Grundfreibetrag 12.348 → 12.564 €. Nur der Steuertarif ist neu, die Sozialabgaben sind noch auf Stand 2026 (Rechengrößen 2027 noch nicht beschlossen). Im Text **muss** „Entwurf / noch nicht beschlossen" stehen. Kategorie: Steuern. Rechner: `/brutto-netto-rechner-2027`

---

## D — Checkliste vor dem Hochladen

- [ ] Jede Zahl im Bild mit dem Paket vergleichen. ChatGPT vertauscht oft Ziffern und Kommas.
- [ ] Nur **ein** roter Balken, nämlich der höchste.
- [ ] Nichts am Rand abgeschnitten (4:5, Fußnote vollständig sichtbar).
- [ ] Titel ≤ 60 Zeichen, Beschreibung 50–160, Alt ≤ 150, Text ≥ 150 Wörter.
- [ ] Kernfakten max. 6, jede Seite ≤ 60 Zeichen.
- [ ] Slug ohne Umlaute und ohne €.
- [ ] 2027-Grafiken: „Entwurf" steht im Bild **und** im Text.
- [ ] Nach Veröffentlichung neue URL per IndexNow einreichen.
