// allow yarn/npm to link pipo-scripts
function resolveByKey(config: any, key: string) {
  if (!config[key]) return;
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
  if (config.env) {
    Object.values(config.env).forEach((envConfig) => {
      resolveByKey(envConfig, 'presets');
      resolveByKey(envConfig, 'plugins');
    });
  }
  return config;
}

export const getBabelConfig = () =>
  resolve({
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: 'last 2 versions, Firefox ESR, ie >= 11'
            // node: '8.10' // as supported by AWS Lambda
            // ...android, ios, electron
          },
          modules: false,
          useBuiltIns: 'usage'
        }
      ],
      '@babel/preset-react',
      ['@babel/preset-stage-0', { decoratorsLegacy: true }],
      '@babel/preset-typescript'
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }]
    ],
    env: {
      test: {
        plugins: ['@babel/plugin-transform-modules-commonjs']
      }
    }
  });
