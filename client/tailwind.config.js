/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yunay-CA Academy Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea', // Main secondary color
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b', // Main accent color
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing: {
        'section-height': '500px',
      },
      fontSize: {
        'default': ['15px', '21px'],
        'course-deatails-heading-small': ['26px', '36px'],
        'course-deatails-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
      },
      maxWidth: {
        'course-card': '424px',
      },
      boxShadow: {
        'custom-card': '0px 4px 15px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}