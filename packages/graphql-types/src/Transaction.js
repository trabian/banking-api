import { gql } from "./utils";

import DateScalar from "./Date";

import Account from "./Account";

export const Category = gql`
  type Category {
    id: ID!
    name: String!
  }
`;

const Merchant = gql`
  type Merchant {
    id: ID!
    name: String!
  }
`;

const TransactionStatus = gql`
  enum TransactionStatus {
    POSTED
    PENDING
    DENIED
    VOID
  }
`;

const TransactionType = gql`
  enum TransactionType {
    CREDIT
    DEBIT
  }
`;

const Message = gql`
  type Message {
    messageMarkdown: String
    url: String
  }
`;

export const Transaction = gql`
  type Transaction {
    # The transaction ID is a persistent and unique identifier for each
    # transaction. It must be unique within the account as it is used for matching
    # purposes. Transactions should always be returned with the same ID, even if
    # transactional information has changed (type, amount, description, date,
    # etc.) since the previous account data pull.
    id: ID!

    # The date/time posted is the date the transaction was posted to the account.
    # If this date is unavailable, it is acceptable to use the date that the
    # transaction took place
    date: Date!

    # The description represents the memo of the transaction.
    description: String!

    # The transaction amount should always be the absolute value of the
    # transaction. The sign of the amount will be determined based on the
    # transaction type.
    amount: Float!

    # The transaction type simply reflects whether the account was debited or
    # credited. For comment-only transactions, the value can be either Debit or
    # Credit and the transaction amount can be null, not return or 0.00.
    type: TransactionType!

    # The running balance of this transaction's account.
    balance: Float

    # The current status of the transaction. This may be part of a session or
    # after the session has ended.
    status: TransactionStatus

    category: Category

    merchant: Merchant

    message: Message

    account: Account
  }
`;

export default () => [
  DateScalar,
  Transaction,
  TransactionStatus,
  TransactionType,
  Merchant,
  Message,
  Category
];
