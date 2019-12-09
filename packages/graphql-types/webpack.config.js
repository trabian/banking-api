const path = require("path");

const pkg = require("./package.json");
const webpack = require("webpack");

module.exports = {
  entry: "./index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname),
    filename: pkg.main,
    libraryTarget: "commonjs2",
  },
  node: {
    process: false,
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
      },
    ],
  },
};
