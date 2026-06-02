/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 35px rgba(6, 10, 20, 0.12)',
        glow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 25px 60px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        xl: '20px',
      },
    },
  },
  plugins: [],
}
