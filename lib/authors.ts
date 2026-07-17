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

// Content is produced and maintained by the site's editorial team, not a single
// named individual. A previous version credited a "Dr. Thomas Weber" with a
// stock photo and unverifiable credentials — that fabricated persona was removed
// to keep the E-E-A-T signals honest (no invented author, no fake reviewer).
// If a real, named professional reviews the content in future, replace the
// fields below with their genuine name, credentials and photo.
export const primaryReviewer: Author = {
  name: "Redaktion BruttoNettoCalculator",
  slug: "redaktion",
  credentials: "Fachredaktion für Lohn- & Steuerthemen",
  role: "Redaktion & fachliche Prüfung",
  bio: "Die Redaktion von BruttoNettoCalculator.com erstellt und pflegt alle Rechner und Ratgeber auf Basis der amtlichen Vorgaben — insbesondere des Einkommensteuergesetzes (§ 32a EStG) und der jeweils gültigen Sozialversicherungs-Rechengrößenverordnung. Steuerliche Inhalte werden regelmäßig anhand der offiziellen Veröffentlichungen des Bundesministeriums der Finanzen (BMF) und des Bundesministeriums für Arbeit und Soziales (BMAS) überprüft und aktualisiert. Die Inhalte dienen der Information und ersetzen keine individuelle Steuerberatung.",
  photo: "",
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
