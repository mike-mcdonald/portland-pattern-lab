const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');

module.exports = ({ file, options, env }) => {
  return {
    plugins: [
      tailwind,
      autoprefixer,
      cssnano({
        preset: 'default'
      })
    ]
  };
};
