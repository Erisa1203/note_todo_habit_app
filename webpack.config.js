const path = require('path')

module.exports = {
  entry: {
    index: ['core-js/stable', 'regenerator-runtime/runtime', './src/index.js'],
    note: ['core-js/stable', 'regenerator-runtime/runtime', './src/notes/index.js'],
    edit: ['core-js/stable', 'regenerator-runtime/runtime', './src/notes/edit.js'],
    note_common: ['core-js/stable', 'regenerator-runtime/runtime', './src/notes/common.js'],
    todos: ['core-js/stable', 'regenerator-runtime/runtime', './src/todo/app.js'],
    habit: ['core-js/stable', 'regenerator-runtime/runtime', './src/habit/app.js'],
    study: ['core-js/stable', 'regenerator-runtime/runtime', './src/study/app.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public/scripts'),
    filename: '[name]-bundle.js',
    publicPath: '/scripts/'
  },

  mode: "development",
  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/scripts/',
    watchContentBase: true,
  }

};

loaders: [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query://loaderに渡したいクエリパラメータを指定します
    {
      "presets": ["@babel/preset-env"]
    }
  }
]

