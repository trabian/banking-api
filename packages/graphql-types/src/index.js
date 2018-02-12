import { gql } from "./utils";

import Account from "./Account";
import DateScalar from "./Date";
import Transaction, { Category } from "./Transaction";
import User from "./User";

const RootQuery = gql`
  type RootQuery {
    me: User
    category(id: ID): Category
    account(id: ID!): Account
    transaction(id: ID!): Transaction

    # This is helpful during development and would not be resolved
    # in a production environment.
    users: [User]
  }
`;

const RootMutation = gql`
  type RootMutation {
    # Placeholder for now
    transfer(amount: Float): String
  }
`;

const Schema = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default [
  Schema,
  RootQuery,
  RootMutation,
  Account,
  DateScalar,
  Transaction,
  User
];
