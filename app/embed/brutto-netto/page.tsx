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

export default function EmbedBruttoNettoPage({
  searchParams,
}: {
  searchParams?: { accent?: string; brutto?: string };
}) {
  // Nur Hex-Farben akzeptieren — ein ungeprüfter Query-Wert landet sonst
  // direkt in einer CSS-Custom-Property auf einer fremden Seite.
  const accentParam = searchParams?.accent ? `#${searchParams.accent.replace(/^#/, "")}` : "";
  const accent = /^#[0-9a-fA-F]{6}$/.test(accentParam) ? accentParam : "#E60A1C";

  const bruttoParam = Number(searchParams?.brutto);
  const defaultBrutto =
    Number.isFinite(bruttoParam) && bruttoParam > 0 && bruttoParam < 1_000_000
      ? Math.round(bruttoParam)
      : 3500;

  return (
    <main style={{ margin: 0, padding: 8, background: "transparent" }}>
      <EmbedCalculator accent={accent} defaultBrutto={defaultBrutto} />
    </main>
  );
}
