/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      keyframes: {
      customSpin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    },
    animation: {
      customSpin: 'customSpin 20s linear infinite'  
    }},
  },
  plugins: [],
}

