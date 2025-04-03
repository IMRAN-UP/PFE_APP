/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-light': '#6366F1',
        'primary-dark': '#4338CA',
        secondary: '#10B981',
        'secondary-light': '#34D399',
        'secondary-dark': '#059669',
      },
    },
  },
  plugins: [],
} 