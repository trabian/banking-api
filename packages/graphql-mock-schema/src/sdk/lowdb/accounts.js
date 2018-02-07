import R from "ramda";

import { find } from "./utils";

export const getAccount = find("accounts", (id, context) =>
  R.pipe(
    R.find(R.propEq("id", id)),
    R.unless(R.propEq("userId", context.userId), () => {
      throw "This is not your account.";
    })
  )
);

export const getAccounts = find("accounts", ids => accounts =>
  R.map(id => R.find(R.propEq("id", id), accounts), ids)
);

export const getAccountsForUser = find("accounts", userId =>
  R.filter(R.propEq("userId", userId))
);
