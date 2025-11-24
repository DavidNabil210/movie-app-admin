/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}" 
  ],
  theme: {
    extend: {
      colors: {
        imdb: {
          yellow: '#F5C518',
          bg: '#121212',
          card: '#1E1E1E',
          text: '#FFFFFF',
          textSecondary: '#B3B3B3',
          border: '#2A2A2A',
        },
      },
    },
  },
  plugins: [],
}
