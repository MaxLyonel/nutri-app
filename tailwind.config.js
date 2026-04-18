/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/html-tailwind-preset')],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      extend: {
        fontFamily: {
          'sans':  ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
  },
  plugins: [],
}

