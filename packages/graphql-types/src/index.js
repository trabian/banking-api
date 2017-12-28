import { gql } from "./utils";

import Account from "./Account";
import Date from "./Date";
import Transaction from "./Transaction";
import User from "./User";

const TransferMutation = gql`
  input TransferInput {
    toAccountId: ID!
    fromAccountId: ID!
    amount: Float!
    message: String
    scheduledDate: Date
  }
  
  mutation createTransfer(transfer: TransferInput!): TransferConfirmation
`;

const RootQuery = gql`
  type RootQuery {
    me: User
    account(id: ID!): Account
  }
`;

const Schema = gql`
  schema {
    query: RootQuery
  }
`;

export default [Schema, RootQuery, Account, Date, Transaction, User];
