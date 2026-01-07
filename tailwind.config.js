/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#1FA971",
        "electric-blue": "#2BB0E6",
        "warning": "#F4B740",
        "critical": "#E24A4A",
        "background-light": "#F7F9FC",
        "background-dark": "#12201a",
        "glass-border": "rgba(255,255,255,0.45)",
        "glass-fill": "rgba(255,255,255,0.65)",
      },
      fontFamily: {
        "sans": ["Montserrat", "sans-serif"],
        "display": ["Montserrat", "sans-serif"],
        "technical": ["Montserrat", "sans-serif"],
        "body-tech": ["Montserrat", "sans-serif"],
        "mono": ["Montserrat", "monospace"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 169, 113, 0.05)',
        'glass-hover': '0 12px 40px 0 rgba(31, 169, 113, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
