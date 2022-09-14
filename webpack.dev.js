const path = require("path")
const common = require("./webpack.common.js")
const { merge } = require("webpack-merge")

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8004,
    client: {
      overlay: true,
    },
  },
})
