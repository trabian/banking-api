import typeDefs from "@trabian-banking/graphql-types";

import R from "ramda";

import uuid from "uuid";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import matchSorter from "match-sorter";

import { getAccountForUser, getCategoryForUser } from "./accounts";

import { store, createMockUsers } from "./state";

import { getAccountsForUser } from "./state/accounts";

createMockUsers(store, { count: 5 });

console.warn("state", store.getState());

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
    transactions: ({ transactions }, { limit, categoryId, query }) =>
      R.pipe(
        R.unless(
          () => R.isNil(categoryId),
          R.filter(R.pathEq(["category", "id"], categoryId))
        ),
        R.unless(
          () => R.isNil(query),
          transactions =>
            matchSorter(transactions, query, {
              keys: ["description"]
            })
        ),
        R.take(limit)
      )(transactions || [])
  },
  Transaction: {
    type: R.pipe(R.prop("type"), R.toUpper),
    status: ({ pending }) => (pending ? "PENDING" : "POSTED")
  },
  RootQuery: {
    account: (obj, { id: accountId }, { user: { id: userId } }) =>
      getAccountForUser(userId, accountId),
    category: (obj, { id: categoryId }, { user: { id: userId } }) =>
      categoryId && getCategoryForUser(userId, categoryId),
    me: (obj, args, { user: { id } }) => ({
      accounts: getAccountsForUser(id, store.getState())
    })
  }
};

export { resolvers, typeDefs };
