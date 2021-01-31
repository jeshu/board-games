const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/scripts/main.js',
    tictactoe: './src/scripts/tictactoe.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      filename:'index.html',
      template: 'src/index.html',
      chunks:['main'],
    }),
    new HtmlWebpackPlugin({
      filename:'pages/tictactoe.html',
      template: 'src/pages/tictactoe.html',
      chunks:['tictactoe'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
        {
          from: path.resolve(__dirname, 'src/houdini'),
          to: path.resolve(__dirname, 'dist/houdini'),
        },
        {
          from: 'src/styles/*.css',
          to({ context, absoluteFilename }) {
            return 'css/[name].[ext]';
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
