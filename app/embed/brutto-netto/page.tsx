import type { Metadata } from "next";
import EmbedCalculator from "@/components/EmbedCalculator";

/**
 * iframe-Ziel für das einbettbare Widget.
 *
 * Kein Header, kein Footer, keine Werbung — die Seite existiert nur, um in
 * einem fremden Layout zu stecken. Bewusst `noindex`: Der Inhalt ist eine
 * abgespeckte Variante des Hauptrechners; im Index wäre sie eine Dublette,
 * die mit der eigenen Startseite konkurriert. `follow` bleibt, damit der
 * Verweis auf die Startseite gewertet wird.
 */
export const metadata: Metadata = {
  title: "Brutto-Netto-Rechner (Widget)",
  description: "Einbettbarer Brutto-Netto-Rechner für Deutschland, Stand 2026.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://bruttonettocalculator.com/widget" },
};

export const dynamic = "force-static";

/**
 * `accent` und `brutto` kommen als Query-Parameter der Einbettung, werden aber
 * NICHT hier ausgewertet: Eine statisch vorgerenderte Seite kennt zur Buildzeit
 * keine Anfrage und sieht `searchParams` deshalb nie. Die Auswertung passiert
 * im Client (siehe readEmbedParams in EmbedCalculator) — so bleibt die Seite
 * CDN-cachebar und die Anpassung funktioniert trotzdem.
 */
export default function EmbedBruttoNettoPage() {
  return (
    <main style={{ margin: 0, padding: 8, background: "transparent" }}>
      <EmbedCalculator />
    </main>
  );
}
