const webpack = require('webpack');

module.exports = {
    entry: {
        'angular-indeterminate': './src/angular-indeterminate.js',
        'angular-indeterminate.min': './src/angular-indeterminate.js',
    },
    output: {
        path: './dist',
        filename: '[name].js',
    },
    devtool: 'cheap-source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['ng-annotate', 'babel-loader'],
            },
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
        })
    ],
};
