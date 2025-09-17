/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        game: {
          bg: "#1a1a2e",
          card: "#16213e",
          accent: "#0f3460",
          text: "#e94560",
        },
      },
    },
  },
  plugins: [],
  safelist: ["bg-game-bg", "bg-game-card", "bg-game-accent", "text-game-text"],
};
