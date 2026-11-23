import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Preto profundo — base da marca (logo e fotos noturnas)
        ink: {
          DEFAULT: "#0A0A0B",
          950: "#070708",
          900: "#0A0A0B",
          800: "#111114",
          700: "#1A1A1E",
          600: "#26262B",
          500: "#3A3A40",
        },
        // Laranja pôr do sol — cor de energia do projeto
        sun: {
          DEFAULT: "#FF6B18",
          300: "#FFB27A",
          400: "#FF8C42",
          500: "#FF6B18",
          600: "#E85400",
          700: "#B33D00",
        },
        // Areia / off-white — respiro entre blocos escuros
        cream: {
          DEFAULT: "#F6F0E6",
          50: "#FBF8F2",
          100: "#F6F0E6",
          200: "#EBE1D1",
        },
        sand: "#D8C6AE",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "Haettenschweiler", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(255, 107, 24, 0.55)",
        card: "0 24px 50px -30px rgba(10, 10, 11, 0.45)",
      },
      backgroundImage: {
        sunset: "linear-gradient(120deg, #FFB020 0%, #FF6B18 42%, #B33D00 100%)",
        "sunset-soft": "linear-gradient(120deg, #FF8C42 0%, #FF6B18 100%)",
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        float: "float 7s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
