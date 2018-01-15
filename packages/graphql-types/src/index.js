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

    # This is helpful during development and would not be resolved
    # in a production environment.
    users: [User]
  }
`;

const Schema = gql`
  schema {
    query: RootQuery
  }
`;

export default [Schema, RootQuery, Account, DateScalar, Transaction, User];
