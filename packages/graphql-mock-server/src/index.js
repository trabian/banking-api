import { ApolloServer } from "apollo-server";

import {
  typeDefs,
  resolvers,
  createMockSdk
} from "@trabian/banking-graphql-mock-schema";

import path from "path";

const run = async () => {
  const sdk = await createMockSdk({
    dbFile: path.join(__dirname, "..", "db.json")
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      sdk,
      userId: req.headers.authorization
    })
  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

run();
