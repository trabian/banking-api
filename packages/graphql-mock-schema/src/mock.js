import R from "ramda";

import faker from "faker";

import { responsibleSpender } from "@trabian/banking-mock-data-generator";

export const createMockUser = ({ months = 10 } = {}) =>
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
          regDRemaining: 6,
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
    months,
    targetCheckingBalance: faker.random.number({
      min: 100,
      max: 5000
    })
  });
