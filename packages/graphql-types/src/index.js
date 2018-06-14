import { gql } from "./utils";

import Account from "./Account";
import Address from "./Address";
import DateScalar from "./Date";
import Node from "./Node";
import Party from "./Party";
import RootMutation from "./Mutation";
import RootQuery from "./Query";
import Transaction, { Category } from "./Transaction";
import User from "./User";
import Contact from "./Contact";

const Schema = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default [
  Schema,
  Account,
  Address,
  Contact,
  DateScalar,
  Node,
  Party,
  RootQuery,
  RootMutation,
  Transaction,
  User
];
