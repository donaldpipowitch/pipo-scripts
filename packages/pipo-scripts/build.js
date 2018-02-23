const { existsSync, outputFileSync } = require('fs-extra');
const { join } = require('path');
const { camelCase } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

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

class OutputWebpackBuild {
  // constructor(options) {
  //   this.options = options;
  // }

  apply(compiler) {
    const { emit } = compiler.hooks;
    // use `emit.tapPromise`, if I use an async function
    emit.tap(this.constructor.name, (compilation) => {
      compilation.modules.forEach((module) => {
        module.dependencies.forEach((dependency) => {
          if (dependency.type === 'harmony init') {
            const filename = dependency.originModule.userRequest.replace(
              process.cwd(),
              ''
            );
            outputFileSync(
              join('dist-webpack', `${filename}.js`),
              dependency.originModule._source._value
            );
          }
        });
      });
    });
  }
}

const isWebApp = existsSync('src/index.html');

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
        use: [{ loader: 'babel-loader', options: getBabelConfig() }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { verbose: false, root: cwd }),
    new CleanWebpackPlugin(['dist-webpack'], { verbose: false, root: cwd }),
    new HardSourceWebpackPlugin(),
    new OutputWebpackBuild()
  ],
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
};

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
