const { existsSync, outputFileSync } = require('fs-extra');
const { join } = require('path');
const { camelCase } = require('lodash');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const cwd = process.cwd();
const inCwd = (file) => join(cwd, file);
const project = require(inCwd('package.json'));

function getEntry() {
  const tsx = './src/index.tsx';
  const ts = './src/index.ts';
  const js = './src/index.js';
  if (existsSync(inCwd(tsx))) {
    return tsx;
  } else if (existsSync(inCwd(ts))) {
    return ts;
  } else {
    return js;
  }
}

function getBabelConfig() {
  const srcJson = 'src/.babelrc';
  const srcJs = 'src/.babelrc.js';
  const json = '.babelrc';
  const js = '.babelrc.js';
  if (existsSync(inCwd(srcJson))) {
    return require(inCwd(srcJson));
  } else if (existsSync(inCwd(srcJs))) {
    return require(inCwd(srcJs));
  } else if (existsSync(inCwd(json))) {
    return require(inCwd(json));
  } else if (existsSync(inCwd(js))) {
    return require(inCwd(js));
  } else {
    return require('./build.babelrc');
  }
}

class OutputWebpackBuild {
  // constructor(options) {
  //   this.options = options;
  // }

  apply(compiler) {
    const { emit } = compiler.hooks;
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

module.exports = {
  entry: getEntry(),
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2'
    // library: camelCase(project.name),
    // libraryTarget: 'umd' // throws `window is not defined` when required by node
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
    // new HtmlWebpackPlugin({
    //   template: 'src/index.html'
    // })
  ],
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
};
