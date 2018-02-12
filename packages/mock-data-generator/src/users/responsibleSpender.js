/**
 * This user has a regular salary and generally spends within their budget.
 *
 * They get paid on the 1st and 15th of the month and pay their mortgage within
 * the first ~5 days of the month. Their electric bill is paid within the first
 * pay period and other utilities are paid during the second pay period.
 *
 * This user buys groceries 4 times per month, roughly every week.
 *
 * First paycheck:
 * - Deposit paycheck
 * - Pay the mortgage (at FI)
 * - Pay electric bill
 * - Pay cable bill
 * - Buy groceries
 * - Pays insurance
 * - Restaurants, discretionary spending
 *
 * Second paycheck:
 * - Deposit paycheck
 * - Pay car loan
 * - Pay credit card
 * - Pay other utilties (water, phone and gas)
 * - Buy groceries
 * - Restaurants, discretionary spending
 * - Transfer to savings account (same FI)
 *
 * TODO:
 * - Service charge or interest
 * - Pharmacy/medical
 * - Check deposits
 * - Savings contribution
 * - Car payment
 */

import faker from "faker";

import {
  addDays,
  addMilliseconds,
  addMonths,
  format,
  getDaysInMonth,
  isBefore,
  isPast,
  isThisMonth,
  parse,
  startOfMonth,
  subMonths,
  differenceInCalendarMonths
} from "date-fns";

import amortize from "amortize";

import R from "ramda";
import uuid from "uuid";

import * as merchants from "../merchants";
import { categories } from "../merchants";

const mapIndexed = R.addIndex(R.map);

const sortByDate = R.sort(R.ascend(R.prop("date")));

const sortByDescendingDate = R.sort(R.descend(R.prop("date")));

const randomAmount = (min, max, precision = 0.01) =>
  faker.random.number({
    min,
    max,
    precision
  });

const randomDate = (date, maxDelta) =>
  faker.random.number({
    min: date - maxDelta,
    max: date + maxDelta
  });

const randomBudgetAmount = (budget, maxVariance = 0.5) =>
  faker.random.number({
    min: budget * (1 - maxVariance),
    max: budget * (1 + maxVariance),
    precision: 0.0001
  });

const getSignedTransactionAmount = ({ amount, type, isLoan }) =>
  type === (isLoan ? "debit" : "credit") ? amount : -1 * amount;

// Hackish way to set the time based on a string like 23:00 or 10:00
const setTime = (date, time) => {
  const formatted = format(date);
  const newDate = formatted.replace(/T(.*)-/, `T${time}-`);
  return parse(newDate);
};

const isLoanAccount = R.pipe(
  R.prop("type"),
  R.contains(R.__, ["CREDIT_CARD", "LINE_OF_CREDIT", "LOAN"])
);

// Remove additional precision. These are not audited financial statements.
// Give us a break.
const toFixed = (num, fixed) => parseFloat(num.toFixed(fixed));

const addTransactionDate = initialDate => transaction => {
  let date = addDays(initialDate, transaction.date - 1); // Dates are 1-indexed

  if (transaction.time) {
    date = setTime(date, transaction.time);
  } else {
    date = addMilliseconds(
      date,
      faker.random.number({
        min: 1000 * 60 * 60 * 12, // after noon
        max: 1000 * 60 * 60 * 20 // before 8 pm
      })
    );
  }

  return R.pipe(R.assoc("date", date), R.dissoc("time"))(transaction);
};

const transactionReducer = (acc, transaction) => {
  const { isLoan } = acc;

  const transAmount = toFixed(
    getSignedTransactionAmount({
      amount: transaction.amount,
      type: transaction.type,
      isLoan
    }),
    2
  );

  const principalAmount = toFixed(
    getSignedTransactionAmount({
      amount: transaction.principal || transaction.amount,
      type: transaction.type,
      isLoan
    }),
    2
  );

  const balance = toFixed(acc.balance + principalAmount, 2);

  const updatedTransaction = R.merge(transaction, {
    id: uuid.v4(),
    amount: Math.abs(transAmount),
    balance
  });

  return R.evolve(
    {
      transactions: R.append(updatedTransaction),
      balance: R.always(balance)
    },
    acc
  );
};

const splitBudget = (timesToSplit, budget) => {
  const evenSplit = budget / timesToSplit;

  return R.times(() => randomBudgetAmount(evenSplit), timesToSplit);
};

const splitDates = times => {
  const split = 28 / times;
  const variance = split / 2;

  return R.times(
    index => randomDate(index * split + variance, variance),
    times
  );
};

const now = new Date();

const addNewTransactions = (transactions, initialDate) => account => {
  let sortedTransactions = R.pipe(
    R.map(addTransactionDate(initialDate)),
    sortByDate
  )(transactions);

  if (isThisMonth(initialDate)) {
    const cutoff = addDays(new Date(), 3);

    sortedTransactions = R.pipe(
      R.filter(transaction =>
        isBefore(transaction.date, transaction.nonPending ? now : cutoff)
      ),
      R.map(
        transaction =>
          isPast(transaction.date)
            ? transaction
            : R.assoc("pending", true, transaction)
      )
    )(sortedTransactions);
  }

  const transactionsWithBalances = R.reduce(
    transactionReducer,
    {
      balance: account.balance,
      isLoan: isLoanAccount(account),
      initialDate,
      transactions: []
    },
    sortedTransactions
  );

  return R.evolve(
    {
      balance: R.always(transactionsWithBalances.balance),
      transactions: R.concat(R.__, transactionsWithBalances.transactions)
    },
    account
  );
};

const buildLoanPayment = (account, transaction) => {
  const paymentDetails = amortize({
    amount: account.balance,
    rate: account.apr * 100,
    totalTerm: account.paymentsRemaining,
    amortizeTerm: 1
  });

  return R.merge(transaction, {
    amount: paymentDetails.payment,
    principal: paymentDetails.principal,
    interest: paymentDetails.interest,
    type: "credit"
  });
};

const buildOpenLoanInterestTransaction = (account, transaction) =>
  R.merge(transaction, {
    amount: account.balance * account.apr / 12,
    type: "debit"
  });

const monthlyTransactionBuilder = ({
  budget,
  regularProviders,
  monthlySalary,
  targetCheckingBalance,
  minSavingsBalance,
  targetSavingsBalance,
  initialDate
}) => (acc, index) => {
  const currentMonth = addMonths(initialDate, index);

  const paycheck = monthlySalary / 2;

  const paychecks = R.map(
    date => ({
      description: regularProviders.employer.name,
      date,
      time: "9:00",
      amount: paycheck,
      type: "credit",
      category: categories.income
    }),
    [1, 15]
  );

  const mortgage = {
    description: regularProviders.mortgage.name,
    date: randomDate(4, 3),
    amount: monthlySalary * budget.mortgage,
    type: "debit",
    category: categories.housing
  };

  const creditCard = {
    description: regularProviders.creditCard.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.creditCard,
    type: "debit",
    category: categories.debt
  };

  const autoLoan = {
    description: regularProviders.autoLoan.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.autoLoan,
    type: "debit",
    category: categories.debt
  };

  const insurance = {
    description: regularProviders.insurance.name,
    date: randomDate(5, 3),
    amount: monthlySalary * budget.insurance,
    type: "debit",
    category: categories.insurance
  };

  // Consider adding a seasonal variance
  const electricBill = {
    description: regularProviders.electric.name,
    date: randomDate(5, 3),
    amount: monthlySalary * randomBudgetAmount(budget.electric),
    type: "debit",
    category: categories.utilities
  };

  const phoneBill = {
    description: regularProviders.phoneBill.name,
    date: randomDate(21, 3),
    amount: monthlySalary * randomBudgetAmount(budget.phoneBill),
    type: "debit",
    category: categories.utilities
  };

  const cableBill = {
    description: regularProviders.cableBill.name,
    date: randomDate(7, 3),
    amount: monthlySalary * randomBudgetAmount(budget.cableBill),
    type: "debit",
    category: categories.utilities
  };

  const gasBill = {
    description: regularProviders.gas.name,
    date: randomDate(25, 3),
    amount: monthlySalary * randomBudgetAmount(budget.gas),
    type: "debit",
    category: categories.utilities
  };

  const waterBill = {
    description: regularProviders.water.name,
    date: randomDate(20, 3),
    amount: monthlySalary * randomBudgetAmount(budget.water),
    type: "debit",
    category: categories.utilities
  };

  const createRandomTransactions = ({
    count,
    budgetAmount,
    merchants,
    category,
    type = "debit"
  }) =>
    mapIndexed((date, index) => {
      const merchant = faker.random.arrayElement(merchants);

      return {
        description: merchant.name,
        date: randomDate(date, 3),
        amount: monthlySalary * randomBudgetAmount(budgetAmount / count),
        type,
        category: category || merchant.category,
        merchant
      };
    }, splitDates(count));

  const groceries = createRandomTransactions({
    count: 4,
    budgetAmount: budget.groceries,
    category: categories.groceries,
    merchants: merchants.groceryStores
  });

  const dining = createRandomTransactions({
    count: faker.random.number({
      min: 15,
      max: 30
    }),
    budgetAmount: budget.dining,
    category: categories.dining,
    merchants: merchants.restaurants
  });

  const miscellaneous = createRandomTransactions({
    count: faker.random.number({
      min: 10,
      max: 20
    }),
    budgetAmount: budget.miscellaneous,
    merchants: merchants.miscellaneous
  });

  let checkingTransactions = R.flatten([
    paychecks,
    // mortgage,
    creditCard,
    autoLoan,
    cableBill,
    insurance,
    electricBill,
    gasBill,
    phoneBill,
    waterBill,
    groceries,
    dining,
    miscellaneous
  ]);

  const totalCheckingAccountBalance = R.pipe(
    R.map(getSignedTransactionAmount),
    R.sum,
    R.add(acc.accounts.checking.balance)
  )(checkingTransactions);

  let savingsTransactions = [
    {
      description: "Interest",
      date: getDaysInMonth(currentMonth),
      time: "23:59",
      amount: acc.accounts.savings.balance * acc.accounts.savings.apy / 12,
      category: categories.interest,
      type: "credit"
    }
  ];

  let moneyMarketTransactions = [
    {
      description: "Interest",
      date: getDaysInMonth(currentMonth),
      time: "23:59",
      amount:
        acc.accounts.moneyMarket.balance * acc.accounts.moneyMarket.apy / 12,
      category: categories.interest,
      type: "credit"
    }
  ];

  let autoLoanTransactions = [];

  if (acc.accounts.autoLoan.balance > 0) {
    const payment = buildLoanPayment(acc.accounts.autoLoan, {
      description: "Auto Loan Payment",
      date: 15,
      time: "23:59",
      category: categories.debt
    });

    checkingTransactions = R.append(
      R.merge(
        {
          type: "debit"
        },
        payment
      )
    )(checkingTransactions);

    autoLoanTransactions = [payment];
  }

  let mortgageTransactions = [];

  if (acc.accounts.mortgage.balance > 0) {
    const payment = buildLoanPayment(acc.accounts.mortgage, {
      description: "Mortgage Payment",
      date: 1,
      time: "23:59",
      category: categories.debt
    });

    checkingTransactions = R.append(
      R.merge(
        {
          type: "debit"
        },
        payment
      )
    )(checkingTransactions);

    mortgageTransactions = [payment];
  }

  let lineOfCreditTransactions = [];

  if (acc.accounts.lineOfCredit.balance > 0) {
    const interestTransaction = buildOpenLoanInterestTransaction(
      acc.accounts.lineOfCredit,
      {
        description: "Interest",
        date: getDaysInMonth(currentMonth),
        time: "23:59",
        category: categories.interest
      }
    );

    const payment = {
      amount: acc.accounts.lineOfCredit.balance * 0.03,
      description: "Line of Credit Payment",
      date: getDaysInMonth(currentMonth),
      time: "23:00",
      category: categories.debt,
      type: "credit"
    };

    checkingTransactions = R.append(
      R.merge(
        {
          type: "debit"
        },
        payment
      )
    )(checkingTransactions);

    lineOfCreditTransactions = [interestTransaction, payment];
  }

  let creditCardTransactions = [];

  if (acc.accounts.creditCard.balance > 0) {
    const interestTransaction = buildOpenLoanInterestTransaction(
      acc.accounts.creditCard,
      {
        description: "Interest",
        date: getDaysInMonth(currentMonth),
        time: "23:59",
        category: categories.interest
      }
    );

    const payment = {
      amount: acc.accounts.creditCard.balance * 0.03,
      description: "Credit Card Payment",
      date: getDaysInMonth(currentMonth),
      time: "23:00",
      category: categories.debt,
      type: "credit"
    };

    checkingTransactions = R.append(
      R.merge(
        {
          type: "debit"
        },
        payment
      )
    )(checkingTransactions);

    creditCardTransactions = [interestTransaction, payment];
  }

  if (totalCheckingAccountBalance > targetCheckingBalance) {
    const maxTransfer = totalCheckingAccountBalance - targetCheckingBalance;

    const transfer = {
      date: getDaysInMonth(currentMonth),
      time: "11:00",
      amount: randomAmount(maxTransfer * 0.95, maxTransfer, 1),
      category: categories.transfer,
      nonPending: true
    };

    checkingTransactions = R.append(
      R.merge(
        {
          description: "Transfer to Savings",
          type: "debit"
        },
        transfer
      )
    )(checkingTransactions);

    savingsTransactions = R.append(
      R.merge(
        {
          description: "Transfer from checking",
          type: "credit"
        },
        transfer
      )
    )(savingsTransactions);
  }

  const totalSavingsAccountBalance = R.pipe(
    R.map(getSignedTransactionAmount),
    R.sum,
    R.add(acc.accounts.savings.balance)
  )(savingsTransactions);

  if (totalSavingsAccountBalance > targetSavingsBalance) {
    const maxTransfer = totalSavingsAccountBalance - minSavingsBalance;

    const transfer = {
      date: getDaysInMonth(currentMonth),
      time: "11:30",
      amount: randomAmount(maxTransfer * 0.85, maxTransfer, 1),
      category: categories.transfer,
      nonPending: true
    };

    savingsTransactions = R.append(
      R.merge(
        {
          description: "Transfer to money market",
          type: "debit"
        },
        transfer
      )
    )(savingsTransactions);

    moneyMarketTransactions = R.append(
      R.merge(
        {
          description: "Transfer from savings",
          type: "credit"
        },
        transfer
      )
    )(moneyMarketTransactions);
  }

  return R.evolve(
    {
      accounts: {
        checking: addNewTransactions(checkingTransactions, currentMonth),
        savings: addNewTransactions(savingsTransactions, currentMonth),
        moneyMarket: addNewTransactions(moneyMarketTransactions, currentMonth),
        autoLoan: R.pipe(
          addNewTransactions(autoLoanTransactions, currentMonth),
          R.evolve({
            paymentsRemaining: R.add(-1)
          })
        ),
        mortgage: R.pipe(
          addNewTransactions(mortgageTransactions, currentMonth),
          R.evolve({
            paymentsRemaining: R.add(-1)
          })
        ),
        lineOfCredit: addNewTransactions(
          lineOfCreditTransactions,
          currentMonth
        ),
        creditCard: addNewTransactions(creditCardTransactions, currentMonth)
      }
    },
    acc
  );
};

const createRandomLoanTerm = ({ account, apr, balance, months, terms }) => {
  const term = account.term || faker.random.arrayElement(terms);

  let originationDate = account.originationDate;
  let paymentsRemaining;
  let paymentsCompleted;

  if (originationDate) {
    paymentsCompleted = differenceInCalendarMonths(new Date(), originationDate);
    paymentsRemaining = term - paymentsCompleted;
  } else {
    paymentsRemaining = randomAmount(0, term, 1);
    paymentsCompleted = term - paymentsRemaining;
    originationDate = subMonths(new Date(), term - paymentsRemaining);
  }

  const amortizedPaymentsCompleted = amortize({
    amount: balance,
    rate: apr * 100,
    totalTerm: term,
    amortizeTerm: paymentsCompleted
  });

  return {
    balance: amortizedPaymentsCompleted.balance,
    apr,
    originationDate,
    paymentsRemaining
  };
};

const createLoan = ({ accounts, months }, key, defaults) =>
  R.merge(
    {
      transactions: [],
      type: "LOAN",
      secured: defaults.secured
    },
    createRandomLoanTerm({
      balance: R.pathOr(defaults.balance, [key, "initialBalance"], accounts),
      apr: R.pathOr(defaults.apr, [key, "apr"], accounts),
      account: R.propOr({}, key, accounts),
      months,
      terms: defaults.terms
    })
  );

const createOpenLoan = ({ accounts, months }, key, defaults) => ({
  transactions: [],
  balance: R.pathOr(defaults.balance, [key, "initialBalance"], accounts),
  limit: R.pathOr(defaults.limit, [key, "limit"], accounts),
  apr: R.pathOr(defaults.apr, [key, "apr"], accounts),
  type: defaults.type,
  secured: defaults.secured
});

const calculateInterest = (total, months, ratePercent) => {
  const interestRate = ratePercent / 100 + 1;
  return total * Math.pow(interestRate, months / 12);
};

const createRandomCertificateTerm = ({
  account,
  apy,
  balance,
  months,
  terms
}) => {
  const term = account.term || faker.random.arrayElement(terms);

  let originationDate = account.originationDate;
  let monthsRemaining;
  let monthsCompleted;

  if (originationDate) {
    monthsCompleted = differenceInCalendarMonths(new Date(), originationDate);
    monthsRemaining = term - monthsCompleted;
  } else {
    monthsRemaining = randomAmount(0, term, 1);
    monthsCompleted = term - monthsRemaining;
    originationDate = subMonths(new Date(), term - monthsRemaining);
  }

  const interestPaid = calculateInterest(balance, monthsCompleted, apy);

  return {
    balance: balance + interestPaid,
    apy,
    originationDate,
    monthsRemaining
  };
};

const createCertificate = ({ accounts, months }, key, defaults) =>
  R.merge(
    {
      transactions: [],
      type: "CERTIFICATE"
    },
    createRandomCertificateTerm({
      balance: R.pathOr(defaults.balance, [key, "initialBalance"], accounts),
      apy: R.pathOr(defaults.apy, [key, "apy"], accounts),
      account: R.propOr({}, key, accounts),
      months,
      terms: defaults.terms
    })
  );

const createInvestment = ({ accounts, months }, key, defaults) => ({
  transactions: [],
  type: "INVESTMENT",
  balance: R.pathOr(defaults.balance, [key, "initialBalance"], accounts),
  averageReturn: R.pathOr(
    defaults.averageReturn,
    [key, "averageReturn"],
    accounts
  ),
  account: R.propOr({}, key, accounts),
  months
});

export default ({
  accounts,
  months = 12,
  targetCheckingBalance = 500,
  minSavingsBalance = 2000,
  targetSavingsBalance = 10000
} = {}) => {
  const annualSalary = randomAmount(40000, 100000);
  const monthlySalary = toFixed(annualSalary / 12, 2);

  const regularProviders = {
    mortgage: faker.random.arrayElement(merchants.mortgageCompanies),
    employer: faker.random.arrayElement(merchants.employers),
    creditCard: faker.random.arrayElement(merchants.creditCards),
    autoLoan: faker.random.arrayElement(merchants.autoLenders),
    cableBill: faker.random.arrayElement(merchants.cableCompanies),
    phoneBill: faker.random.arrayElement(merchants.phoneCompanies),
    insurance: faker.random.arrayElement(merchants.insuranceCompanies),
    electric: faker.random.arrayElement(merchants.electricCompanies),
    gas: faker.random.arrayElement(merchants.gasCompanies),
    water: faker.random.arrayElement(merchants.waterCompanies)
  };

  const initialDate = subMonths(startOfMonth(new Date()), months);

  const getTotalPending = R.pipe(
    R.filter(R.propEq("pending", true)),
    R.map(getSignedTransactionAmount),
    R.sum
  );

  const budget = {
    mortgage: 0.25,
    creditCard: 0.03,
    cableBill: 0.025,
    autoLoan: 0.1,
    insurance: 0.0125,
    groceries: 0.1,
    dining: 0.1,
    electric: 0.0375,
    phoneBill: 0.025,
    gas: 0.01825,
    water: 0.00725,
    miscellaneous: 0.05
  };

  const accountData = R.reduce(
    monthlyTransactionBuilder({
      budget,
      regularProviders,
      monthlySalary,
      targetCheckingBalance,
      minSavingsBalance,
      targetSavingsBalance,
      initialDate
    }),
    {
      accounts: {
        checking: {
          balance: R.pathOr(10, ["checking", "initialBalance"], accounts),
          transactions: []
        },
        savings: {
          balance: R.pathOr(10, ["savings", "initialBalance"], accounts),
          apy: R.pathOr(0.0025, ["savings", "apy"], accounts),
          transactions: []
        },
        moneyMarket: {
          balance: R.pathOr(10, ["moneyMarket", "initialBalance"], accounts),
          apy: R.pathOr(0.011, ["moneyMarket", "apy"], accounts),
          transactions: []
        },
        autoLoan: createLoan({ accounts, months }, "autoLoan", {
          balance: randomAmount(10000, 40000),
          apr: 0.0575,
          terms: [36, 48, 60],
          secured: true
        }),
        mortgage: createLoan({ accounts, months }, "mortgage", {
          balance: randomAmount(150000, 400000),
          apr: 0.0375,
          terms: [180, 360],
          secured: true
        }),
        lineOfCredit: createOpenLoan({ accounts, months }, "lineOfCredit", {
          limit: 10000,
          balance: randomAmount(3000, 10000),
          apr: 0.0875,
          type: "LINE_OF_CREDIT",
          secured: false
        }),
        creditCard: createOpenLoan({ accounts, months }, "creditCard", {
          limit: 15000,
          balance: randomAmount(1000, 15000),
          apr: 0.1975,
          type: "CREDIT_CARD",
          secured: false
        }),
        shareCertificate: createCertificate(
          { accounts, months },
          "shareCertificate",
          {
            balance: 25000,
            apy: 0.0125,
            terms: [30, 36, 48, 60]
          }
        ),
        investment: createInvestment({ accounts, months }, "investment", {
          balance: randomAmount(25000, 150000),
          averageReturn: 0.1
        })
      }
    },
    R.range(1, months + 1)
  );

  const user = R.evolve({
    accounts: R.map(account => {
      const transactions = sortByDescendingDate(account.transactions);

      const nextPayment =
        transactions.length && account.apr && account.balance > 0
          ? {
              nextDueDate: addMonths(transactions[0].date, 1),
              amount: Math.min(transactions[0].amount, account.balance)
            }
          : undefined;

      let actualBalance = account.balance;
      let availableBalance = account.balance;

      switch (account.type) {
        case "LOAN":
          availableBalance = 0;
          break;
        case "LINE_OF_CREDIT":
        case "CREDIT_CARD":
          availableBalance = account.limit - account.balance;
          break;
        default:
          actualBalance =
            account.balance - getTotalPending(account.transactions);
      }

      return R.merge(account, {
        id: uuid.v4(),
        actualBalance,
        availableBalance,
        nextPayment,
        transactions
      });
    })
  })(accountData);

  return R.merge(user, {
    id: uuid.v4()
  });
};
