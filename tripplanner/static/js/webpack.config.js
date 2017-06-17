const path = require('path');
const {AureliaPlugin} = require('aurelia-webpack-plugin');

module.exports = {
    entry: {
        main: 'aurelia-bootstrapper'
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },

    resolve: {
        extensions: [".js"],
        modules: ["src", "node_modules"].map(x => path.resolve(x))
    },

    module: {
        rules: [
            {test: /\.css$/i, use: "css-loader" },
            {test: /\.html$/i, use: "html-loader"}
        ]
    },

    plugins: [
        new AureliaPlugin()
    ]
};