import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Brutto Netto Rechner 2026",
  description: "Informationen zum Datenschutz, zur Verarbeitung personenbezogener Daten, zu Cookies, Google Analytics, Google AdSense und zu Ihren Rechten auf BruttoNettoCalculator.com.",
  alternates: { canonical: "https://bruttonettocalculator.com/datenschutz" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Datenschutzerklärung | BruttoNettoCalculator.com",
    description: "Datenschutz, Cookies, Google Analytics & Google AdSense gem. DSGVO auf BruttoNettoCalculator.com.",
    url: "https://bruttonettocalculator.com/datenschutz",
    locale: "de_DE",
    type: "website",
  },
};

export default function DatenschutzPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <ShieldAlert size={14} /> DSGVO-Konform
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Datenschutz<span className="text-gradient-accent">erklärung</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Schutz und Vertraulichkeit Ihrer persönlichen Daten stehen bei uns an oberster Stelle.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-12 text-black/80 leading-relaxed space-y-8 shadow-xl w-full max-w-6xl">
        <div className="bg-[#FFFFFF] border border-[#E60A1C]/30 rounded-2xl p-6 text-sm text-black/90">
          <strong className="text-[#E60A1C]">Hinweis:</strong> Alle Gehaltsberechnungen in unserem Brutto-Netto-Rechner erfolgen
          100% anonym, lokal auf Ihrem Endgerät und ohne Speicherung Ihrer sensiblen Gehaltsdaten auf externen Servern.
          Zur Finanzierung des kostenlosen Angebots und zur Reichweitenmessung setzen wir jedoch – nur mit Ihrer
          Einwilligung – Cookies von Google Analytics und Google AdSense ein. Details finden Sie nachstehend.
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">1. Verantwortlicher</h2>
          <p className="text-black/70">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist der im{" "}
            <a href="/impressum" className="text-[#E60A1C] font-semibold hover:underline">Impressum</a>{" "}
            genannte Anbieter.<br />
            BruttoNettoCalculator.com<br />
            E-Mail: info@bruttonettocalculator.com
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
            2. Verarbeitung beim Aufruf der Website (Server-Logfiles)
          </h2>
          <p className="text-black/70">
            Beim Besuch dieser Website erhebt unser Hosting-Anbieter automatisch technische Daten
            (u. a. gekürzte IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer,
            Browsertyp und Betriebssystem) in Server-Logfiles. Dies ist zum sicheren und stabilen
            technischen Betrieb der Website erforderlich und beruht auf unserem berechtigten Interesse
            (Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden nach kurzer Zeit automatisch gelöscht.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">3. Der Gehaltsrechner</h2>
          <p className="text-black/70">
            Die von Ihnen im Rechner eingegebenen Werte (z. B. Bruttogehalt, Steuerklasse, Kinderfreibetrag)
            werden ausschließlich lokal und flüchtig im Speicher Ihres Browsers verarbeitet. Es erfolgt keine
            Übertragung oder Speicherung Ihrer Gehaltsangaben auf unseren Systemen.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
            4. Cookies und Einwilligung (Consent)
          </h2>
          <p className="text-black/70 mb-3">
            Technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind, setzen wir auf
            Grundlage von Art. 6 Abs. 1 lit. f DSGVO bzw. § 25 Abs. 2 TDDDG ein. Darüber hinaus setzen wir
            Cookies und vergleichbare Technologien für <strong className="text-[#16181D]">Statistik/Reichweitenmessung
            (Google Analytics)</strong> und <strong className="text-[#16181D]">Werbung (Google AdSense)</strong> ein.
          </p>
          <p className="text-black/70">
            Diese nicht notwendigen Cookies werden nur mit Ihrer ausdrücklichen Einwilligung gemäß
            § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO gesetzt, die Sie über unseren Cookie-Hinweis
            (Consent-Banner) erteilen. Ihre Einwilligung ist freiwillig und kann jederzeit mit Wirkung
            für die Zukunft widerrufen werden.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
            5. Google Analytics
          </h2>
          <p className="text-black/70 mb-3">
            Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited
            (Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics verwendet Cookies, um die
            Nutzung der Website statistisch auszuwerten. Die IP-Adresse wird dabei gekürzt bzw. anonymisiert
            verarbeitet. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
          </p>
          <p className="text-black/70">
            Dabei können Daten auch an Server von Google in den USA übertragen werden. Sie können der Erfassung
            durch Google Analytics widersprechen, indem Sie das Browser-Add-on unter{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">tools.google.com/dlpage/gaoptout</a>{" "}
            installieren oder Ihre Einwilligung über den Cookie-Hinweis widerrufen. Weitere Informationen finden
            Sie in der{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">Datenschutzerklärung von Google</a>.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">
            6. Google AdSense (Werbung)
          </h2>
          <p className="text-black/70 mb-3">
            Zur Finanzierung dieses kostenlosen Angebots binden wir Werbeanzeigen über Google AdSense ein,
            einen Dienst der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland).
            Google und dessen Partner verwenden Cookies bzw. vergleichbare Technologien (z. B. Web Beacons),
            um Anzeigen auszuliefern, deren Auslieferung zu messen und – bei entsprechender Einwilligung –
            personalisierte Werbung auf Basis früherer Besuche auf dieser und anderen Websites anzuzeigen.
          </p>
          <p className="text-black/70 mb-3">
            Rechtsgrundlage für den Einsatz von Werbe-Cookies ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO,
            § 25 Abs. 1 TDDDG). Ohne Einwilligung werden Ihnen ggf. nur nicht personalisierte Anzeigen ausgespielt.
            Im Rahmen der Anzeigenauslieferung können Daten (u. a. Ihre IP-Adresse und Cookie-Kennungen) an Google
            und in Drittländer wie die USA übertragen werden.
          </p>
          <p className="text-black/70">
            Sie können personalisierte Werbung jederzeit deaktivieren bzw. verwalten:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-black/70">
            <li>
              Google-Werbeeinstellungen:{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">adssettings.google.com</a>
            </li>
            <li>
              Opt-out von Drittanbietern:{" "}
              <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">aboutads.info/choices</a>{" "}
              &{" "}
              <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">youronlinechoices.eu</a>
            </li>
            <li>
              Datenschutz &amp; Cookies bei Google:{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] font-semibold hover:underline">policies.google.com/technologies/ads</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">7. Ihre Rechte</h2>
          <p className="text-black/70">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch gemäß Art. 15–21 DSGVO sowie das Recht, eine erteilte
            Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen
            (Art. 7 Abs. 3 DSGVO). Ferner steht Ihnen ein Beschwerderecht bei
            einer zuständigen Datenschutz-Aufsichtsbehörde zu.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-[#16181D] text-xl mb-3">8. Kontakt in Datenschutzfragen</h2>
          <p className="text-black/70">
            Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte erreichen Sie uns unter:
            info@bruttonettocalculator.com
          </p>
        </div>

        <p className="text-xs text-black/40 pt-4 border-t border-black/[0.08]">
          Stand dieser Datenschutzerklärung: Juli 2026.
        </p>
      </div>
    </section>
  );
}
