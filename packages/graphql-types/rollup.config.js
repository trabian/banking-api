import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: {
    file: pkg.main,
    format: "cjs"
  },
  plugins: [
    resolve({
      jsnext: false,
      main: true,
      module: false
    }),
    commonjs({
      namedExports: {
        "graphql-tools": ["makeExecutableSchema"]
      }
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ],
  watch: {
    include: "src/**"
  }
};
