const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function getThemes () {
  const files = fs.readdirSync(path.resolve(__dirname, 'src/themes'));
  return files.map(fileName => fileName.replace(/(^_|.scss$)/g, ''));
}

const paths = {
  SRC: path.resolve(__dirname, 'src'),
  DIST: path.resolve(__dirname, 'dist')
};

const variants = {
  themes: getThemes ()
};

function createConfig(options) {
  return {
    entry: path.join(paths.SRC, 'app.js'),
    output: {
      path: paths.DIST,
      filename: 'app.bundle.js'
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({ filename: `${options.themes}-theme.css` })
    ],

    module: {
      rules: [
        { test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        { test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, {
              loader: "css-loader", options: {
                modules: true,
                sourceMap: true
              }
            },{
              loader: "sass-loader", options: {
                sourceMap: true,
                additionalData: `@import "${options.themes}";`,
                sassOptions: {
                  includePaths: [path.join(__dirname, 'src/themes')]
                }
              }
            }]
        }]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
}

const webpackVariants = createVariants(variants, createConfig);
webpackVariants.push({
  devServer: {
    static: paths.DIST,
    hot: true,
  }
})

module.exports = webpackVariants;
