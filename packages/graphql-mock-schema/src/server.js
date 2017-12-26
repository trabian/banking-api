import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";

import { addMockFunctionsToSchema } from "graphql-tools";

import schema from "./index.js";

addMockFunctionsToSchema({ schema });

const PORT = process.env.PORT || 3001;

const app = express();

// bodyParser is needed just for POST.
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

app.listen(PORT, () => console.warn(`listening on port: ${PORT}`));
