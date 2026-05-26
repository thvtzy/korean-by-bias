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
          DEFAULT: "#0a0a0f",
          elevated: "#111118",
          surface: "rgba(255,255,255,0.03)",
        },
        accent: {
          pink: "#ff4d8d",
          purple: "#a855f7",
          gradient: "linear-gradient(135deg, #ff4d8d, #a855f7)",
        },
        border: {
          glass: "rgba(255,255,255,0.06)",
          strong: "rgba(255,255,255,0.12)",
          accent: "rgba(255,77,141,0.3)",
        },
        neo: {
          black: "#0a0a0f",
          yellow: "#ffd700",
          pink: "#ff4d8d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Clash Display", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        glass: "16px",
        neo: "8px",
      },
      backdropBlur: {
        glass: "blur(24px)",
      },
      boxShadow: {
        neo: "4px 4px 0px #0a0a0f",
        "neo-sm": "2px 2px 0px #0a0a0f",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.3)",
        glow: "0 0 40px rgba(255,77,141,0.15)",
        "glow-strong": "0 0 60px rgba(168,85,247,0.2)",
      },
      animation: {
        "card-in": "cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        cardIn: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
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
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
