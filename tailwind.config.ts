import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#16181D",
        petrol: {
          DEFAULT: "#16181D",
          light: "#3A3F47",
          dark: "#0B0C0F",
          50:  "#F7F8FA",
          100: "#F1F3F5",
          200: "#E4E7EB",
          300: "#C7CCD3",
          400: "#9AA1AB",
          500: "#6B7280",
        },
        // Primary accent — #E60A1C red
        accent: {
          DEFAULT: "#E60A1C",
          light:   "#FF2436",
          dark:    "#B5081A",
          50:      "#FDECEE",
          100:     "#FBD5D9",
          200:     "#F5A6AE",
          300:     "#EF6B78",
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
          50:      "#FDECEE",
          100:     "#FBD5D9",
        },
        netto: {
          DEFAULT: "#0E9F6E",
          light: "#12B981",
          dark: "#0A7D57",
        },
        abzug: {
          DEFAULT: "#E60A1C",
          light: "#FF2436",
          dark: "#B5081A",
        },
        sv: {
          DEFAULT: "#6B7280",
          light: "#9AA1AB",
        },
        line: "#E4E7EB",
        muted: "#6B7280",
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#F1F3F5",
          sunken: "#ECEEF1",
        },
        success: "#0E9F6E",
        danger:  "#E60A1C",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grain":      "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
        "hero-mesh":  "radial-gradient(ellipse 80% 60% at 50% -10%, #FDECEE 0%, #F4F5F7 60%, #F4F5F7 100%)",
        "accent-shine": "linear-gradient(135deg, #E60A1C 0%, #FF2436 50%, #E60A1C 100%)",
        "card-glow":  "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(230,10,28,0.06) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grain": "3px 3px",
      },
      boxShadow: {
        // Softened default scale — flatter, subtle depth (was Tailwind's heavy defaults).
        "sm":    "0 1px 2px rgba(16,24,40,0.04)",
        "DEFAULT": "0 1px 3px rgba(16,24,40,0.05)",
        "md":    "0 2px 6px rgba(16,24,40,0.05)",
        "lg":    "0 4px 12px rgba(16,24,40,0.06)",
        "xl":    "0 6px 16px rgba(16,24,40,0.06)",
        "2xl":   "0 10px 24px rgba(16,24,40,0.07)",
        // Named tokens (kept, lightly toned down).
        "card":    "0 0 0 1px rgba(16,24,40,0.05), 0 2px 8px rgba(16,24,40,0.05)",
        "card-lg": "0 0 0 1px rgba(16,24,40,0.05), 0 6px 18px rgba(16,24,40,0.07)",
        "float":   "0 0 0 1px rgba(16,24,40,0.05), 0 10px 28px rgba(16,24,40,0.08)",
        "accent":  "0 0 0 3px rgba(230,10,28,0.18)",
        "inset-petrol": "inset 0 1px 3px rgba(16,24,40,0.08)",
        "netto":   "0 4px 14px rgba(14,159,110,0.12)",
        "glow-accent": "0 4px 14px rgba(230,10,28,0.18)",
        "glow-petrol": "0 4px 14px rgba(16,24,40,0.08)",
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
