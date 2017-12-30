import { createStore, combineReducers } from "redux";

import R from "ramda";

import faker from "faker";

import {
  responsibleSpender,
  categories
} from "@trabian-banking/mock-data-generator";

import accounts from "./accounts";
import users from "./users";

export const store = createStore(
  combineReducers({
    accounts,
    users
  })
);

export const createMockUsers = (store, { count }) => {
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

    store.dispatch({
      type: "ADD_USER",
      id: user.id,
      user: {
        firstName: faker.name.firstName,
        lastName: faker.name.lastName
      }
    });

    R.forEach(account => {
      store.dispatch({
        type: "ADD_ACCOUNT",
        id: account.id,
        account
      });
    }, R.values(user.accounts));
  }, count);
};
