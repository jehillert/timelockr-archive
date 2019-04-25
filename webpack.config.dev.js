const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: './client/index.jsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/},
      {test: /\.jsx?$/, include: /node_modules/, use: ['react-hot-loader/webpack']},
      {test: /\.css$/, use: ['style-loader', 'css-loader/locals']},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.png$/, use: [{ loader: 'url-loader', options: { mimetype: 'image/png'}}]},
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new Dotenv({ systemvars: true }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ],
  devServer: { contentBase: './dist' },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      components: path.resolve(__dirname, 'client/indexes/components.jsx'),
      contexts: path.resolve(__dirname, 'client/indexes/contexts.jsx'),
      theme: path.resolve(__dirname, 'client/indexes/theme.jsx'),
      utilities: path.resolve(__dirname, 'client/indexes/utilities.jsx'),
    },
  },

};

/*
POSSIBLY NEEDED:
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  ...
  new CopyWebpackPlugin([{ from: './static/favicon.ico' }]),
NOTES:
  - dotenv-webpack is a dependency but I assume also required for development mode.
  - So it is included in both prod and dev configurations.
  - "module.loaders is now module.rules"
  - Code not adopted in the dev config was because dev works fine already...
*/