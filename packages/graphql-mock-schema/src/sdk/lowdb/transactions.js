import R from "ramda";
import matchSorter from "match-sorter";

import { find } from "./utils";

export const getTransactionsForAccount = find(
  "transactions",
  (accountId, { categoryId, limit, query }) =>
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
