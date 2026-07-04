# BruttoNettoCalculator.com

Deutscher Brutto-Netto-Gehaltsrechner. Next.js 14 (App Router) + Tailwind CSS.
MySQL-Schema für versionierte Steuerparameter liegt bereit (`db/schema.sql`),
aktuell nutzt der Rechner noch fest kodierte 2026-Werte in
`lib/taxCalculator.ts`.

## Setup

```bash
npm install
npm run dev
```

Öffnet auf http://localhost:3000

## Struktur

- `app/page.tsx` — Homepage mit Live-Rechner (Hauptkeyword: brutto netto rechner, gehaltsrechner)
- `app/brutto-netto-rechner-2027/` — 2027-Keyword-Seite (mit Vorläufigkeits-Hinweis)
- `app/rechner/brutto-zu-netto/`, `app/rechner/netto-zu-brutto/` — Keyword-Varianten
- `app/lexikon/`, `app/faq/` — AEO/GEO-optimierte Direktantwort-Inhalte
- `app/impressum/`, `app/datenschutz/`, `app/kontakt/`, `app/ueber-uns/` — Pflichtseiten
- `lib/taxCalculator.ts` — Berechnungslogik (§ 32a EStG 2026, SV-Rechengrößen 2026)
- `components/Calculator.tsx` — Interaktiver Rechner (Client Component)
- `db/schema.sql` — MySQL-Schema für zukünftige DB-gestützte Jahreswerte

## Vor dem Live-Gang — Checkliste

1. **Impressum ausfüllen** (`app/impressum/page.tsx`) — gesetzlich Pflicht (§ 5 TMG)
   für an Deutschland gerichtete Websites.
2. **Datenschutzerklärung ausfüllen** (`app/datenschutz/page.tsx`), sobald
   Analytics/AdSense/Cookies eingebunden sind.
3. **Cookie-Consent-Banner (CMP)** einbauen, bevor Tracking/Werbe-Skripte laden
   (Pflicht für AdSense im EWR — TCF 2.2).
4. **Domain-Metadaten** in `app/layout.tsx` prüfen (OG-Bilder, Favicon in `public/`).
5. **MySQL anbinden**: `db/schema.sql` ausführen, `lib/taxCalculator.ts` auf
   DB-Werte umstellen, sobald mehrere Jahre gepflegt werden sollen.
6. **2027-Werte aktualisieren**, sobald der Existenzminimumbericht
   (Herbst 2026) und die finale Gesetzesfassung vorliegen.
7. AdSense-Antrag erst nach Impressum + Datenschutz + ausreichend Content
   (Lexikon-Einträge ausbauen) stellen.

## Datenquellen (Stand Juli 2026)

- § 32a EStG, Fassung ab VZ 2026 — BMF Amtliches Lohnsteuer-Handbuch (LStH 2026)
- Sozialversicherungsrechengrößen-Verordnung 2026
