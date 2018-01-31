import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import cors from "cors";
import path from "path";

import { makeExecutableSchema } from "graphql-tools";

import FileAsync from "lowdb/adapters/FileAsync";

import { LowSDK } from "./src/sdk";

import { typeDefs, resolvers } from "./src/index";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const sdk = new LowSDK({
  adapter: new FileAsync("db.json", {
    defaultValue: {
      accounts: []
    }
  })
});

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
  graphqlExpress(req => ({
    schema,
    context: {
      sdk,
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
