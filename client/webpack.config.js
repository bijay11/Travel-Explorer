// This file is the main connection point between webpack and the code

const path = require("path");

// On build, webpack takes ./src/main.js and generate bundle.js file in ./dist directory
module.exports = {
  entry: "./src/Index.tsx",
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
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    // this will make import easy like import App from "./App"; instead of import App from "./App.jsx";
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};
