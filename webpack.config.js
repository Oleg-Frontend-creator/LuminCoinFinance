const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            baseUrl: '/'
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
                {from: "./src/libraries/js/sidebars.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "css"},
                {from: "./src/styles/adaptive.css", to: "css"},
                {from: "./src/styles/styles.css", to: "css"},
                {from: "./src/libraries/css/sidebars.css", to: "css"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"}
            ],
        }),
    ]
};