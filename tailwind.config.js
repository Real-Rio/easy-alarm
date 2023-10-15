/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      'Jet-Bold': ['Jet-Bold'],
      'Jet-Regular': 'Jet-Regular',
    },
    colors: {
      'zinc-100': '#F0F0F0',
      'gray-1': '#363636',
      'gray-2': '#D5D5D5',
      'blue-1':'#33A2E9',

    }
  },
  plugins: [],
}

