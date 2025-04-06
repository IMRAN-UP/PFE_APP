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
        primary: '#8F26EC',
        'primary-light': '#A14FF0',
        'primary-dark': '#7B1FD1',
        secondary: '#10B981',
        'secondary-light': '#34D399',
        'secondary-dark': '#059669',
      },
    },
  },
  plugins: [],
} 