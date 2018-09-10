import { ApolloServer } from "apollo-server";

import {
  typeDefs,
  resolvers,
  createMockSdk
} from "@trabian/banking-graphql-mock-schema";

export interface ServerOptions {
  dbFile: string;
}

export const createServer = async ({ dbFile }: ServerOptions): Promise<any> => {
  const sdk = await createMockSdk({
    dbFile
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: any }) => ({
      sdk,
      userId: req.headers.authorization
    })
  });

  return server;
};
