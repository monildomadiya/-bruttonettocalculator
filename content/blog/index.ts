/**
 * Artikel-Registry.
 *
 * Jeder Ratgeber-Beitrag ist eine Datei in diesem Verzeichnis und wird hier
 * einmal registriert. Bewusst explizite Imports statt eines Verzeichnis-Scans:
 * Next.js bündelt so nur, was tatsächlich verlinkt ist, TypeScript prüft jeden
 * Beitrag gegen das BlogPost-Schema, und ein Tippfehler im Dateinamen fällt
 * beim Build auf — nicht erst als 404 in der Produktion.
 *
 * NEUEN ARTIKEL HINZUFÜGEN:
 *   1. content/blog/<slug>.ts anlegen (Vorlage: ein bestehender Beitrag)
 *   2. hier importieren und in BLOG_POSTS eintragen
 *   3. fertig — Übersicht, Sitemap, Related-Links und Schema ziehen automatisch nach
 *
 * SLUG NIE ÄNDERN. Ein veröffentlichter Slug ist eine indexierte URL; eine
 * Umbenennung ist ein 404 plus Rankingverlust. Falls doch nötig: alten Slug in
 * next.config.mjs auf den neuen 301-weiterleiten.
 */

import type { BlogPost } from "@/lib/blog";

import { post as kinderfreibetrag2026 } from "./kinderfreibetrag-2026";
import { post as kinderfreibetragZaehler } from "./kinderfreibetrag-zaehler-bedeutung";
import { post as solidaritaetszuschlag2026 } from "./solidaritaetszuschlag-2026";
import { post as pendlerpauschale2026 } from "./pendlerpauschale-2026-38-cent";
import { post as homeofficePauschale2026 } from "./homeoffice-pauschale-2026";
import { post as prozentBruttoNetto } from "./wie-viel-prozent-brutto-netto";
import { post as steuerklasse35oder44 } from "./steuerklasse-3-5-oder-4-4";
import { post as kirchensteuer2026 } from "./kirchensteuer-2026";
import { post as renteNetto } from "./rente-netto-berechnen";
import { post as minijobGrenze2026 } from "./minijob-grenze-2026";
import { post as vermoegenswirksameLeistungen } from "./vermoegenswirksame-leistungen";
import { post as werbungskosten2026 } from "./werbungskosten-2026";
import { post as weihnachtsgeldUrlaubsgeld } from "./weihnachtsgeld-urlaubsgeld-unterschied";
import { post as geldwerterVorteil } from "./geldwerter-vorteil-firmenwagen";

export const BLOG_POSTS: BlogPost[] = [
  kinderfreibetrag2026,
  kinderfreibetragZaehler,
  solidaritaetszuschlag2026,
  pendlerpauschale2026,
  homeofficePauschale2026,
  prozentBruttoNetto,
  steuerklasse35oder44,
  kirchensteuer2026,
  renteNetto,
  minijobGrenze2026,
  vermoegenswirksameLeistungen,
  werbungskosten2026,
  weihnachtsgeldUrlaubsgeld,
  geldwerterVorteil,
];
