const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: __dirname + '/dist',
    publicPath: '/',

    libraryTarget: 'umd',
    library: 'ReactRichEditor'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
            { loader: 'ts-loader' }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.tsx', '.ts' ],
    modules: ['node_modules'],
  }
};
