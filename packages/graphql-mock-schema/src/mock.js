import R from "ramda";

import faker from "faker";

import { responsibleSpender } from "@trabian/banking-mock-data-generator";

const createPerson = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: {
    street1: faker.address.streetAddress(),
    street2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    zipCode: faker.address.zipCode(),
  },
});

export const createMockUser = ({
  months = 10,
  routingNumber = "01231234",
} = {}) =>
  R.pipe(
    responsibleSpender,
    R.evolve({
      accounts: {
        checking: R.merge({
          name: "Primary Checking",
          type: "CHECKING",
          routingNumber,
          accountNumber: faker.finance.account(7),
        }),
        savings: R.merge({
          name: "Savings",
          type: "SAVINGS",
          regDRemaining: 6,
          routingNumber,
          accountNumber: faker.finance.account(7),
        }),
        moneyMarket: R.merge({
          name: "Money Market",
          type: "SAVINGS",
          routingNumber,
          accountNumber: faker.finance.account(7),
        }),
        autoLoan: R.merge({
          name: "Auto Loan",
          accountNumber: faker.finance.account(7),
        }),
        mortgage: R.merge({
          name: "Mortgage",
          accountNumber: faker.finance.account(7),
        }),
        lineOfCredit: R.merge({
          name: "Line of Credit",
          accountNumber: faker.finance.account(7),
        }),
        creditCard: R.merge({
          name: "Visa",
          accountNumber: faker.finance.account(7),
        }),
        shareCertificate: R.merge({
          name: "Share Certificate",
          accountNumber: faker.finance.account(7),
        }),
        investment: R.merge({
          name: "Roth IRA",
          accountNumber: faker.finance.account(7),
        }),
      },
    }),
    R.merge(createPerson())
  )({
    months,
    targetCheckingBalance: faker.random.number({
      min: 100,
      max: 5000,
    }),
  });
