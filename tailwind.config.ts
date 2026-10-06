import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul Marinho Profundo — base institucional (header, footer, títulos)
        marinho: {
          DEFAULT: "#0B3954",
          50: "#EAF1F4",
          100: "#CBDCE3",
          700: "#0B3954",
          900: "#072433",
        },
        // Azul Turquesa/Ciano — CTAs, links, ícones, energia jovem
        turquesa: {
          DEFAULT: "#00A8E8",
          50: "#E6F7FF",
          100: "#CCEFFF",
          500: "#00A8E8",
          600: "#0090C7",
        },
        // Laranja Pôr do Sol — accent (badges, sublinhados, divisores)
        pordosol: {
          DEFAULT: "#FF6F59",
          100: "#FFE2DC",
          500: "#FF6F59",
          600: "#E85339",
        },
        // Areia Claro / Off-White — fundo principal
        areia: {
          DEFAULT: "#F9F8F6",
          50: "#F9F8F6",
        },
        // Cinza Chumbo — tipografia
        chumbo: {
          DEFAULT: "#2B2D42",
          600: "#2B2D42",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
