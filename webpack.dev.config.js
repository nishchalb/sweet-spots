// @author: Maryam Archie
// Taken from fritter-react

var path = require('path');
var webpack = require('webpack');

/**
 * @summary This file configures Webpack for our development environment, including some other useful features.
 * The key differences are that we include the devServer key, along with options to specify where the content should
 * be loaded from (contentBase) and hosted at (publicPath).  We include the "HotModuleReplacementPlugin()" to manage
 * the automatic file watching and bundle updating.  We also add the "webpack-hot-middleware"
 * @type {{entry: string[], output: {filename: string, path: string, publicPath: string}, devServer: {inline: boolean, hot: boolean, publicPath: string, contentBase: string}, plugins: *[], module: {loaders: *[]}, node: {console: boolean, fs: string, net: string, tls: string}}}
 */
module.exports = {
    entry: ['./react/main.js', 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: '/js/'
    },
    devServer: {
        inline: true,
        hot: true,
        publicPath: '/public',
        contentBase: './public'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'react-hmre']
                }
            },
            { test: /\.css$/, loader: 'css-loader' },
            { test: /\.(svg|ttf|woff|eot|woff2)(\?.*)?$/, loader: 'file' },
            { test: /\.json$/, loader: 'json' }
        ]
    }, node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};