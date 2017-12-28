import typeDefs from "@trabian-banking/graphql-types";

import R from "ramda";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import { getAccountForUser, getAccountsForUser } from "./accounts";

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),
  Account: {
    transactions: ({ transactions }, { limit }) => {
      return R.take(limit, transactions || []);
    }
  },
  Transaction: {
    type: R.pipe(R.prop("type"), R.toUpper)
  },
  RootQuery: {
    account: (obj, { id: accountId }, { user: { id: userId } }) =>
      getAccountForUser(userId, accountId),
    me: (obj, args, { user: { id } }) => ({
      accounts: getAccountsForUser(id)
    })
  }
};

const accounts = getAccountsForUser("responsible-spender");

export { resolvers, typeDefs };
