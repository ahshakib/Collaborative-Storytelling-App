/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
          black: '#202124',
          white: '#FFFFFF',
          'off-white': '#F8F9FA',
          'dark-gray': '#3C4043',
        },
        // Keeping legacy palettes mapping to neo variants where appropriate or leaving them if used extensively, 
        // but for a strict redesign we prefer using neo-* classes. 
        // We'll map primary/secondary to neo colors to auto-update existing components partially.
        primary: {
          50: '#E8F0FE',
          100: '#D2E3FC',
          200: '#AECBFA',
          300: '#8AB4F8',
          400: '#669DF6',
          500: '#4285F4', // Match neo-blue
          600: '#1A73E8',
          700: '#1967D2',
          800: '#185ABC',
          900: '#174EA6',
        },
        secondary: {
          50: '#FCE8E6',
          100: '#FAD2CF',
          200: '#F6AEA9',
          300: '#F28B82',
          400: '#EE675C',
          500: '#EA4335', // Match neo-red
          600: '#D93025',
          700: '#C5221F',
          800: '#B31412',
          900: '#A50E0E',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'], // Space Grotesk is great for Neobrutalism, falling back to Inter
        display: ['"Lexend Mega"', 'sans-serif'], // Fun display font
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #202124',
        'neo-sm': '2px 2px 0px 0px #202124',
        'neo-lg': '6px 6px 0px 0px #202124',
        'neo-xl': '8px 8px 0px 0px #202124',
        'neo-white': '4px 4px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
      },
      translate: {
        'box': '4px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};