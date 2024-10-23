/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixelfont: ['Pixel', 'sans-serif'],
        pix: ['Pix', 'sans-serif'],
        mine: ['Mine', 'sans-serif'], // Добавляем кастомный шрифт
      },
    },
  },
  plugins: [],
}