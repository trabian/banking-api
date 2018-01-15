import R from "ramda";

import faker from "faker";

import { responsibleSpender } from "@trabian/banking-mock-data-generator";

export const createMockUsers = (db, { count }) => {
  const accountsColl = db.getCollection("accounts");
  const usersColl = db.getCollection("users");
  const transactionsColl = db.getCollection("transactions");

  R.times(() => {
    const user = R.pipe(
      responsibleSpender,
      R.evolve({
        accounts: {
          checking: R.merge({
            name: "Primary Checking",
            type: "CHECKING",
            accountNumber: faker.finance.account(7)
          }),
          savings: R.merge({
            name: "Savings",
            type: "SAVINGS",
            accountNumber: faker.finance.account(7)
          }),
          moneyMarket: R.merge({
            name: "Money Market",
            type: "SAVINGS",
            accountNumber: faker.finance.account(7)
          })
        }
      })
    )({
      months: 60,
      targetCheckingBalance: faker.random.number({
        min: 100,
        max: 5000
      })
    });

    usersColl.insert({
      id: user.id,
      firstName: faker.name.firstName,
      lastName: faker.name.lastName
    });

    R.forEach(account => {
      const transactions = R.map(
        R.assoc("accountId", account.id),
        account.transactions
      );

      transactionsColl.insert(transactions);

      R.pipe(R.assoc("userId", user.id), R.dissoc("transactions"), acct =>
        accountsColl.insert(acct)
      )(account);
    }, R.values(user.accounts));
  }, count);
};
