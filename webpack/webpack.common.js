const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');

module.exports = {
    entry: {
        mixtunes: './src/app/app.js',
        landing: './src/landing/landing.js'
    },
    output: {
        filename: 'js/[name].[contentHash].js',
        path: path.join(__dirname, './dist'),
        publicPath: '/'
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: false } },
                    { loader: 'sass-loader', options: { sourceMap: false } }
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contentHash].css"
        }),
        new HTMLWebpackPlugin({
            template: './src/app/index.html',
            filename: 'app.html',
            chunks: ['mixtunes']
        }),
        new HTMLWebpackPlugin({
            template: './src/landing/landing.html',
            filename: 'landing.html',
            chunks: ['landing']
        }),
    ]
};