import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Brutto Netto Rechner 2026",
  description: "Informationen zum Datenschutz, zur Verarbeitung personenbezogener Daten und zu Ihren Rechten auf BruttoNettoCalculator.com.",
  alternates: { canonical: "https://bruttonettocalculator.com/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <ShieldAlert size={14} /> DSGVO-Konform
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Datenschutz<span className="text-gradient-accent">erklärung</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 w-full max-w-6xl leading-relaxed">
          Schutz und Vertraulichkeit Ihrer persönlichen Daten stehen bei uns an oberster Stelle.
        </p>
      </div>

      <div className="bg-[#101010] border border-white/15 rounded-3xl p-8 sm:p-12 text-white/80 leading-relaxed space-y-8 shadow-xl w-full max-w-6xl">
        <div className="bg-[#121212] border border-[#E60A1C]/30 rounded-2xl p-6 text-sm text-white/90">
          <strong className="text-[#E60A1C]">Hinweis:</strong> Alle Berechnungen in unserem Brutto-Netto-Rechner erfolgen
          100% anonym, lokal auf Ihrem Endgerät und ohne Speicherung sensibler Gehaltsdaten auf externen Servern.
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">1. Verantwortlicher</h2>
          <p className="text-white/70">
            BruttoNettoCalculator.com<br />
            E-Mail: info@bruttonettocalculator.com
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">
            2. Verarbeitung beim Aufruf der Website
          </h2>
          <p className="text-white/70">
            Beim Besuch dieser Website erhebt unser Hosting-Anbieter
            automatisch technische Daten (u. a. IP-Adresse, Datum und
            Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp) in
            Server-Logfiles. Dies ist zum technischen Betrieb der Website
            erforderlich (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">3. Der Gehaltsrechner</h2>
          <p className="text-white/70">
            Die von Ihnen im Rechner eingegebenen Werte (z. B. Bruttogehalt, Steuerklasse, Kinderfreibetrag)
            werden ausschließlich lokal und flüchtig im Speicher Ihres Browsers verarbeitet. Es erfolgt keine
            Übertragung oder Speicherung Ihrer Gehaltsangaben auf unseren Systemen.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">
            4. Cookies und Analyse-Tools
          </h2>
          <p className="text-white/70">
            Diese Website setzt standardmäßig keine unnötigen Tracking- oder Werbe-Cookies ein. Zur Analyse
            der Serverauslastung und Optimierung des Rechners werden rein anonymisierte Aufrufstatistiken ausgewertet.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-white text-xl mb-3">5. Ihre Rechte</h2>
          <p className="text-white/70">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch gemäß Art. 15–21 DSGVO sowie das Recht auf Beschwerde
            bei einer zuständigen Datenschutz-Aufsichtsbehörde.
          </p>
        </div>
      </div>
    </section>
  );
}
