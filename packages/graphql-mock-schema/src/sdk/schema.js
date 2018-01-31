import { schema } from "normalizr";

export const transactionSchema = new schema.Entity("transactions", undefined, {
  processStrategy: (value, parent) => ({
    accountId: parent.id,
    ...value
  })
});

export const accountSchema = new schema.Entity(
  "accounts",
  {
    transactions: [transactionSchema]
  },
  {
    processStrategy: (value, parent) => ({
      userId: parent.id,
      ...value
    })
  }
);

export const userSchema = new schema.Entity("users", {
  accounts: [accountSchema]
});
