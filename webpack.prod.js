const common = require("./webpack.common.js")
const { merge } = require("webpack-merge")

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    usedExports: true,
  },
})
