import R from "ramda";

import { createFinder } from "./utils";

export const getAccount = createFinder("accounts", (id, context) =>
  R.pipe(
    R.find(R.propEq("id", id)),
    R.unless(R.propEq("userId", context.userId), () => {
      throw "This is not your account.";
    })
  )
);

export const getAccounts = createFinder("accounts", ids => accounts =>
  R.map(id => R.find(R.propEq("id", id), accounts), ids)
);

export const getAccountsForUser = createFinder("accounts", userId =>
  R.filter(R.propEq("userId", userId))
);
