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
  getDaysInMonth
} from "date-fns";

import R from "ramda";
import uuid from "uuid";

import * as merchants from "../merchants";

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

// Remove additional precision. These are not audited financial statements.
// Give us a break.
const toFixed = (num, fixed) => parseFloat(num.toFixed(fixed));

const transactionReducer = (acc, transaction) => {
  const transAmount = toFixed(getSignedTransactionAmount(transaction), 2);

  const balance = toFixed(acc.balance + transAmount, 2);

  const updatedTransaction = R.merge(transaction, {
    id: uuid.v4(),
    date: addDays(acc.initialDate, transaction.date - 1), // Dates are 1-indexed
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
  const days = 30;
  const split = 30 / times;
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

  const timesEatingOut = faker.random.number({
    min: 15,
    max: 30
  });

  const paycheck = monthlySalary / 2;

  const randomGroceryPercentages = splitBudget(4, budget.groceries);
  const randomDiningPercentages = splitBudget(timesEatingOut, budget.dining);

  const paychecks = R.map(
    date => ({
      description: context.employer.name,
      date,
      amount: paycheck,
      type: "credit",
      category: "income"
    }),
    [1, 15]
  );

  const mortgage = {
    description: context.mortgage.name,
    date: randomDate(4, 3),
    amount: monthlySalary * budget.mortgage,
    type: "debit",
    category: "housing"
  };

  const creditCard = {
    description: context.creditCard.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.creditCard,
    type: "debit",
    category: "debt"
  };

  const autoLoan = {
    description: context.autoLoan.name,
    date: randomDate(20, 3),
    amount: monthlySalary * budget.autoLoan,
    type: "debit",
    category: "debt"
  };

  const insurance = {
    description: context.insurance.name,
    date: randomDate(5, 3),
    amount: monthlySalary * budget.insurance,
    type: "debit",
    category: "insurance"
  };

  // Consider adding a seasonal variance
  const electricBill = {
    description: context.electric.name,
    date: randomDate(5, 3),
    amount: monthlySalary * randomBudgetAmount(budget.electric),
    type: "debit",
    category: "utilities"
  };

  const phoneBill = {
    description: context.phoneBill.name,
    date: randomDate(21, 3),
    amount: monthlySalary * randomBudgetAmount(budget.phoneBill),
    type: "debit",
    category: "utilities"
  };

  const cableBill = {
    description: context.cableBill.name,
    date: randomDate(7, 3),
    amount: monthlySalary * randomBudgetAmount(budget.cableBill),
    type: "debit",
    category: "utilities"
  };

  const gasBill = {
    description: context.gas.name,
    date: randomDate(25, 3),
    amount: monthlySalary * randomBudgetAmount(budget.gas),
    type: "debit",
    category: "utilities"
  };

  const waterBill = {
    description: context.water.name,
    date: randomDate(20, 3),
    amount: monthlySalary * randomBudgetAmount(budget.water),
    type: "debit",
    category: "utilities"
  };

  const groceries = mapIndexed((date, index) => {
    const merchant = faker.random.arrayElement(merchants.groceryStores);

    return {
      description: merchant.name,
      date: randomDate(date, 3),
      amount: monthlySalary * randomGroceryPercentages[index],
      type: "debit",
      category: "groceries",
      merchant
    };
  }, splitDates(4));

  const dining = mapIndexed(
    (date, index) => ({
      description: faker.random.arrayElement(merchants.restaurants).name,
      date: randomDate(date, 3),
      amount: monthlySalary * randomDiningPercentages[index],
      type: "debit",
      category: "dining"
    }),
    splitDates(timesEatingOut)
  );

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
    dining
  ]);

  const totalCheckingAccountBalance = R.pipe(
    R.map(getSignedTransactionAmount),
    R.sum,
    R.add(acc.accounts.checking.balance)
  )(checkingTransactions);

  let savingsTransactions = [];

  if (totalCheckingAccountBalance > targetCheckingBalance) {
    const maxTransfer = totalCheckingAccountBalance - targetCheckingBalance;

    const transfer = {
      date: getDaysInMonth(currentMonth),
      amount: randomAmount(maxTransfer * 0.85, maxTransfer, 1),
      category: "transfer"
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
    mortgage: 0.15,
    creditCard: 0.03,
    cableBill: 0.025,
    autoLoan: 0.1,
    insurance: 0.0125,
    groceries: 0.1,
    dining: 0.1,
    electric: 0.0375,
    phoneBill: 0.025,
    gas: 0.01825,
    water: 0.00725
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
