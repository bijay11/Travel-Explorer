// This file is the main connection point between webpack and the code

const path = require("path");

// On build, webpack takes ./src/main.js and generate bundle.js file in ./dist directory
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  mode: "development",
  // devServer config is used to run a dev server.
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
};
