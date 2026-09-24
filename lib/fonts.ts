import { Inter, Outfit, JetBrains_Mono } from "next/font/google";

/**
 * Schriften über next/font statt per `@import` von fonts.googleapis.com.
 *
 * Der frühere `@import` in globals.css war eine render-blockierende Kette:
 * HTML → eigenes CSS → Google-CSS → Schriftdateien, dazu zwei fremde Hosts
 * (DNS + TLS). next/font lädt die Dateien zur Buildzeit herunter, liefert sie
 * von der eigenen Domain aus, setzt Preload-Links und erzeugt eine metrisch
 * angepasste Fallback-Schrift — kein Layout-Shift beim Schrift-Tausch, kein
 * Request an Google (auch datenschutzrechtlich sauberer).
 *
 * Alle drei sind variable Schriften: eine Datei je Familie deckt alle
 * Schriftstärken ab. Die CSS-Variablen tragen dieselben Namen wie die früheren
 * Design-Tokens, sodass globals.css und tailwind.config.ts sie direkt nutzen.
 */
export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const fontDisplay = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

/** Auf <html> setzen — definiert die drei CSS-Variablen für die ganze Seite. */
export const fontVariables = `${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`;
