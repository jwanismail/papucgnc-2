/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4dc',
          300: '#d4cdc1',
          400: '#b5aa99',
          500: '#8e8070',
          600: '#6b5d4f',
          700: '#4a3f35',
          800: '#362e26',
          900: '#1f1b16',
        },
        accent: {
          50: '#fef8f1',
          100: '#fdefd9',
          200: '#fbddb3',
          300: '#f7c383',
          400: '#f3a451',
          500: '#ef852d',
          600: '#d96a1f',
          700: '#b4511a',
          800: '#90401c',
          900: '#753619',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.015em',
        wide: '0.025em',
        wider: '0.05em',
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '2',
      },
    },
  },
  plugins: [],
}

