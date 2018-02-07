import { schema } from "normalizr";

const categorySchema = new schema.Entity("categories");

export const transactionSchema = new schema.Entity(
  "transactions",
  {
    category: categorySchema
  },
  {
    processStrategy: (value, parent) => ({
      accountId: parent.id,
      ...value
    })
  }
);

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
