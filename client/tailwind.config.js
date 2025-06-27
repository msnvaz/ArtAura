
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // <- very important!
  ],
  theme: {
    extend: {
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out forwards',
          'pulse-soft': 'pulse 2.5s ease-in-out infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    pulseSoft: {
        '0%, 100%': { transform: 'scale(1)', opacity: 1 },
        '50%': { transform: 'scale(1.03)', opacity: 0.95 },
    },
    },
  },
  plugins: [],
}



