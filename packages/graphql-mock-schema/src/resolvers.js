import R from "ramda";

import parse from "date-fns/parse";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const accountResolvers = {
  transactions: async ({ id }, { limit, categoryId, query }, { sdk }) =>
    sdk.getTransactionsForAccount(id, {
      limit,
      categoryId,
      query
    })
};

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return parse(value).getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),
  Account: {
    __resolveType: (obj, context, info) =>
      R.prop(obj.type && obj.type.toLowerCase(), {
        checking: "CheckingAccount",
        savings: "SavingsAccount"
      })
  },
  CheckingAccount: accountResolvers,
  Transaction: {
    type: R.pipe(R.prop("type"), R.toUpper),
    status: ({ pending }) => (pending ? "PENDING" : "POSTED"),
    account: ({ accountId }, _params, { loaders }) =>
      loaders.accounts.load(accountId)
  },
  User: {
    accounts: ({ id }, _params, { sdk }) => sdk.getAccountsForUser(id)
  },
  RootQuery: {
    account: (_root, { id }, { sdk, ...context }) =>
      sdk.getAccount(id, context),
    me: (_root, _params, { sdk, ...context }) => sdk.getCurrentUser(context),
    users: (_root, _params, { sdk }) => sdk.getUsers()
  },
  RootMutation: {
    createUser: (_root, params, { sdk }) => sdk.createUser(params)
  }
};

export default resolvers;
