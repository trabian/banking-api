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
  }
`;

const Schema = gql`
  schema {
    query: RootQuery
  }
`;

export default [Schema, RootQuery, Account, DateScalar, Transaction, User];
