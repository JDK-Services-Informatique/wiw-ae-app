module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '18' },
        bugfixes: true,
        modules: 'commonjs'
      }
    ]
  ]
};
