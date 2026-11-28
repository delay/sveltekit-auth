const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const tailwindcssnesting = require('tailwindcss/nesting');

const config = {
  plugins: [
    tailwindcssnesting(),
    tailwindcss(),
    autoprefixer(),
  ]
}

module.exports = config;

