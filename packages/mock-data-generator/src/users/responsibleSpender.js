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
 * - Pay the mortgage (external FI)
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
  subMonths,
  startOfMonth,
  addMonths,
  addDays,
  getDaysInMonth,
  parse,
  format,
  addMilliseconds
} from "date-fns";

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

const getSignedTransactionAmount = transaction =>
  transaction.type === "credit" ? transaction.amount : -1 * transaction.amount;

// Hackish way to set the time based on a string like 23:00 or 10:00
const setTime = (date, time) => {
  const formatted = format(date);
  const newDate = formatted.replace(/T(.*)-/, `T${time}-`);
  return parse(newDate);
};

// Remove additional precision. These are not audited financial statements.
// Give us a break.
const toFixed = (num, fixed) => parseFloat(num.toFixed(fixed));

const transactionReducer = (acc, transaction) => {
  const transAmount = toFixed(getSignedTransactionAmount(transaction), 2);

  const balance = toFixed(acc.balance + transAmount, 2);

  let date = addDays(acc.initialDate, transaction.date - 1); // Dates are 1-indexed

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

  const updatedTransaction = R.merge(transaction, {
    id: uuid.v4(),
    date,
    amount: Math.abs(transAmount),
    balance
  });

  return R.evolve(
    {
      transactions: R.append(R.omit(["time"], updatedTransaction)),
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

const addNewTransactions = (transactions, initialDate) => account => {
  const transactionsWithBalances = R.pipe(
    sortByDate,
    R.reduce(transactionReducer, {
      balance: account.balance,
      initialDate,
      transactions: []
    })
  )(transactions);

  return R.evolve(
    {
      balance: R.always(transactionsWithBalances.balance),
      transactions: R.concat(R.__, transactionsWithBalances.transactions)
    },
    account
  );
};

const monthlyTransactionBuilder = ({
  budget,
  context,
  monthlySalary,
  targetCheckingBalance,
  initialDate
}) => (acc, index) => {
  const currentMonth = addMonths(initialDate, index);

  const paycheck = monthlySalary / 2;

  const paychecks = R.map(
    date => ({
      description: context.employer.name,
      date,
      time: "9:00",
      amount: paycheck,
      type: "credit",
      category: categories.income
    }),
    [1, 15]
  );

  const mortgage = {
    description: context.mortgage.name,
    date: randomDate(4, 3),
    amount: monthlySalary * budget.mortgage,
    type: "debit",
    category: categories.housing
  };

  const creditCard = {
    description: context.creditCard.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.creditCard,
    type: "debit",
    category: categories.debt
  };

  const autoLoan = {
    description: context.autoLoan.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.autoLoan,
    type: "debit",
    category: categories.debt
  };

  const insurance = {
    description: context.insurance.name,
    date: randomDate(5, 3),
    amount: monthlySalary * budget.insurance,
    type: "debit",
    category: categories.insurance
  };

  // Consider adding a seasonal variance
  const electricBill = {
    description: context.electric.name,
    date: randomDate(5, 3),
    amount: monthlySalary * randomBudgetAmount(budget.electric),
    type: "debit",
    category: categories.utilities
  };

  const phoneBill = {
    description: context.phoneBill.name,
    date: randomDate(21, 3),
    amount: monthlySalary * randomBudgetAmount(budget.phoneBill),
    type: "debit",
    category: categories.utilities
  };

  const cableBill = {
    description: context.cableBill.name,
    date: randomDate(7, 3),
    amount: monthlySalary * randomBudgetAmount(budget.cableBill),
    type: "debit",
    category: categories.utilities
  };

  const gasBill = {
    description: context.gas.name,
    date: randomDate(25, 3),
    amount: monthlySalary * randomBudgetAmount(budget.gas),
    type: "debit",
    category: categories.utilities
  };

  const waterBill = {
    description: context.water.name,
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
    mortgage,
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

  if (totalCheckingAccountBalance > targetCheckingBalance) {
    const maxTransfer = totalCheckingAccountBalance - targetCheckingBalance;

    const transfer = {
      date: getDaysInMonth(currentMonth),
      time: "11:00",
      amount: randomAmount(maxTransfer * 0.85, maxTransfer, 1),
      category: categories.transfer
    };

    checkingTransactions = R.append(
      R.merge(
        {
          description: "Transfer to savings",
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

  return R.evolve(
    {
      accounts: {
        checking: addNewTransactions(checkingTransactions, currentMonth),
        savings: addNewTransactions(savingsTransactions, currentMonth)
      }
    },
    acc
  );
};

export default ({
  accounts,
  months = 12,
  targetCheckingBalance = 500
} = {}) => {
  const annualSalary = randomAmount(40000, 100000);
  const monthlySalary = toFixed(annualSalary / 12, 2);

  const context = {
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
      context,
      monthlySalary,
      targetCheckingBalance,
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
        }
      }
    },
    R.range(1, months + 1)
  );

  return R.evolve({
    accounts: R.map(
      R.evolve({
        transactions: sortByDescendingDate
      })
    )
  })(accountData);
};
