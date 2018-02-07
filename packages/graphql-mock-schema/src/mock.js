import R from "ramda";

import faker from "faker";

import { responsibleSpender } from "@trabian/banking-mock-data-generator";

export const createMockUser = ({
  months = 10,
  routingNumber = "01231234"
} = {}) =>
  R.pipe(
    responsibleSpender,
    R.evolve({
      accounts: {
        checking: R.merge({
          name: "Primary Checking",
          type: "CHECKING",
          routingNumber,
          accountNumber: faker.finance.account(7)
        }),
        savings: R.merge({
          name: "Savings",
          type: "SAVINGS",
          regDRemaining: 6,
          routingNumber,
          accountNumber: faker.finance.account(7)
        }),
        moneyMarket: R.merge({
          name: "Money Market",
          type: "SAVINGS",
          routingNumber,
          accountNumber: faker.finance.account(7)
        }),
        autoLoan: R.merge({
          name: "Auto Loan",
          accountNumber: faker.finance.account(7)
        }),
        mortgage: R.merge({
          name: "Mortgage",
          accountNumber: faker.finance.account(7)
        }),
        lineOfCredit: R.merge({
          name: "Line of Credit",
          accountNumber: faker.finance.account(7)
        }),
        creditCard: R.merge({
          name: "Visa",
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
