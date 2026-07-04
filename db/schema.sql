-- BruttoNettoCalculator.com — MySQL schema
-- Zweck: Steuer- und Sozialversicherungsparameter versioniert je Jahr
-- speichern, damit neue Jahre ohne Code-Deploy gepflegt werden können.
-- Aktuell nutzt lib/taxCalculator.ts noch fest kodierte 2026-Werte;
-- dies ist die Zieltabelle für die Migration auf DB-gestützte Werte.

CREATE TABLE IF NOT EXISTS tax_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jahr SMALLINT NOT NULL UNIQUE,

  -- § 32a EStG Tarifzonen
  grundfreibetrag DECIMAL(10,2) NOT NULL,
  zone2_bis DECIMAL(10,2) NOT NULL,
  zone3_bis DECIMAL(10,2) NOT NULL,
  zone4_bis DECIMAL(10,2) NOT NULL,
  zone2_koeff_a DECIMAL(10,4) NOT NULL,
  zone2_koeff_b DECIMAL(10,4) NOT NULL,
  zone3_koeff_a DECIMAL(10,4) NOT NULL,
  zone3_koeff_b DECIMAL(10,4) NOT NULL,
  zone3_konstante DECIMAL(10,4) NOT NULL,
  zone4_satz DECIMAL(6,4) NOT NULL,
  zone4_abzug DECIMAL(10,4) NOT NULL,
  zone5_satz DECIMAL(6,4) NOT NULL,
  zone5_abzug DECIMAL(10,4) NOT NULL,

  -- Soli
  soli_freigrenze_single DECIMAL(10,2) NOT NULL,
  soli_freigrenze_verheiratet DECIMAL(10,2) NOT NULL,
  soli_satz DECIMAL(5,4) NOT NULL DEFAULT 0.0550,

  -- Sozialversicherung
  kv_pv_bbg_jahr DECIMAL(10,2) NOT NULL,
  rv_alv_bbg_jahr DECIMAL(10,2) NOT NULL,
  kv_satz DECIMAL(5,4) NOT NULL,
  kv_zusatzbeitrag_durchschnitt DECIMAL(5,4) NOT NULL,
  pv_satz_basis DECIMAL(5,4) NOT NULL,
  pv_zuschlag_kinderlos DECIMAL(5,4) NOT NULL,
  rv_satz DECIMAL(5,4) NOT NULL,
  alv_satz DECIMAL(5,4) NOT NULL,

  werbungskosten_pauschale DECIMAL(8,2) NOT NULL,
  sonderausgaben_pauschale DECIMAL(8,2) NOT NULL,

  ist_final BOOLEAN NOT NULL DEFAULT FALSE, -- FALSE = vorläufig/Platzhalter (z.B. 2027 vor Gesetzesbeschluss)
  quelle VARCHAR(255) NOT NULL,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed: 2026 (amtlich, BMF LStH 2026 § 32a; SV-Rechengrößen-VO 2026)
INSERT INTO tax_rules (
  jahr, grundfreibetrag, zone2_bis, zone3_bis, zone4_bis,
  zone2_koeff_a, zone2_koeff_b, zone3_koeff_a, zone3_koeff_b, zone3_konstante,
  zone4_satz, zone4_abzug, zone5_satz, zone5_abzug,
  soli_freigrenze_single, soli_freigrenze_verheiratet, soli_satz,
  kv_pv_bbg_jahr, rv_alv_bbg_jahr, kv_satz, kv_zusatzbeitrag_durchschnitt,
  pv_satz_basis, pv_zuschlag_kinderlos, rv_satz, alv_satz,
  werbungskosten_pauschale, sonderausgaben_pauschale,
  ist_final, quelle
) VALUES (
  2026, 12348.00, 17799.00, 69878.00, 277825.00,
  914.51, 1400.00, 173.10, 2397.00, 1034.87,
  0.4200, 11135.63, 0.4500, 19470.38,
  18130.00, 36260.00, 0.0550,
  69750.00, 101400.00, 0.1460, 0.0290,
  0.0360, 0.0060, 0.1860, 0.0260,
  1230.00, 36.00,
  TRUE, 'BMF Amtliches Lohnsteuer-Handbuch LStH 2026, § 32a EStG; Sozialversicherungsrechengrößen-Verordnung 2026'
);
