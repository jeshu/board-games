const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/pages", to: "pages" },
        { from: "src/styles/*.css", to({ context, absoluteFilename }) {
          return "css/[name].[ext]";
        }, },
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
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
