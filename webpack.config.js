const path = require('path');

module.exports = {
  context: path.join(__dirname, './app/static/js'),
  entry: {
    index: './index.js',
    main: './main.js',
    project_base: './project_base.js',
    progress: './progress.js',
    variation: './variation.js'
  },
  output: {
    path: path.join(__dirname, "app/static/dist/js"),
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};