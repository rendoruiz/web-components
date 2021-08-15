const postcssPresetEnv = require('postcss-preset-env');
module.exports = {
  plugins: [
    postcssPresetEnv({
      features: {
        'nesting-rules': true
      }
    }),
    require('cssnano')({
        preset: 'default',
    }),
  ],
};
