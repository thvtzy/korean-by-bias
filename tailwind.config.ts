import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FAF5F0",
          elevated: "#FFFFFF",
          surface: "rgba(255,255,255,0.85)",
        },
        accent: {
          pink: "#FF8FAB",
          lavender: "#C4B5FD",
          sky: "#93C5FD",
          mint: "#86EFAC",
          coral: "#FDA4AF",
        },
        border: {
          subtle: "rgba(0,0,0,0.06)",
          soft: "rgba(0,0,0,0.10)",
          accent: "rgba(255,143,171,0.4)",
        },
        text: {
          primary: "#2D1B2E",
          secondary: "#6B5B6E",
          muted: "#A497A6",
          inverse: "#FFFFFF",
        },
        sleeve: {
          song: "#FFD6E0",
          drama: "#E0D6FF",
          live: "#D6F0FF",
          other: "#D6FFE8",
        },
        holo: {
          pink: "#FF8FAB",
          blue: "#93C5FD",
          gold: "#FDE68A",
          green: "#86EFAC",
        },
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "sans-serif"],
        display: ["Fredoka", "Nunito", "system-ui", "sans-serif"],
        kr: ["Gamja Flower", "Nunito", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        card: "16px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(255,143,171,0.12)",
        "card-hover": "0 8px 24px rgba(255,143,171,0.18)",
        soft: "0 2px 8px rgba(0,0,0,0.04)",
        "soft-lg": "0 8px 32px rgba(0,0,0,0.06)",
      },
      animation: {
        "holo-sweep": "holoSweep 3s ease-in-out infinite",
        "pop-in": "popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease-out",
        "shimmer": "shimmer 2s infinite",
        "float": "float 4s ease-in-out infinite",
        "wiggle": "wiggle 0.3s ease-in-out",
      },
      keyframes: {
        holoSweep: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(16px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
