const path = require("path");

const pkg = require("./package.json");

module.exports = {
  entry: "./index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname),
    filename: pkg.main,
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [{ test: /\.graphql?$/, loader: "webpack-graphql-loader" }]
  }
};
