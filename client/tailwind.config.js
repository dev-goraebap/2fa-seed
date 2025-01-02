/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flyonui/dist/js/*.js"
  ],
  theme: {
    extend: {},
  },
  flyonui: {
    themes: ["light", "dark", "gourmet"]
  },
  plugins: [
    require('tailwindcss-motion'),
    require("flyonui"),
    require("flyonui/plugin")
  ], 
}