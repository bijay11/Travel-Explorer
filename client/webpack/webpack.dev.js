const webpack = require("webpack");

// An EXPERIMENTAL Webpack plugin to enable "Fast Refresh" (also known as Hot Reloading) for React components.
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true,
  },

  // create-react-app recommendation for dev mode
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.name": JSON.stringify("test-dev"),
    }),

    //
    new ReactRefreshWebpackPlugin(),
  ],
};
