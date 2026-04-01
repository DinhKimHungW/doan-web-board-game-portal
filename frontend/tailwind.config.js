/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
        game: { bg: '#1e293b', cell: '#334155', active: '#6366f1', hover: '#475569' }
      }
    }
  },
  plugins: []
}
