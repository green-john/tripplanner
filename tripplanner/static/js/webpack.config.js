const path = require('path');

module.exports = {
    entry: {
        main: 'main'
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },

    resolve: {
        extensions: [".js", ".vue"],
        modules: ["src", "node_modules"].map(x => path.resolve(x)),
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },

    module: {
        rules: [
            {
                test: /\.vue$/i,
                use: "vue-loader" },
            {
                test: /\.js$/i,
                use: "babel-loader",
                exclude: '/node-modules/'
            },
            {
                test: /\.css$/i,
                use: "css-loader"
            },
            {
                test: /\.html$/i,
                use: "html-loader",
            }
        ]
    },
};