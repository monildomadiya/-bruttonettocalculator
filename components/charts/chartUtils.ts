/**
 * Minimale Hilfsmittel für die SVG-Diagramme unter `components/charts/`.
 *
 * Bewusst ohne Diagramm-Bibliothek: die Diagramme dieser Seite zeigen jeweils
 * eine einzige, aus der Rechen-Engine abgeleitete Kurve. Eine Bibliothek wie
 * Recharts würde dafür ~90 kB JavaScript in den Client laden und die Grafik
 * erst dort erzeugen — sie stünde damit weder im ausgelieferten HTML noch für
 * Crawler oder Screenreader zur Verfügung. Die Diagramme sind stattdessen
 * Server-Komponenten: das fertige SVG steht im HTML, kostet kein JavaScript
 * und verursacht keinen Layout-Shift.
 */

/** Ein Punkt in Datenkoordinaten. */
export interface Punkt {
  x: number;
  y: number;
}

/** Lineare Skala von Datenwerten auf Pixel. */
export function skala(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const spanne = d1 - d0 || 1;
  return (wert: number) => r0 + ((wert - d0) / spanne) * (r1 - r0);
}

/**
 * Baut ein SVG-`path`-`d`-Attribut aus Punkten in Pixelkoordinaten.
 * Bewusst geradlinig (`L`) statt interpoliert: die Tarifkurven haben echte
 * Knicke an den Tarifecken, eine Glättung würde sie wegrunden und damit die
 * Aussage des Diagramms verfälschen.
 */
export function linie(punkte: Punkt[]): string {
  return punkte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

/** Schließt eine Linie zu einer Fläche gegen eine waagerechte Grundlinie. */
export function flaeche(punkte: Punkt[], grundlinieY: number): string {
  if (punkte.length === 0) return "";
  const ersteX = punkte[0].x.toFixed(2);
  const letzteX = punkte[punkte.length - 1].x.toFixed(2);
  return `${linie(punkte)} L${letzteX},${grundlinieY.toFixed(2)} L${ersteX},${grundlinieY.toFixed(2)} Z`;
}

/** Achsenbeschriftung: „45.000“ bzw. „45k“ für knappe Achsen. */
export function kurzEuro(wert: number): string {
  if (Math.abs(wert) >= 1000) return `${Math.round(wert / 1000)}k`;
  return String(Math.round(wert));
}

export function euro(wert: number, nachkomma = 2): string {
  return wert.toLocaleString("de-DE", {
    minimumFractionDigits: nachkomma,
    maximumFractionDigits: nachkomma,
  });
}

export function prozent(wert: number, nachkomma = 1): string {
  return `${wert.toLocaleString("de-DE", {
    minimumFractionDigits: nachkomma,
    maximumFractionDigits: nachkomma,
  })} %`;
}
