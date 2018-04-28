const { environment } = require('@rails/webpacker')
const vue =  require('./loaders/vue')

environment.loaders.append('vue', vue)
environment.loaders.append('babel', {
  test: /\.js$/,
  loader: 'babel-loader'
 })
environment.loaders.append('css', {
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { importLoaders: 1 }
    },
  ]
 })
environment.loaders.append('sass', {
 test: /\.s[a|c]ss$/,
 use: [
  'vue-style-loader',
  'css-loader',
  'sass-loader',
  ]
 })
environment.loaders.append('url', {
 test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/  ,
 use: [
   { loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } }
  ]
 })

environment.loaders.append('file', {
 test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
 use: [
   { loader: 'file-loader' }
  ]
 })


environment.loaders.get('sass').use.splice(-1, 0, {
  loader: 'resolve-url-loader',
  options: {
    attempts: 1
  }
});

module.exports = environment
