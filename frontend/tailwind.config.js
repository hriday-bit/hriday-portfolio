/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: { glow: "0 12px 50px rgb(99 102 241 / 0.22)" },
      fontFamily: { display: ["Playfair Display", "Georgia", "serif"], body: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
