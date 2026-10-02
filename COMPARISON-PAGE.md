# Comparison Page Blueprint — Brutto-Netto-Rechner im Vergleich (Roundup)

_Erstellt 2026-07-29 (vs. gehalt.de) · erweitert 2026-10-02 um Finanztip und den 2027-Fokus_
_Wettbewerber-Daten verifiziert am 02.10.2026 von:_
- `https://www.gehalt.de/einkommen/brutto-netto-rechner` (2. Prüfung, unverändert)
- `https://www.finanztip.de/brutto-netto-rechner/` (Seite „Stand: 02. Oktober 2026“, Autor Jörg Leine)

## Entscheidung: Roundup statt „vs. Finanztip“-Seite

Finanztip ist eine stark vertraute Verbraucher-Marke (gemeinnützige Gesellschafterin, 184.969 Aufrufe der
Rechnerseite laut Zähler). Eine eigene Seite „BruttoNettoCalculator vs. Finanztip“ würde als Markenköder
wirken und hätte kaum Chance auf die Marken-SERP. Deshalb: Finanztip als **dritte Spalte** in die bestehende
Vergleichsseite `/brutto-netto-rechner-vergleich`, mit 2027 als neuem Schwerpunkt — genau das ist die Frage,
die Nutzer im Herbst 2026 stellen („brutto netto rechner 2027“).

- **URL:** `/brutto-netto-rechner-vergleich` (bestehend)
- **Title:** `Brutto-Netto-Rechner Vergleich 2026/2027: wer kann was?` (55 Zeichen)
- **H1:** `Brutto-Netto-Rechner im Vergleich 2026/2027`
- **Umfang:** ≈ 1.900 Wörter, 17 Matrixzeilen, 20 Fußnoten, 7 FAQ

> ⚖️ **§ 6 UWG:** Jede Zelle mit Unterschied ist mit einer Fußnote belegt. „Nein“ nur, wo der Anbieter es
> selbst schreibt oder die Seite es eindeutig zeigt; sonst „nicht auf dieser Seite“.

## Feature-Matrix (Stand 02.10.2026)

| Merkmal | BruttoNettoCalculator | gehalt.de | Finanztip |
|---|:---:|:---:|:---:|
| Steuerjahr 2026 | ✅ | ✅ | ✅ |
| Steuertarif 2027 (Regierungsentwurf 2.9.2026) | ✅ | ❌ ¹ | ✅ ¹⁰ |
| Reformszenarien (ohne Reform · Entwurf · 2028) | ✅ 3 | — | ⚠️ 1 Szenario ¹⁰ |
| Sozialabgaben 2027 mit BBG-Entwurf | ✅ Umschalter ²⁰ | — | ✅ ¹¹ |
| Netto → Brutto (exakt) | ✅ eigener Rechner ²³ | ⚠️ Faustregel 1,3–1,4× ² | — ¹² |
| Vergangene Steuerjahre | ❌ | ✅ 2024/2025 ³ | ❌ ¹⁰ |
| Eigener KK-Zusatzbeitrag | ⚠️ separater Rechner ²¹ | ✅ ³ | ✅ Kassenauswahl ¹³ |
| Alter / Geburtsjahr | ⚠️ | ✅ ³ | ✅ ¹³ |
| Privat versichert / ohne RV/ALV | ⚠️ Beamten-Rechner ²² | ✅ ³ | ✅ ¹³ |
| Zusätzlicher Steuerfreibetrag | ❌ | ✅ ⁴ | ✅ ¹³ |
| Beamte | ✅ | — ⁵ | ⚠️ „erste Orientierung“ ¹⁴ |
| Midijob | ✅ | — ⁵ | ❌ (laut Finanztip) ¹⁵ |
| Firmenwagen | ✅ | — ⁵ | — ¹⁶ |
| Seite je Bundesland | ✅ 16 | ❌ ⁶ | ❌ ¹³ |
| Kostenlos, ohne Konto | ✅ | ✅ Beruf & Wohnort Pflicht ⁷ | ✅ |
| Quellen/Entwürfe verlinkt | ✅ | ⚠️ ⁸ | ✅ ¹¹ |
| Sprachen | DE EN PL RO TR UK | DE | DE |

## Wettbewerbsanalyse: unsere 2027-Seite vs. Finanztip

**Gleich:** Steuertarif 2027 aus demselben Regierungsentwurf (12.564 € Grundfreibetrag, 1.430 €
AN-Pauschbetrag, 47 % ab 280.000 €).

**Finanztip vorn**
1. **SV 2027 im Netto** — BBG-Entwurf (KV/PV 76.500 €, RV 106.200 €) + GKV-Beitragssatzstabilisierungsgesetz.
   Unser Hauptrechner bleibt bewusst bei SV 2026 (Begründung in `lib/sozialabgaben2027.ts`). Aber: Für den
   Steuerteil nutzen wir ebenfalls einen Entwurf — die Begründung ist inkonsistent. Wirkt ab ≈ 5.800 €/Monat.
2. **Kassenauswahl im selben Formular** (Spar-Hook „lohnt ein Kassenwechsel?“).
3. **Alter, Freibetrag, RV/ALV-/GKV-Schalter** direkt im Rechner.
4. **Transparenz-Block** „Welche vorläufigen Werte hat Finanztip verwendet?“ mit verlinkten PDFs —
   inklusive offen benannter Lücken (Kinderlosenzuschlag 0,9 % geplant, Aktivrente fehlt).
5. **Marke & Reichweite** (Newsletter > 1 Mio. Leser) — nicht einholbar, nur flankierbar.

**Wir vorn**
1. Drei Reformszenarien + Gesetzgebungs-Tracker (Finanztip: ein Szenario).
2. Midijob (Finanztip schließt ihn ausdrücklich aus), Beamte, Firmenwagen, exaktes Netto→Brutto auch 2027.
3. Tabellen (Entlastung je Gehalt, Tarifeckwerte) und ~5.500 Wörter Kontext auf der 2027-Seite.
4. Sechs Sprachen, eigene Bundesland-Seiten.

## Empfehlungen (priorisiert)

1. ✅ **Erledigt 02.10.2026:** Umschalter „Sozialabgaben 2027“ (Stand 2026 / Entwurf 2027) im Hauptrechner,
   Engine-Option `sv2027`, Test `npm run test:sv2027`. Matrixzeile auf „Ja · Umschalter“ geändert.
2. **Krankenkassen-Auswahl in den Hauptrechner** — Engine kann `kvZusatzbeitrag` bereits; die Daten
   (`data/krankenkassen`) existieren für den Krankenkassen-Rechner.
3. **Block „Welche Werte verwendet dieser Rechner für 2027?“** oben auf `/brutto-netto-rechner-2027`,
   als Liste mit Quelle je Wert (wie Finanztip) — stärkt E-E-A-T für die wichtigste Seite der Domain.
4. **Aktivrente** (2.000 €/Monat steuerfrei ab Regelaltersgrenze): weder wir noch Finanztip — First-Mover-Chance,
   nach Prüfung der Rechtslage.
5. **Kinderlosenzuschlag 0,9 % ab 2027** (laut Finanztip geplant): verfolgen und als Szenario anbieten, sobald
   ein Entwurf vorliegt.
6. Vergleichsseite **quartalsweise** neu prüfen (nächster Termin Anfang Januar 2027) — sofort, wenn gehalt.de
   2027 nachrüstet oder Finanztip Midijob/Netto→Brutto ergänzt.

## Bei der Prüfung gefundene eigene Falschaussage (korrigiert)

Die Seiten `/brutto-netto-rechner-2026`, `/brutto-netto-rechner-2027` und die alte Vergleichstabelle
behaupteten einen „Modus Netto zu Brutto“ bzw. „Umschalter“ im Hauptrechner. Den gibt es nicht —
Netto→Brutto ist der eigene Rechner `/rechner/netto-zu-brutto` (2026 und 2027). Texte und Matrix sind
korrigiert; in einer vergleichenden Werbung wäre die alte Aussage angreifbar gewesen.

## Keywords

- **Primär:** brutto netto rechner vergleich · brutto netto rechner 2027 vergleich
- **Sekundär:** bester brutto netto rechner · welcher brutto netto rechner stimmt · brutto netto rechner test
- **Marken (nur informativ, keine Köder-Seiten):** finanztip brutto netto rechner · gehalt.de brutto netto rechner

## Schema

`comparison-schema.json`: BreadcrumbList · WebPage · ItemList (3 × SoftwareApplication, Preis 0 €) · FAQPage.
Bewusst **ohne** Product/AggregateRating — keine echten Bewertungsdaten.
