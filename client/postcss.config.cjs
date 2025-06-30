// postcss.config.js
// import autoprefixer from 'autoprefixer';

// /** @type {require('postcss-load-config').Config} */
// export default {
//   plugins: [autoprefixer],
// };

// module.exports = {
//   plugins: {
//     '@tailwindcss/postcss': {},
//     autoprefixer: {},
//   },
// };

// postcss.config.cjs
const autoprefixer = require('autoprefixer');

/** @type {import('postcss').Config} */
module.exports = {
  plugins: [autoprefixer],
};
