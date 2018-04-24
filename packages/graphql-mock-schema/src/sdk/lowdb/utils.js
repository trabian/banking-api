import R from "ramda";

// Creates a curried finder based on the table name
export const createFinder = (tableName, filterFn = R.identity) => {
  return ({ db }) => async (...args) => db(tableName)(filterFn(...args));
};

export const createUpdater = (tableName, updateFn = R.identity) => {
  return ({ db }) => async (id, ...args) => {
    const updateMatchingRecord = R.map(
      R.when(R.propEq("id", id), updateFn(...args))
    );
    return db(tableName).write(updateMatchingRecord);
  };
};
