// allow yarn/npm to link pipo-scripts
function resolveByKey(config, key) {
  if (Array.isArray(config[key])) {
    config[key] = config[key].map((item) => {
      if (Array.isArray(item)) {
        item[0] = require.resolve(item[0]);
        return item;
      } else {
        return require.resolve(item);
      }
    });
  }
}

function resolve(config) {
  resolveByKey(config, 'presets');
  resolveByKey(config, 'plugins');
  return config;
}

module.exports = resolve({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions, Firefox ESR, ie >= 11',
          node: '6.10' // still v6, because of AWS Lambas
          // ...android, ios, electron
        },
        modules: false,
        useBuiltIns: 'usage'
      }
    ],
    '@babel/preset-react',
    '@babel/preset-stage-0',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-decorators',
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
});
