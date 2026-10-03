/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#05070f', 900: '#090e1c', 800: '#0f1629', 700: '#18213b' },
        fg: '#e7ecff',
        mute: '#9aa6c9',
        aqua: '#52d0f5',
        iris: '#8f82ff',
        blush: '#ff7ab6',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
