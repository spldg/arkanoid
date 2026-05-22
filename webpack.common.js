import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extensions } from 'pixi.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    entry: './src/main.ts',

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(mp3|wav|ogg)$/i,
                type: 'asset/resource'
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        })
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    }
}