/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}'],
  plugins: [],
  theme: {
    colors: {
      primary: colors.stone[900],
      secondary: colors.stone[200],

      accent: colors.stone[400],
      'accent-dark': colors.stone[600],

      success: colors.green[600],
      'success-dark': colors.green[800],

      warning: colors.orange[600],

      error: colors.red[600],
      'error-dark': colors.red[800],
    },
  },
};
export default config;
