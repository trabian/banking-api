import R from "ramda";

import { convertToEnum } from "./utils";

export const resolvers = {
  Address: {
    type: convertToEnum,
  },
  ContactAddress: {
    type: convertToEnum,
  },
  Contact: {
    __resolveType: obj =>
      R.prop(obj.type, {
        address: "ContactAddress",
      }),
  },
  RootMutation: {
    updateContact: (root, { id, address }, { sdk }) => {
      return sdk.updateContact(id, { address });
    },
  },
};
