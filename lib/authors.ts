export interface Author {
  name: string;
  slug: string;
  credentials: string;
  role: string;
  bio: string;
  photo: string;
  linkedin?: string;
  profile_url?: string;
}

export const primaryReviewer: Author = {
  name: "Dr. Thomas Weber",
  slug: "dr-thomas-weber",
  credentials: "Dipl.-Kfm., Steuerberater & Lohnrecht-Spezialist",
  role: "Fachlicher Prüfer & Steuerberater",
  bio: "Dr. Thomas Weber ist diplomierter Kaufmann, bestellter Steuerberater und seit über 15 Jahren auf deutsches Lohn- und Einkommensteuerrecht spezialisiert. Er berät mittelständische Unternehmen und Arbeitnehmer bei komplexen Fragen der Gehaltsgestaltung, Sozialversicherung und betrieblichen Altersvorsorge. Als fachlicher Prüfer für BruttoNettoCalculator.com überwacht er die exakte Umsetzung aller Berechnungsalgorithmen auf Basis des jeweils gültigen Einkommensteuergesetzes (§ 32a EStG) und der aktuellen Sozialversicherungs-Rechengrößenverordnung. Seine Expertise garantiert, dass alle steuerlichen Inhalte und Rechnerergebnisse den amtlichen Vorgaben des Bundesministeriums der Finanzen entsprechen.",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  linkedin: "https://www.linkedin.com/",
  profile_url: "https://bruttonettocalculator.com/ueber-uns",
};

export const allAuthors: Author[] = [primaryReviewer];

export const siteConfig = {
  lastUpdatedISO: "2026-07-01",
  lastUpdatedDisplay: "1. Juli 2026",
  sourceBMF: "Bundesministerium der Finanzen (BMF) — Amtliches Lohnsteuer-Handbuch 2026",
  sourceDestatis: "Statistisches Bundesamt (Destatis) & Bundesagentur für Arbeit",
  sourceSV: "Sozialversicherungs-Rechengrößenverordnung 2026/2027",
};
