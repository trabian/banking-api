import typeDefs from "@trabian-banking/graphql-types";

import { makeExecutableSchema } from "graphql-tools";

const resolvers = {};

export default makeExecutableSchema({ typeDefs, resolvers });
