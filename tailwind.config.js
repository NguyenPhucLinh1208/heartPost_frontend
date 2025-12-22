/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)'],
        display: ['var(--font-be-vietnam-pro)'],
      },
      colors: {
        'background': '#F4F1EA',
        'foreground': '#1C1C1C',
        'accent': '#E65C4F',
        'accent-dark': '#D14B3D',
      },
      boxShadow: {
        'neo': '4px 4px 0px #1C1C1C',
        'neo-sm': '2px 2px 0px #1C1C1C',
        'neo-hover': '6px 6px 0px #1C1C1C',
      },
      translate: {
        'neo': '-4px',
      },
      borderColor: {
        'DEFAULT': '#1C1C1C',
      }
    },
  },
  plugins: [],
}