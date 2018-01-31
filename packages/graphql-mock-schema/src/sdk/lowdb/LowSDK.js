import R from "ramda";
import low from "lowdb/lib/fp";
import MemoryAdapter from "lowdb/adapters/Memory";
import { normalize } from "normalizr";

import { createMockUser } from "../../mock";
import { userSchema } from "./schema";
import matchSorter from "match-sorter";

class LowSDK {
  constructor({
    defaultValue = { accounts: [], transactions: [], users: [] },
    adapter
  } = {}) {
    // The db will be a promise for async resolvers.
    this.db = Promise.resolve(
      low(
        adapter ||
          new MemoryAdapter(undefined, {
            defaultValue
          })
      )
    );
  }

  getCurrentUser = async ({ userId }) => {
    const db = await this.db;
    return db("users")(R.find(R.propEq("id", userId)));
  };

  createUser = async () => {
    const db = await this.db;
    const user = createMockUser();

    const normalized = normalize(user, userSchema);

    const promises = R.pipe(
      R.mapObjIndexed(async (vals, key) => {
        return await db(key).write(R.pipe(R.values, R.concat)(vals));
      }),
      R.values()
    )(normalized.entities);

    await Promise.all(promises);

    return user;
  };

  getAccount = async (id, context) => {
    const db = await this.db;
    return db("accounts")(
      R.pipe(
        R.find(R.propEq("id", id)),
        R.unless(R.propEq("userId", context.userId), () => {
          throw "This is not your account.";
        })
      )
    );
  };

  getAccounts = async ids => {
    const db = await this.db;
    return db("accounts")(accounts =>
      R.map(id => R.find(R.propEq("id", id), accounts), ids)
    );
  };

  getAccountsForUser = async userId => {
    const db = await this.db;
    return db("accounts")(R.filter(R.propEq("userId", userId)));
  };

  getTransactionsForAccount = async (
    accountId,
    { categoryId, limit, query }
  ) => {
    const db = await this.db;
    return db("transactions")(
      R.pipe(
        R.filter(R.propEq("accountId", accountId)),
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
      )
    );
  };

  getUsers = async () => {
    const db = await this.db;
    return db("users")(R.identity);
  };
}

export default LowSDK;
