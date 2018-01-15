import typeDefs from "@trabian/banking-graphql-types";

import R from "ramda";

import uuid from "uuid";

import DataLoader from "dataloader";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import matchSorter from "match-sorter";

import { getAccountForUser, getCategoryForUser } from "./accounts";

import { store } from "./state";

import { createMockUsers } from "./mock";

import loki from "lokijs";

export const db = new loki("data.db");

// TODO: Make sure these are coming back in order by the `ids` parameter
const accountLoader = new DataLoader(ids =>
  Promise.resolve(db.getCollection("accounts").find({ id: { $in: ids } }))
);

R.forEach(collection => db.addCollection(collection), [
  "accounts",
  "categories",
  "transactions",
  "users"
]);

createMockUsers(db, { count: 5 });

const getUserId = ctx =>
  R.path(["user", "id"], ctx) || db.getCollection("users").findOne().id;

const resolvers = {
  User: {
    accounts: (_root, _params, { sdk }) => sdk.getAccounts()
  },
  RootQuery: {
    account: (_root, { id }, { sdk }) => sdk.getAccount(id),
    me: (_root, _params, { sdk }) => sdk.getCurrentUser()
  }
};

const oldResolvers = {
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
    transactions: ({ id }, { limit, categoryId, query }) => {
      const transactions = db
        .getCollection("transactions")
        .find({ accountId: id });

      // TODO: Can/should we use the loki queries instead?
      return R.pipe(
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
      )(transactions || []);
    }
  },
  Transaction: {
    type: R.pipe(R.prop("type"), R.toUpper),
    status: ({ pending }) => (pending ? "PENDING" : "POSTED"),
    account: ({ accountId }) => accountLoader.load(accountId)
  },
  User: {
    accounts: ({ id }) => db.getCollection("accounts").find({ userId: id })
  },
  RootQuery: {
    account: (obj, { id: accountId }) => accountLoader.load(accountId),
    category: (obj, { id: categoryId }, ctx) =>
      categoryId && getCategoryForUser(getUserId(ctx), categoryId),
    me: (obj, args, ctx) =>
      db.getCollection("users").findOne({ id: getUserId(ctx) }),
    users: () => db.getCollection("users").find()
  }
};

export { resolvers, typeDefs };
