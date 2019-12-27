const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const devConfig = require('./webpack.config.dev');

devConfig.entry.unshift("webpack-dev-server/client?http://localhost:23333/");

new WebpackDevServer(webpack(devConfig), devConfig.devServer).listen(
    23333,
    'localhost',
    () => {}
);
