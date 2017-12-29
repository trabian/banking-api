import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import cors from "cors";
import path from "path";

import { makeExecutableSchema } from "graphql-tools";

import { typeDefs, resolvers } from "./src/index.js";

const schema = makeExecutableSchema({ typeDefs, resolvers });

// addMockFunctionsToSchema({ schema });

const PORT = process.env.PORT || 3001;

const app = express();

const paths = {
  public: path.join(__dirname, "client", "build")
};

app.use(cors());

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress((req, res) => ({
    schema,
    context: {
      user: {
        id: req.headers.authorization
      }
    }
  }))
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

app.use("/", express.static(paths.public));

app.listen(PORT, () => console.warn(`listening on port: ${PORT}`));
