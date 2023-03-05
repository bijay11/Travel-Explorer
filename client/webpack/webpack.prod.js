const webpack = require("webpack");

module.exports = {
  mode: "production",

  // create-react-app recommendation for prod mode
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.name": JSON.stringify("test-prod"),
    }),
  ],
};
