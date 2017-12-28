import R from "ramda";
import uuid from "uuid";

import { responsibleSpender } from "@trabian-banking/mock-data-generator";

const responsibleSpenderCheckingAccount = responsibleSpender({
  months: 60
});

const accounts = [
  {
    id: uuid.v4(),
    name: "Primary Checking",
    type: "CHECKING",
    availableBalance: responsibleSpenderCheckingAccount.balance,
    transactions: responsibleSpenderCheckingAccount.transactions,
    userId: "responsible-spender"
  },
  {
    id: uuid.v4(),
    name: "Savings",
    type: "SAVINGS",
    availableBalance: 10977.52,
    userId: "responsible-spender"
  },
  {
    id: uuid.v4(),
    name: "Primary Savings",
    type: "SAVINGS",
    availableBalance: 10,
    userId: "2345"
  }
];

export const getAccountsForUser = id =>
  R.filter(R.propEq("userId", id), accounts);
