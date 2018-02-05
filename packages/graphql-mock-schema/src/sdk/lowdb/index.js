import R from "ramda";
import low from "lowdb/lib/fp";
import MemoryAdapter from "lowdb/adapters/Memory";

import * as accounts from "./accounts";
import * as transactions from "./transactions";
import * as users from "./users";

export const createSdk = async ({
  defaultValue = { accounts: [], categories: [], transactions: [], users: [] },
  adapter
} = {}) => {
  const db = await Promise.resolve(
    low(
      adapter ||
        new MemoryAdapter(undefined, {
          defaultValue
        })
    )
  );

  const sdkContext = {
    db
  };

  return R.pipe(R.mergeAll, R.map(R.applyTo(sdkContext)))([
    accounts,
    transactions,
    users
  ]);
};
