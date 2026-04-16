/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slop: {
          bg: "#0F0F1A",
          surface: "#1A1A2E",
          purple: "#8B5CF6",
          pink: "#EC4899",
          cyan: "#22D3EE",
          yellow: "#FACC15",
          green: "#34D399",
          orange: "#FB923C",
        },
      },
      fontFamily: {
        comic: ['"Comic Sans MS"', '"Comic Sans"', "cursive"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        marquee: "marquee 30s linear infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-crazy": "bounce-crazy 0.6s ease-in-out",
        typewriter: "typewriter 2s steps(40) forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139,92,246,0.5)" },
          "50%": { boxShadow: "0 0 60px rgba(236,72,153,0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px) rotate(-1deg)" },
          "75%": { transform: "translateX(5px) rotate(1deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "bounce-crazy": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.3) rotate(5deg)" },
          "50%": { transform: "scale(0.9) rotate(-3deg)" },
          "75%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
    },
  },
  plugins: [],
};
