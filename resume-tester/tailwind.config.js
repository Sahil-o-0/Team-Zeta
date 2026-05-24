/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'primary-hover': '#4338ca',
        surface: '#1e1e24',
        background: '#121214',
      }
    },
  },
  plugins: [],
}
