const path = require('path')

module.exports = {
  'vue$': path.resolve(__dirname, '../src/web/entry-runtime-with-compiler'),
  compiler: 'vue/src/compiler',
  core: 'vue/src/core',
  shared: 'vue/src/shared',
  web: path.resolve(__dirname, '../src/web'),
  weex: 'vue/src/platforms/weex',
  mp: 'vue/src/platforms/mp',
  server: 'vue/src/server',
  sfc: 'vue/src/sfc',
  '@': path.resolve(__dirname, '../src'),
  'spritejs': 'spritejs/dist/spritejs.js',
}
