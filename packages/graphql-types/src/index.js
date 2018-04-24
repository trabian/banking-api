import { gql } from "./utils";

import Account from "./Account";
import DateScalar from "./Date";
import RootMutation from "./Mutation";
import RootQuery from "./Query";
import Transaction, { Category } from "./Transaction";
import User from "./User";

const Schema = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default [Schema, RootQuery, Account, DateScalar, Transaction, User];
