const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  //   entry: './src/index.ts',
  entry: {
    lint: './src/lint.ts'
  },
  output: {
    filename: '[name].js'
    // path: resolve(process.cwd(), 'dist')
    // path: resolve(process.cwd(), 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { verbose: false, root: process.cwd() })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'inline-source-map',
  mode: 'production',
  target: 'node',
  stats: 'minimal'
};
