import * as webpack from 'webpack';
import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const config: webpack.Configuration = {
    entry: './src/app.ts',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]
};

export default config;