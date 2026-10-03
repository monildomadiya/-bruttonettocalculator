import manifest from "@/data/page-images.json";

/**
 * Seitenbilder (public/seiten-bilder/*.png, erzeugt von `npm run page:images`).
 *
 * Server-seitig für og:image / twitter:image. Das volle Manifest (alle Pfade)
 * gehört nicht ins Client-Bundle — <PageFigure> nutzt data/page-images.client.json
 * und leitet die Betragsseiten per Regel ab.
 *
 * Seiten ohne eigenes Bild (Rechtliches, Admin, Blog mit eigenem Titelbild)
 * fallen auf das allgemeine og-image.png zurück.
 */
const SITE = "https://bruttonettocalculator.com";
export const DEFAULT_OG_IMAGE = `${SITE}/og-image.png`;

const titles = manifest as Record<string, string>;

export function pageImageSlug(path: string): string {
  return path === "/" ? "startseite" : path.slice(1).replace(/\//g, "--");
}

/** Absolute URL des Seitenbilds, sonst das allgemeine og-image.png. */
export function pageImageUrl(path: string): string {
  return path in titles ? `${SITE}/seiten-bilder/${pageImageSlug(path)}.png` : DEFAULT_OG_IMAGE;
}

/** Wie pageImageUrl, aber aus der kanonischen (absoluten) URL einer Seite. */
export function pageImageFromCanonical(canonicalUrl: string): string {
  return pageImageUrl(new URL(canonicalUrl).pathname.replace(/\/$/, "") || "/");
}

/** Fertiger `openGraph.images`-Eintrag inkl. Maßen und Alt-Text. */
export function pageOgImage(path: string) {
  if (!(path in titles)) return { url: DEFAULT_OG_IMAGE };
  return { url: pageImageUrl(path), width: 1200, height: 630, alt: titles[path] };
}
