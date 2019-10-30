const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = function (env = {}) {
  let babelConf;

  const babelRC = env.esnext ? './.es6.babelrc' : './.babelrc';
  if(fs.existsSync(babelRC)) {
    babelConf = JSON.parse(fs.readFileSync(babelRC));
    babelConf.babelrc = false;
  }

  const externals = {
    spritejs: 'spritejs',
  };

  const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: env.esnext ? 'sprite-vue.es6' : 'sprite-vue',
    publicPath: '/js/',
    library: 'spritevue',
    libraryTarget: env.esnext ? 'commonjs2' : 'umd',
  };

  if(env.production) {
    output.filename += '.min.js';
  } else {
    output.filename += '.js';
  }

  return {
    mode: env.production ? 'production' : 'none',
    // entry: './src/web/entry-runtime-with-compiler.js',
    entry: './src/index.js',
    output,
    resolve: {
      aliasFields: ['browser', 'esnext'],
      alias: require('./build/alias'),
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            resolve('src'), 
            resolve('node_modules/vue/src'),
            // resolve('node_modules/spritejs'),
            /node_modules\/(sprite-[\w-]+\/|@spritejs\/|svg-path-to-canvas\/|fast-animation-frame\/).*/
          ],
          use: {
            loader: 'babel-loader',
            options: babelConf,
          },
        },
      ],

      /* Advanced module configuration (click to show) */
    },

    externals,
    // Don't follow/bundle these modules, but request them at runtime from the environment

    stats: 'errors-only',
    // lets you precisely control what bundle information gets displayed

    devServer: {
      contentBase: path.join(__dirname, 'example'),
      compress: true,
      port: 9090,
      // ...
    },

    plugins: [
      // ...
      new webpack.DefinePlugin({
        '__WEEX__': false
      }),
    ],
    // list of additional plugins


    /* Advanced configuration (click to show) */
  }
}