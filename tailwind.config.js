/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this if your project uses different file extensions
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans'", "sans-serif"],
        quintessential: ["'Quintessential'", "cursive"],
        youngSerif: ["'Young Serif'", "serif"],
      },
      colors: {
        headerBg: "rgb(166, 188, 217)",
      },
    },
  },
  plugins: [],
};
