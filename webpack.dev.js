import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    stats: 'minimal',
})