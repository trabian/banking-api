import DataLoader from "dataloader";

import FileAsync from "lowdb/adapters/FileAsync";

import typeDefs from "./types";
import resolvers from "./resolvers";

import { createLowSdk } from "./sdk";

export const createLoaders = ({ sdk, userId }) => ({
  accounts: new DataLoader(ids =>
    sdk.getAccounts(ids, {
      userId
    })
  ),
  categories: new DataLoader(ids => sdk.getCategories(ids))
});

export const createMockSdk = ({
  dbFile,
  defaultValue = {
    categories: [],
    accounts: [],
    users: [],
    transactions: []
  }
}) => {
  return createLowSdk({
    adapter: new FileAsync(dbFile, {
      defaultValue
    })
  });
};

export { resolvers, typeDefs };
