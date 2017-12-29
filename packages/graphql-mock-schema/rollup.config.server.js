import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "rollup-plugin-json";

export default {
  input: "src/server.js",
  output: {
    file: "bundle.server.js",
    format: "cjs"
  },
  plugins: [
    json({
      include: "../../node_modules/**"
    }),
    resolve({
      jsnext: false,
      main: true,
      module: false
    }),
    commonjs({
      namedExports: {
        "graphql-tools": ["makeExecutableSchema"],
        "graphql-server-express": ["graphqlExpress", "graphiqlExpress"],
        graphql: ["GraphQLScalarType "]
      }
    }),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    filesize()
  ],
  watch: {
    include: "src/**"
  }
};
