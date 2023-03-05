const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/index.tsx"),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        // without this, webpack won't support css files.
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // out of the box from webpack from v5
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        // out of the box from webpack from v5
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/i,
        type: "asset/inline",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "..", "./build"),
    filename: "bundle.js",
  },
  plugins: [
    // injects bundle.js file into index.html  and place that html file in build folder
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "..", "./src/Index.html"),
    }),
  ],
};
