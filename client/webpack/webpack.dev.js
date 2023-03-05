const webpack = require("webpack");

module.exports = {
  mode: "development",

  // create-react-app recommendation for dev mode
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.name": JSON.stringify("test-dev"),
    }),
  ],
};
