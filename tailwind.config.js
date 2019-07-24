const Color = require('color');

const TINTS = {
  100: 0.9,
  200: 0.75,
  300: 0.6,
  400: 0.3
}

const SHADES = {
  600: 0.9,
  700: 0.6,
  800: 0.45,
  900: 0.3

}

function tint(color, intensity) {
  const
    r = Math.round(color.red() + (255 - color.red()) * intensity),
    g = Math.round(color.green() + (255 - color.green()) * intensity),
    b = Math.round(color.blue() + (255 - color.blue()) * intensity);
  return Color([r, g, b]);
}

function shade(color, intensity) {
  const
    r = Math.round(color.red() * intensity),
    g = Math.round(color.green() * intensity),
    b = Math.round(color.blue() * intensity);
  return Color([r, g, b]);
}

function generateColors(colorHex) {
  color = Color(colorHex);

  colors = {
    '100': '',
    '200': '',
    '300': '',
    '400': '',
    '500': color.hex(),
    '600': '',
    '700': '',
    '800': '',
    '900': ''
  }

  for (const t in TINTS) {
    colors[t] = tint(color, TINTS[t]).hex()
  }

  for (const s in SHADES) {
    colors[s] = shade(color, SHADES[s]).hex()
  }

  return colors;
}



module.exports = {
  theme: {
    fontFamily: {
      'sans': ['Open Sans'],
    },
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      black: '#22292f',
      white: '#ffffff',
      gray: {
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
      },
      cyan: generateColors('#00A0AE'),
      orange: generateColors('#F58220'),
      red: generateColors('#FF6666'),
      green: generateColors('#66AD83'),
      blue: generateColors('#005CB9'),
      marine: generateColors('#99CCCC'),
      tangerine: generateColors('#FCB040'),
      fog: generateColors('#E7E8EA')
    },
    extend: {}
  },
  variants: {},
  plugins: []
}
