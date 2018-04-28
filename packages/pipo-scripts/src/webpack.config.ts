import { existsSync } from 'fs-extra';
import { join } from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getBabelConfig, getEntry, cwd } from './files';

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

const config: Configuration = {
  entry: getEntry(),
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: getBabelConfig()
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        // no exclude of node_modules for old projects
        use: [
          {
            loader: 'babel-loader',
            options: getBabelConfig()
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      // fallback for old projects
      {
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: process.env.WEBPACK_SERVE
              ? 'style-loader'
              : (MiniCssExtractPlugin.loader as any)
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
  plugins: [new CleanWebpackPlugin(['dist'], { verbose: false, root: cwd })],
  mode: 'production',
  // target: 'node', // trigger based on targets of babelrc?
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // for old projects
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
      ['copy-loader']: 'file-loader?name=[path][name].[ext]&context=./src'
    }
  },
  stats
};

// fooo
config.mode = 'development';

if (process.env.WEBPACK_SERVE) {
  config.mode = 'development';
  (config as any).serve = {
    dev: { stats }
  };
} else {
  config.plugins!.push(new MiniCssExtractPlugin());
}

if (isWebApp) {
  config.plugins!.push(
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  );
}

export default config;
