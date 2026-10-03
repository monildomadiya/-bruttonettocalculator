"use client";

import { usePathname } from "next/navigation";
import titles from "@/data/page-images.client.json";
import { getCommonGrossSalaryAmounts, getCommonAnnualSalaryAmounts, getNettoInBruttoAmounts } from "@/data/wage-stats";

/**
 * Die Seitengrafik (public/seiten-bilder/<slug>.png) sichtbar auf der Seite —
 * einmal im Root-Layout eingebunden, wie <RelatedToolsAuto>.
 *
 * usePathname() löst beim Server-Rendering auf, das <img> steht also im
 * ausgelieferten HTML: Googlebot-Image findet es samt Alt-Text und
 * Bildunterschrift, ohne JavaScript auszuführen.
 *
 * Für ~150 Seiten kommt der Titel aus dem Client-Manifest (~10 kB). Die ~280
 * Betragsseiten stehen bewusst nicht darin: Ihr Text folgt aus dem Pfad, und
 * ob es ein Bild gibt, aus denselben Whitelists, die auch Sitemap und
 * generateStaticParams speisen.
 */

const nf = (n: number) => new Intl.NumberFormat("de-DE").format(n);

function amountPage(path: string): { caption: string; alt: string } | null {
  let m = /^\/rechner\/(\d+)-euro-brutto-netto(-steuerklasse-1)?$/.exec(path);
  if (m && getCommonGrossSalaryAmounts().includes(+m[1])) {
    const sk = m[2] ? " in Steuerklasse 1" : "";
    return {
      caption: `${nf(+m[1])} € Brutto in Netto 2026${sk}`,
      alt: `Grafik: ${nf(+m[1])} € brutto in netto 2026${sk} — Aufteilung in Netto, Steuern und Sozialabgaben`,
    };
  }
  m = /^\/rechner\/(\d+)-euro-jahresgehalt-brutto-netto$/.exec(path);
  if (m && getCommonAnnualSalaryAmounts().includes(+m[1])) {
    return {
      caption: `${nf(+m[1])} € Jahresgehalt in Netto 2026`,
      alt: `Grafik: ${nf(+m[1])} € Jahresgehalt in netto 2026 — Aufteilung in Netto, Steuern und Sozialabgaben`,
    };
  }
  m = /^\/rechner\/(\d+)-euro-netto-in-brutto$/.exec(path);
  if (m && getNettoInBruttoAmounts().includes(+m[1])) {
    return {
      caption: `${nf(+m[1])} € Netto in Brutto 2026`,
      alt: `Grafik: ${nf(+m[1])} € netto in brutto 2026 — nötiges Bruttogehalt, Steuern und Sozialabgaben`,
    };
  }
  return null;
}

export default function PageFigure() {
  const path = usePathname() || "/";
  const known = (titles as Record<string, string>)[path];
  const info = known ? { caption: known, alt: `Grafik: ${known}` } : amountPage(path);
  if (!info) return null;

  const slug = path === "/" ? "startseite" : path.slice(1).replace(/\//g, "--");

  return (
    <section className="no-print w-full max-w-6xl mx-auto px-4 sm:px-5 mt-8 mb-2" aria-label={info.caption}>
      <figure className="max-w-3xl mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element -- statisches PNG, feste Maße */}
        <img
          src={`/seiten-bilder/${slug}.png`}
          alt={info.alt}
          width={1200}
          height={630}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl border border-black/[0.08] shadow-sm bg-[#F4F5F7]"
        />
        <figcaption className="mt-2 text-center text-xs sm:text-sm text-black/55">{info.caption}</figcaption>
      </figure>
    </section>
  );
}
