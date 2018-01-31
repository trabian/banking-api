import R from "ramda";

import faker from "faker";

import { responsibleSpender } from "@trabian/banking-mock-data-generator";

export const createMockUser = () =>
  R.pipe(
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
