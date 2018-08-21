import R from "ramda";

import parse from "date-fns/parse";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import { resolvers as contactResolvers } from "./contacts";
import { resolvers as partyResolvers } from "./parties";
import { resolvers as userResolvers } from "./users";

const accountResolvers = {
  transactions: async ({ id }, { limit, categoryId, query }, { sdk }) =>
    sdk.getTransactionsForAccount(id, {
      limit,
      categoryId,
      query,
    }),
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
    },
  }),
  Account: {
    __resolveType: obj =>
      R.prop(obj.type && obj.type.toLowerCase(), {
        checking: "CheckingAccount",
        credit_card: "CreditCardAccount",
        investment: "InvestmentAccount",
        savings: "SavingsAccount",
        loan: "LoanAccount",
        line_of_credit: "LineOfCreditAccount",
        certificate: "CertificateAccount",
      }),
  },
  CertificateAccount: accountResolvers,
  CheckingAccount: accountResolvers,
  CreditCardAccount: accountResolvers,
  InvestmentAccount: accountResolvers,
  LoanAccount: accountResolvers,
  SavingsAccount: accountResolvers,
  LineOfCreditAccount: accountResolvers,
  Transaction: {
    type: R.pipe(
      R.prop("type"),
      R.toUpper
    ),
    status: ({ pending }) => (pending ? "PENDING" : "POSTED"),
    account: ({ accountId }, _params, { loaders }) =>
      accountId && loaders.accounts.load(accountId),
    category: ({ category }, _params, { loaders }) =>
      category && loaders.categories.load(category),
  },

  Query: {
    account: (_root, { id }, { sdk, ...context }) =>
      sdk.getAccount(id, context),
    category: (_root, { id }, { loaders }) => id && loaders.categories.load(id),
    transaction: (_root, { id }, { sdk, ...context }) =>
      sdk.getTransaction(id, context),
  },
  Mutation: {},
};

export default R.pipe(
  R.mergeDeepLeft(contactResolvers),
  R.mergeDeepLeft(partyResolvers),
  R.mergeDeepLeft(userResolvers)
)(resolvers);
