const path = require('path');
const pkg = require('./package.json');

// env configuration
require('dotenv').config();

// dev mode?
const DEV = process.env.NODE_ENV !== 'production';

// configurations
const settings = {
    src: 'src/focos.js',
    libname: process.env.NAME.toLowerCase(),
    libtarget: 'window',
    outdir: DEV ? 'dev' : 'dist',
    latestDir: 'latest'
};

// setup config
const config = {
    mode: DEV ? 'none' : 'production',
    entry: path.join(__dirname, settings.src),
    devtool: DEV ? 'source-map' : '',
    output: {
        filename: DEV ? `${settings.libname}.js` : `${settings.libname}.min.js`,
        library: process.env.NAME,
        libraryTarget: settings.libtarget,
        path: path.join(__dirname, settings.outdir, pkg.version)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader?cacheDirectory=true',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};

module.exports = config;
