/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {},
};
export const plugins = [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
];

