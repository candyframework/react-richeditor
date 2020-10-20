const baseConfig = require('./webpack.config.base');

const newConfig = Object.assign({}, baseConfig, {
  mode: 'development',
  externals: {
    // 引用全局 React 变量
    'react': 'React'
  }
});

module.exports = newConfig;
