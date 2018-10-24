import R from "ramda";

export const resolvers = {
  User: {
    accounts: ({ id }, _params, { sdk }) => sdk.getAccountsForUser(id),
    party: R.pick(["id", "firstName", "lastName", "address", "mailingAddress"]),
  },
  Query: {
    users: (_root, _params, { sdk }) => sdk.getUsers(),
    me: (_root, _params, { sdk, userId }) => sdk.getUser(userId),
  },
  Mutation: {
    userCreate: (_root, params, { sdk }) => sdk.createUser(params),
  },
};
