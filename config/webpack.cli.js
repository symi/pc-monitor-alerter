const webpackBase = require('./webpack.base');
const VueBlessed = require('blessed-vue');
const nodeExternals = require('webpack-node-externals');
const { resolve } = require('path');
const { consoleApp: { path, filename } } = require('../package.json');

module.exports = {
  ...webpackBase,
  entry: {
    cli: './src/reporters/console/index.js'
  },
  output: {
    path: resolve(__dirname, '../', path),
    filename,
    libraryTarget: 'commonjs'
  },
  target: 'node',
  externals: [nodeExternals()].concat(['../../dist/build'])
};

