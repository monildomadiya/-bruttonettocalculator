import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#000000",
        ink: "#FFFFFF",
        petrol: {
          DEFAULT: "#FFFFFF",
          light: "#EAEAEA",
          dark: "#FFFFFF",
          50:  "#141414",
          100: "#1F1F1F",
          200: "#333333",
          300: "#555555",
          400: "#888888",
          500: "#FFFFFF",
        },
        // Primary accent — #E60A1C red
        accent: {
          DEFAULT: "#E60A1C",
          light:   "#FF2436",
          dark:    "#B5081A",
          50:      "#1F0A0C",
          100:     "#3A0E13",
          200:     "#6B141C",
          300:     "#9C1924",
          400:     "#FF2436",
          500:     "#E60A1C",
          600:     "#B5081A",
          700:     "#8A0614",
          800:     "#5E040D",
        },
        gold: {
          DEFAULT: "#E60A1C",
          light:   "#FF2436",
          dark:    "#B5081A",
          50:      "#1F0A0C",
          100:     "#3A0E13",
        },
        netto: {
          DEFAULT: "#FFFFFF",
          light: "#FFFFFF",
          dark: "#DDDDDD",
        },
        abzug: {
          DEFAULT: "#E60A1C",
          light: "#FF2436",
          dark: "#B5081A",
        },
        sv: {
          DEFAULT: "#A0A0A0",
          light: "#C0C0C0",
        },
        line: "#262626",
        muted: "#A0A0A0",
        surface: {
          DEFAULT: "#0D0D0D",
          raised: "#141414",
          sunken: "#050505",
        },
        success: "#FFFFFF",
        danger:  "#E60A1C",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grain":      "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        "hero-mesh":  "radial-gradient(ellipse 80% 60% at 50% -10%, #1A0507 0%, #000000 60%, #000000 100%)",
        "accent-shine": "linear-gradient(135deg, #E60A1C 0%, #FF2436 50%, #E60A1C 100%)",
        "card-glow":  "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(230,10,28,0.12) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grain": "3px 3px",
      },
      boxShadow: {
        "card":    "0 0 0 1px rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.8)",
        "card-lg": "0 0 0 1px rgba(255,255,255,0.15), 0 16px 48px rgba(0,0,0,0.9)",
        "float":   "0 0 0 1px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.95)",
        "accent":  "0 0 0 3px rgba(230,10,28,0.35)",
        "inset-petrol": "inset 0 1px 3px rgba(0,0,0,0.50)",
        "netto":   "0 0 25px rgba(255,255,255,0.2)",
        "glow-accent": "0 0 35px rgba(230,10,28,0.4)",
        "glow-petrol": "0 0 35px rgba(255,255,255,0.15)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "slide-down": "slideDown 0.3s cubic-bezier(0.4,0,0.2,1) both",
        "count-up":   "countUp 0.4s ease both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":    "shimmer 1.6s linear infinite",
        "spin-slow":  "spin 8s linear infinite",
        "bounce-sm":  "bounceSm 1s ease infinite",
        "mesh-move":  "meshMove 12s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%":   { opacity: "0", maxHeight: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", maxHeight: "600px", transform: "translateY(0)" },
        },
        countUp: {
          "0%":   { opacity: "0.4", transform: "scale(0.97) translateY(4px)" },
          "100%": { opacity: "1",   transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        bounceSm: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
        meshMove: {
          "0%":   { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
