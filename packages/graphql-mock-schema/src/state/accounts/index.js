import R from "ramda";
import uuid from "uuid";

import { combineReducers } from "redux";

const account = (state, action) => {
  switch (action.type) {
    case "ADD_ACCOUNT":
      return action.account;
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_ACCOUNT":
      return R.assoc(action.id, account(state[action.id], action), state);
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case "ADD_ACCOUNT":
      return R.append(action.id, state);
    default:
      return state;
  }
};

const accounts = combineReducers({
  byId,
  allIds
});

export default accounts;
