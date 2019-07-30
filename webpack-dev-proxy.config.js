const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = webpackMerge(commonConfig, {
    devServer: {
        proxy: {
            "**": "http://localhost:8888"
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./server/views/index.pug",
            inject: false
        }),
        new CopyWebpackPlugin([{ from: "app/assets", to: "./" }])
    ]
});
