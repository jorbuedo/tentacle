// Tailwind IntelliSense extension still doesn't support ESM
// Thus this duplicated file that will hopefully disappear at some point
module.exports = {
  content: [
    './index.html',
    './frontend/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
