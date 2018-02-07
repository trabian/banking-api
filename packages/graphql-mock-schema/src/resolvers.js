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
      return undefined;
    }
  }),
  Account: {
    __resolveType: obj =>
      R.prop(obj.type && obj.type.toLowerCase(), {
        checking: "CheckingAccount",
        savings: "SavingsAccount",
        loan: "LoanAccount",
        line_of_credit: "LineOfCreditAccount"
      })
  },
  CheckingAccount: accountResolvers,
  LoanAccount: accountResolvers,
  SavingsAccount: accountResolvers,
  LineOfCreditAccount: accountResolvers,
  Transaction: {
    type: R.pipe(R.prop("type"), R.toUpper),
    status: ({ pending }) => (pending ? "PENDING" : "POSTED"),
    account: ({ accountId }, _params, { loaders }) =>
      accountId && loaders.accounts.load(accountId),
    category: ({ category }, _params, { loaders }) =>
      category && loaders.categories.load(category)
  },
  User: {
    accounts: ({ id }, _params, { sdk }) => sdk.getAccountsForUser(id)
  },
  RootQuery: {
    account: (_root, { id }, { sdk, ...context }) =>
      sdk.getAccount(id, context),
    category: (_root, { id }, { loaders }) => id && loaders.categories.load(id),
    me: (_root, _params, { sdk, ...context }) => sdk.getCurrentUser(context),
    users: (_root, _params, { sdk }) => sdk.getUsers()
  },
  RootMutation: {
    createUser: (_root, params, { sdk }) => sdk.createUser(params)
  }
};

export default resolvers;
