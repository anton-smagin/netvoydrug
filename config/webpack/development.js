process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

const { VueLoaderPlugin } = require('vue-loader')
const newPlugin = environment.toWebpackConfig()
newPlugin.plugins.push(new VueLoaderPlugin())

module.exports = newPlugin;
