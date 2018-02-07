import { createStore, combineReducers } from "redux";

import R from "ramda";

import faker from "faker";

import {
  responsibleSpender,
  categories
} from "@trabian/banking-mock-data-generator";

import accounts from "./accounts";
import users from "./users";

export const store = createStore(
  combineReducers({
    accounts,
    users
  })
);
