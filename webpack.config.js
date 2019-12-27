const baseConfig = require('./webpack.config.base');

const newConfig = Object.assign({}, baseConfig, {
  mode: 'development',
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  }
});

module.exports = newConfig;
