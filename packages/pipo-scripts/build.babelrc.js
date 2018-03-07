module.exports = {
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
};
