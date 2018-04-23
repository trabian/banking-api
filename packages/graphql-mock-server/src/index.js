import express from "express";
import bodyParser from "body-parser";

import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import cors from "cors";
import path from "path";

import { makeExecutableSchema } from "graphql-tools";

import {
  typeDefs,
  resolvers,
  createMockSdk
} from "@trabian/banking-graphql-mock-schema";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const PORT = process.env.PORT || 3002;

const run = async () => {
  const sdk = await createMockSdk({
    dbFile: path.join(__dirname, "..", "db.json")
  });

  const app = express();

  const paths = {
    public: path.join(__dirname, "client", "build")
  };

  app.use(cors());

  // bodyParser is needed just for POST.
  app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress(req => ({
      schema,
      context: {
        sdk,
        userId: req.headers.authorization
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
};

run();
