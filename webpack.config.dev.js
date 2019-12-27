const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.config.base');

const newConfig = Object.assign({}, baseConfig, {
    mode: 'development',
    entry: ['./demo/src/index.tsx'],
    output: {
        filename: 'bundle.js',
        path: __dirname + '/demo/dist',
        publicPath: '/'
    },
    devServer: {
        // 项目根目录
        contentBase: path.join(__dirname, 'demo'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/index.html',
            inject: 'body',
            publicPath: '/'
        })
    ]
})

module.exports = newConfig;
