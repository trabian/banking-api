import R from "ramda";

export const find = (tableName, filterFn = R.identity) => {
  return ({ db }) => (...args) => db(tableName)(filterFn(...args));
};
