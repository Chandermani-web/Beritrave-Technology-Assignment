/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        panel: '#111827',
        accent: '#38bdf8',
        accentSoft: '#0ea5e9',
      },
      boxShadow: {
        glow: '0 25px 80px rgba(14, 165, 233, 0.25)',
      },
      backgroundImage: {
        'app-radial':
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.24), transparent 32%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.2), transparent 24%), linear-gradient(180deg, #020617 0%, #0f172a 46%, #111827 100%)',
      },
    },
  },
  plugins: [],
};