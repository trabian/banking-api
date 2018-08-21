import R from "ramda";

// Creates a curried finder based on the table name
export const createFinder = (tableName, filterFn = R.identity) => {
  return ({ db }) => async (...args) => db(tableName)(filterFn(...args));
};

export const createUpdater = (tableName, updateFn = R.identity) => {
  return ({ db }) => async (id, ...args) => {
    const matcher = R.propEq("id", id);

    const updateMatchingRecord = R.map(R.when(matcher, updateFn(...args)));

    const _db = db(tableName);

    await _db.write(updateMatchingRecord);

    return _db(R.find(matcher));
  };
};
