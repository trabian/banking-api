const addressUpdate = async (sdk, userId, { address, type = "primary" }) => {
  await sdk.updatePartyAddress(userId, { address, type });
  const user = await sdk.getUser(userId);

  const addressProp = type === "primary" ? "address" : `${type}Address`;

  return user[addressProp];
};

export const resolvers = {
  Party: {
    __resolveType: obj => {
      if (obj.firstName) {
        return "Person";
      }

      if (obj.name) {
        return "Organization";
      }
    },
  },
  Person: {
    contacts: ({ id }, _params, { sdk }) => sdk.getContactsForUser(id),
  },
  Mutation: {
    addressUpdate: async (_root, params, { sdk, userId }) =>
      addressUpdate(sdk, userId, params),
    partyAddressUpdate: async (_root, { partyId, ...params }, { sdk }) =>
      addressUpdate(sdk, partyId, params),
  },
};
