// allow yarn/npm to link pipo-scripts
function resolveByKey(config: any, key: string) {
  if (Array.isArray(config[key])) {
    config[key] = config[key].map((item: any) => {
      if (Array.isArray(item)) {
        item[0] = require.resolve(item[0]);
        return item;
      } else {
        return require.resolve(item);
      }
    });
  }
}

function resolve(config: any) {
  resolveByKey(config, 'presets');
  resolveByKey(config, 'plugins');
  return config;
}

module.exports = resolve({
  presets: [
    [
      'babel-preset-env',
      {
        targets: {
          browsers: 'last 2 versions, Firefox ESR, ie >= 11'
          // node: '8.10' // as supported by AWS Lambda
          // ...android, ios, electron
        },
        modules: false,
        useBuiltIns: true
      }
    ],
    'babel-preset-react',
    'babel-preset-stage-0'
  ],
  plugins: [
    'babel-plugin-transform-decorators-legacy'
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
});
