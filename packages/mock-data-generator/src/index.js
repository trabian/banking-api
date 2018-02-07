import responsibleSpender from "./users/responsibleSpender";

import { categories } from "./merchants";

import R from "ramda";

export { responsibleSpender, categories };

const user = responsibleSpender({
  months: 4
});

console.warn(
  "checking available balance",
  user.accounts.checking.availableBalance,
  user.accounts.checking.actualBalance
);
