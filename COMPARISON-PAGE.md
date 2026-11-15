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

---

# Re-Prüfung 15.11.2026 (§ 6 UWG, quartalsweise)

_Vorgezogen vom geplanten Termin „Anfang Januar 2027“, weil die Auslöserbedingung griff: der
durchschnittliche Zusatzbeitrag 2027 ist seit dem 30.10.2026 amtlich, und die Matrix behauptete
noch „amtlich bis 1. November“. `GEPRUEFT_AM` 02.10. → **15.11.2026**._

**Erneut geprüft wurden alle Fußnoten 1–16**, jeweils von der öffentlich abrufbaren Rechnerseite,
ohne Konto und ohne Login. Ergebnis: **keine Fußnote musste zurückgezogen werden.**

| Prüfpunkt | Stand 02.10. | Stand 15.11. |
|---|---|---|
| gehalt.de: 2027 im Rechner | nein (Fn. 1) | **unverändert nein** — 0 Treffer für „2027“ auf der Seite; Abrechnungsjahr 2026 / 2025 / 2024 |
| gehalt.de: Faustregel 1,3–1,4 × statt Netto→Brutto (Fn. 2) | ja | unverändert |
| gehalt.de: Detailmodus, Geburtsjahr, Kassensatz, privat/gesetzlich (Fn. 3) | ja | unverändert |
| gehalt.de: Jahresfreibetrag (Fn. 4), Bundesland-Feld (Fn. 6), Beruf+Wohnort Pflicht (Fn. 7) | ja | unverändert |
| gehalt.de: keine Gesetzes-Verlinkung (Fn. 8), nur DE (Fn. 9) | ja | unverändert |
| Finanztip: Tarif 2027 aus RegE 2.9.2026 (Fn. 10) | ja | unverändert |
| Finanztip: BBG 2027 aus BMAS-Entwurf **21.9.2026** (Fn. 11) | ja | **unverändert** — Kabinettsbeschluss 7.10. nicht nachgezogen |
| Finanztip: kein Netto→Brutto (Fn. 12) | ja | unverändert (0 Treffer) |
| Finanztip: Formularfelder (Fn. 13) | ja | unverändert |
| Finanztip: Beamte „erste Orientierung“ (Fn. 14) | ja | unverändert, Wortlaut bestätigt |
| Finanztip: Midijob bewusst nicht abgebildet (Fn. 15) | ja | unverändert, Wortlaut bestätigt |

**Seitenstand Finanztip: „Stand: 19. Oktober 2026“** — also **11 Tage vor** der BMG-Festlegung.
Die Seite nennt 2,9 % nur für 2026. Rechnerisch ist das Ergebnis identisch, weil der Durchschnitt
unverändert blieb; ausgewiesen ist der Wert aber nicht als amtlicher 2027-Wert.

**Neue Matrixzeile 18: „Zusatzbeitrag 2027 auf amtlicher Grundlage“** (Fn. 24 eigen, Fn. 17 Finanztip).
Formuliert ausdrücklich so, dass **kein Rechenfehler** unterstellt wird — der Unterschied ist die
zitierte Grundlage, nicht das Ergebnis. Das ist die § 6 UWG-Grenze: objektiv nachprüfbar, nicht
herabsetzend.

## Der Wettbewerber, der in der Matrix fehlt: netto-check.de

`https://www.netto-check.de/brutto-netto-2027-rechner` — Title „Brutto Netto Rechner 2027 mit
Steuerreform & Vergleich zu 2026“. **Das ist der eigentliche Gegner für 2027-Intent**, nicht gehalt.de:

- **Wird in der AI Overview zu „brutto netto rechner 2027“ zitiert** (zusammen mit Finanztip) — siehe
  die Ranking-Analyse vom 23.10.2026. gehalt.de ist dort nicht vertreten.
- **Hat die BMG-Festlegung schon drin:** „Den durchschnittlichen Zusatzbeitrag 2027 hat das
  Gesundheitsministerium am 30. Oktober 2026 auf 2,9 % festgelegt“ — d. h. **frischer als Finanztip
  und, bis zum Deploy, frischer als wir.**
- Rechnet mit PV-Zuschlag 0,9, RV 18,6 %, einstellbarem Zusatzbeitrag, gesetzlich/privat,
  Bundesland-Auswahl, Grundfreibetrag 12.564 € (identisch zu unserem Stand).
- Benennt dieselbe Einschränkung wie wir: Grenzbeträge Steuerklasse V/VI noch auf Stand 2026.
- **Nennt einen Termin, den wir nicht haben: „Der Bundesrat entscheidet am 20. November.“**
- Nicht gefunden: Beamte (0 Treffer), Netto→Brutto (0), Englisch (0), Steuerjahr 2024 (0).
  Midijob und Aktivrente nur als Fließtext erwähnt — **nicht** als „kann das“ zu werten.

**Empfehlung: vierte Spalte.** Eine Vergleichsseite, die den von AI Overviews zitierten Wettbewerber
nicht führt, vergleicht an der SERP vorbei. Aufwand: `Cell`-Typ um `nc` erweitern, 18 Zeilen, Tabellen-
Rendering, Fußnoten 30–39, ItemList auf 4 Einträge. Vorher jede Zelle einzeln von der Live-Seite belegen.

## Aktivrente — First-Mover-Chance, jetzt belegt

Finanztip schreibt auf der geprüften Seite selbst: *„Der Brutto-Netto-Rechner von Finanztip
berücksichtigt das noch nicht. Es gibt auch noch keinen offiziellen Rechner, etwa vom
Bundesfinanzministerium, der das kann.“* Freibetrag 24.000 €/Jahr bzw. 2.000 €/Monat ab
Regelaltersgrenze. Wir haben dazu bisher nur einen Blog-Artikel (`content/blog/aktivrente.ts`) und
eine Erwähnung in `/rente-brutto-netto-rechner` — **keinen Rechner**. Empfehlung #4 von 10/2026 steht
damit belegt: kein Wettbewerber der drei hat es, und der Marktführer sagt öffentlich, dass er es nicht hat.

## Keywords — mit Kannibalisierungs-Grenze

Der Aufruf nannte `brutto netto rechner 2027` als Ziel-Keyword. **Darauf darf diese Seite nicht
optimiert werden:** das Keyword gehört der Startseite (Entscheidung vom 04.10.2026, Position ~6 und in
Erholung). Die Vergleichsseite bedient Vergleichs-Intent und stützt die Startseite per interner
Verlinkung — niemals mit Exact-Match-Anchor.

- **Primär:** brutto netto rechner vergleich · brutto netto rechner 2027 vergleich
- **Sekundär:** bester brutto netto rechner · welcher brutto netto rechner ist der genaueste ·
  brutto netto rechner test · warum zeigen rechner unterschiedliches netto
- **Neu, durch die Prüfung belegt:** welcher brutto netto rechner rechnet 2027 ·
  brutto netto rechner zusatzbeitrag 2027
- **Marken (nur informativ, keine Köder-Seiten):** finanztip brutto netto rechner ·
  gehalt.de brutto netto rechner · netto-check brutto netto rechner

## Nächste Termine

- **20.11.2026 — Bundesrat zur SV-Rechengrößen-Verordnung 2027** (laut netto-check.de; selbst
  verifizieren). Danach `BBG_2027_STATUS` → beschlossen, Fußnote 11 und Matrix nachziehen.
- **2./3. Lesung EStRefG 2027** — am 15.11.2026 noch nicht erfolgt (geprüft). Danach Fn. 10 und die
  Reformszenarien-Zeile anfassen.
- **Dezember 2026** — Kassen beschließen ihre 2027-Sätze; Fn. 24 und die Kassen-Spalten nachziehen.
- **Quartalsprüfung** nächster Regeltermin Anfang Januar 2027, sofort bei: gehalt.de rüstet 2027 nach ·
  Finanztip ergänzt Midijob oder Netto→Brutto · netto-check.de ändert seinen Funktionsumfang.

## Nachtrag 15.11.2026: eigene Zellen waren veraltet — zu unseren Lasten

Die Prüfung oben galt den **Wettbewerber**-Fußnoten (1–16). Beim Schreiben der
`featureList` für das neue `WebApplication`-Schema der Startseite fiel auf, dass
**unsere eigenen Zellen (Fn. 20–24) nicht mitgeprüft** worden waren — und drei davon
waren falsch, und zwar jeweils zu unseren Lasten. Belegt an `components/Calculator.tsx`:

| Zeile | stand auf | ist richtig |
|---|---|---|
| Eigener Krankenkassen-Zusatzbeitrag | „teilweise · Krankenkassen-Rechner“ | **ja** — Kassenauswahl ist seit 10/2026 im Hauptrechner (`KRANKENKASSEN_2026`) |
| Zusätzlicher Steuerfreibetrag | **„nein“** | **ja** — „Steuerfreibetrag pro Jahr (ELStAM)“, § 39a EStG (neue Fn. 25) |
| Privat versichert / ohne RV oder ALV | „teilweise · Beamten-Rechner“ | teilweise, aber anders begründet: **PKV inkl. Arbeitgeberzuschuss und JAEG ist im Hauptrechner**; es fehlen nur die RV-/ALV-Schalter |

Damit ist **Empfehlung #2 von 10/2026 („Krankenkassen-Auswahl in den Hauptrechner“)
erledigt** — sie stand nur noch deshalb auf der Liste, weil die Matrix es nicht
mitbekommen hatte. Auch die FAQ-Antwort zu gehalt.de wurde nachgezogen: der
individuelle Kassensatz ist kein Vorteil von gehalt.de mehr, weil ihn inzwischen
alle drei Rechner haben. Vergangene Steuerjahre und das Geburtsjahr bleiben echte
Vorteile von gehalt.de und stehen weiter so in der Tabelle.

**Lehre für die nächste Quartalsprüfung:** die eigenen Fußnoten mitprüfen. Eine
veraltete Zelle über uns selbst ist kein § 6 UWG-Risiko, kostet aber genau das
Unterscheidungsmerkmal, für das die Seite gebaut wurde — und hier hat sie uns drei
Zeilen lang schlechter dargestellt, als wir sind.
