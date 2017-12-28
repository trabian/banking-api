import R from "ramda";
import uuid from "uuid";

import { responsibleSpender } from "@trabian-banking/mock-data-generator";

const responsibleSpenderAccounts = responsibleSpender({
  months: 60,
  targetCheckingBalance: 1000
}).accounts;

const accounts = [
  {
    id: uuid.v4(),
    name: "Primary Checking",
    type: "CHECKING",
    availableBalance: responsibleSpenderAccounts.checking.balance,
    transactions: responsibleSpenderAccounts.checking.transactions,
    userId: "responsible-spender"
  },
  {
    id: uuid.v4(),
    name: "Savings",
    type: "SAVINGS",
    availableBalance: responsibleSpenderAccounts.savings.balance,
    transactions: responsibleSpenderAccounts.savings.transactions,
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

export const getAccountsForUser = userId =>
  R.filter(R.propEq("userId", userId), accounts);

// Real version would verify the account belongs to the user.
export const getAccountForUser = (userId, accountId) =>
  R.find(R.propEq("id", accountId), accounts);
