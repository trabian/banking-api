import R from "ramda";
import uuid from "uuid";

import {
  responsibleSpender,
  categories
} from "@trabian-banking/mock-data-generator";

const responsibleSpenderAccounts = responsibleSpender({
  months: 60,
  targetCheckingBalance: 100
}).accounts;

const accounts = [
  R.merge(
    {
      id: uuid.v4(),
      name: "Primary Checking",
      type: "CHECKING",
      accountNumber: "21341234",
      userId: "responsible-spender"
    },
    responsibleSpenderAccounts.checking
  ),
  R.merge(
    {
      id: uuid.v4(),
      name: "Savings",
      type: "SAVINGS",
      accountNumber: "21343456",
      userId: "responsible-spender"
    },
    responsibleSpenderAccounts.savings
  ),
  R.merge(
    {
      id: uuid.v4(),
      name: "Money Market",
      type: "SAVINGS",
      accountNumber: "21343801",
      userId: "responsible-spender"
    },
    responsibleSpenderAccounts.moneyMarket
  ),
  {
    id: uuid.v4(),
    name: "Primary Savings",
    type: "SAVINGS",
    accountNumber: "23223142",
    availableBalance: 10,
    userId: "2345"
  }
];

export const getAccountsForUser = userId =>
  R.filter(R.propEq("userId", userId), accounts);

// Real version would verify the account belongs to the user.
export const getAccountForUser = (userId, accountId) =>
  R.find(R.propEq("id", accountId), accounts);

// Real version would include categories customized by the user
export const getCategoryForUser = (userId, categoryId) =>
  R.find(R.propEq("id", categoryId), R.values(categories));
