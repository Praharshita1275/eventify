/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files
    "./public/index.html",        // Include HTML file if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo
        secondary: "#22D3EE", // Cyan
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
