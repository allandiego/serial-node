const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(jpg|png|ico|icns)$/,
  use: [{ loader: 'url-loader' }, { loader: 'file-loader' }],
});

rules.push({
  test: /\.svg$/,
  use: [{ loader: 'svg-inline-loader' }],
});

// rules.push({
//   test: /\.(?:png|jpg|svg)$/,
//   use: [{ loader: 'url-loader' }],
// });

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.svg',
      '.json',
      '.png',
      '.jpg',
    ],
  },
};
