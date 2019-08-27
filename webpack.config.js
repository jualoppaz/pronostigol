const path = require("path");

module.exports = {
    mode: "development",
    resolve: {
        extensions: [".js"]
    },
    context: __dirname,
    entry: {
        app: ["./app/app.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/build/"
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        host: "localhost",
        port: 8080,
        inline: true,
        writeToDisk: true
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    },
                    {
                        loader: "eslint-loader"
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ],
                exclude: [/index\.html$/]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader" // translates CSS into CommonJS
                ]
            },
            {
                test: /\.pug$/,
                use: ["html-loader", "pug-html-loader"]
            },
            {
                test: /\app(\/|\/)assets/,
                use: ["file-loader"]
            }
        ]
    }
};
