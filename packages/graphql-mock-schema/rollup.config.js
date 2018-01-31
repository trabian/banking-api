import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: {
    file: pkg.main,
    format: "cjs"
  },
  plugins: [
    babel({
      exclude: ["../../node_modules/**", "node_modules/**"], // only transpile our source code
      runtimeHelpers: true
    }),
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
    filesize()
  ],
  external: ["graphql", "graphql-tools"],
  watch: {
    include: "src/**"
  }
};
