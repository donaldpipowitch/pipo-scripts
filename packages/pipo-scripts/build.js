const { existsSync, outputFileSync } = require('fs-extra');
const { join } = require('path');
const { camelCase } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cwd = process.cwd();
const joinCwd = (file) => join(cwd, file);
const project = require(joinCwd('package.json'));

function findFile(files) {
  for (const file of files) {
    if (existsSync(file)) {
      return file;
    }
  }
}

function getEntry() {
  const files = ['./src/index.tsx', './src/index.ts', './src/index.js'];
  return findFile(files);
}

function getBabelConfig() {
  const files = ['src/.babelrc', 'src/.babelrc.js', '.babelrc', '.babelrc.js'];
  const file = findFile(files);
  const config = file ? joinCwd(file) : './build.babelrc';
  return require(config);
}

// class OutputWebpackBuild {
//   // constructor(options) {
//   //   this.options = options;
//   // }

//   apply(compiler) {
//     const { emit } = compiler.hooks;
//     // use `emit.tapPromise`, if I use an async function
//     emit.tap(this.constructor.name, (compilation) => {
//       compilation.modules.forEach((module) => {
//         module.dependencies.forEach((dependency) => {
//           if (dependency.type === 'harmony init') {
//             const filename = dependency.originModule.userRequest.replace(
//               process.cwd(),
//               ''
//             );
//             outputFileSync(
//               join('dist-webpack', `${filename}.js`),
//               dependency.originModule._source._value
//             );
//           }
//         });
//       });
//     });
//   }
// }

const isWebApp = existsSync('src/index.html');

const stats = {
  assets: false,
  builtAt: false,
  children: false,
  entrypoints: false,
  hash: false,
  modules: false,
  version: false
};

const config = {
  entry: getEntry(),
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        // include: join(cwd, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: getBabelConfig()
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: process.env.WEBPACK_SERVE
              ? 'style-loader'
              : MiniCssExtractPlugin.loader
          },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader?limit=1000&name=[name]-[hash].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?prefix=font/&limit=5000'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { verbose: false, root: cwd })
    // new CleanWebpackPlugin(['dist-webpack'], { verbose: false, root: cwd }),
    // new HardSourceWebpackPlugin(),
    // new OutputWebpackBuild()
  ],
  mode: 'production',
  // target: 'node', // trigger based on targets of babelrc?
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFields: [
      'webpack',
      // defaults
      // see https://github.com/webpack/webpack/blob/dc50c0360e87204ea77172910e877f8c510f3bfb/lib/WebpackOptionsDefaulter.js#L84
      'browser',
      'module',
      'main'
    ]
  },
  resolveLoader: {
    modules: [
      // to better support `$ yarn/npm link pipo-scripts` we'll look for loaders
      // which are relative to this package (or its workspace root)
      join(__dirname, 'node_modules'),
      // note: if pipo-scripts is installed normally the next two lines should
      // point to the same directory
      join(__dirname, '../../node_modules'),
      'node_modules'
    ],
    alias: {
      // see https://www.npmjs.com/package/copy-loader
      ['copy-loader']: `file-loader?name=[path][name].[ext]&context=./${join(
        cwd,
        'src'
      )}`
    }
  },
  stats
};

if (process.env.WEBPACK_SERVE) {
  config.mode = 'development';
  config.serve = {
    dev: { stats }
  };
} else {
  config.plugins.push(new MiniCssExtractPlugin());
}

if (isWebApp) {
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  );
} else {
  config.output.libraryTarget = 'commonjs2';
}

module.exports = config;
