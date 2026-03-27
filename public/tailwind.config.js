// FILE: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // covers app/, pages/, components/, etc.
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
