import R from "ramda";
import uuid from "uuid";

import { combineReducers } from "redux";

const user = (state, action) => {
  switch (action.type) {
    case "ADD_USER":
      return action.user;
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return R.assoc(action.id, user(state[action.id], action), state);
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return R.append(action.id, state);
    default:
      return state;
  }
};

const users = combineReducers({
  byId,
  allIds
});

export default users;
