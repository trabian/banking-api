import R from "ramda";

export const find = (tableName, filterFn = R.identity) => {
  return ({ db }) => async (...args) => db(tableName)(filterFn(...args));
};
