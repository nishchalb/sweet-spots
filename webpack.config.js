// @author: Maryam Archie
// Taken from fritter-react

var path = require('path');
var webpack = require('webpack');

// Based on template from:
// https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html
// https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
module.exports = {
    devtool: 'source-map',
    entry: ['./react/main.js'],
    output: { path: __dirname + '/public/js', filename: 'bundle.js' },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            { test: /\.css$/, loader: 'css-loader' },
            { test: /\.(svg|ttf|woff|eot|woff2)(\?.*)?$/, loader: 'file' },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
