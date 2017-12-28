'use strict';

// gql is a nice hint to editors and prettier, but we don't really want to parse the graphql schema.
var gql = function gql(str) {
  return str[0];
};

var _templateObject$3 = _taggedTemplateLiteral$3(["\n  scalar Date\n"], ["\n  scalar Date\n"]);

function _taggedTemplateLiteral$3(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Date = gql(_templateObject$3);

var Date$1 = (function () {
  return [Date];
});

var _templateObject$2 = _taggedTemplateLiteral$2(["\n  type Merchant {\n    id: ID!\n    name: String!\n  }\n"], ["\n  type Merchant {\n    id: ID!\n    name: String!\n  }\n"]);
var _templateObject2$2 = _taggedTemplateLiteral$2(["\n  enum TransactionType {\n    CREDIT\n    DEBIT\n  }\n"], ["\n  enum TransactionType {\n    CREDIT\n    DEBIT\n  }\n"]);
var _templateObject3$1 = _taggedTemplateLiteral$2(["\n  type Message {\n    messageMarkdown: String\n    url: String\n  }\n"], ["\n  type Message {\n    messageMarkdown: String\n    url: String\n  }\n"]);
var _templateObject4 = _taggedTemplateLiteral$2(["\n  type Transaction {\n    # The transaction ID is a persistent and unique identifier for each\n    # transaction. It must be unique within the account as it is used for matching\n    # purposes. Transactions should always be returned with the same ID, even if\n    # transactional information has changed (type, amount, description, date,\n    # etc.) since the previous account data pull.\n    id: ID!\n\n    # The date/time posted is the date the transaction was posted to the account.\n    # If this date is unavailable, it is acceptable to use the date that the\n    # transaction took place\n    date: Date!\n\n    # The description represents the memo of the transaction.\n    description: String!\n\n    # The transaction amount should always be the absolute value of the\n    # transaction. The sign of the amount will be determined based on the\n    # transaction type.\n    amount: Float!\n\n    # The transaction type simply reflects whether the account was debited or\n    # credited. For comment-only transactions, the value can be either Debit or\n    # Credit and the transaction amount can be null, not return or 0.00.\n    type: TransactionType!\n\n    # The running balance of this transaction's account.\n    balance: Float\n\n    category: String\n\n    merchant: Merchant\n\n    message: Message\n  }\n"], ["\n  type Transaction {\n    # The transaction ID is a persistent and unique identifier for each\n    # transaction. It must be unique within the account as it is used for matching\n    # purposes. Transactions should always be returned with the same ID, even if\n    # transactional information has changed (type, amount, description, date,\n    # etc.) since the previous account data pull.\n    id: ID!\n\n    # The date/time posted is the date the transaction was posted to the account.\n    # If this date is unavailable, it is acceptable to use the date that the\n    # transaction took place\n    date: Date!\n\n    # The description represents the memo of the transaction.\n    description: String!\n\n    # The transaction amount should always be the absolute value of the\n    # transaction. The sign of the amount will be determined based on the\n    # transaction type.\n    amount: Float!\n\n    # The transaction type simply reflects whether the account was debited or\n    # credited. For comment-only transactions, the value can be either Debit or\n    # Credit and the transaction amount can be null, not return or 0.00.\n    type: TransactionType!\n\n    # The running balance of this transaction's account.\n    balance: Float\n\n    category: String\n\n    merchant: Merchant\n\n    message: Message\n  }\n"]);

function _taggedTemplateLiteral$2(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Merchant = gql(_templateObject$2);

var TransactionType = gql(_templateObject2$2);

var Message = gql(_templateObject3$1);

var Transaction = gql(_templateObject4);

var Transaction$1 = (function () {
  return [Date$1, Transaction, TransactionType, Merchant, Message];
});

var _templateObject$1 = _taggedTemplateLiteral$1(["\n  enum AccountType {\n    CHECKING\n    SAVINGS\n    LOAN\n    CREDIT_CARD\n    LINE_OF_CREDIT\n    MORTGAGE\n    INVESTMENT\n    PRE_PAID_CARD\n  }\n"], ["\n  enum AccountType {\n    CHECKING\n    SAVINGS\n    LOAN\n    CREDIT_CARD\n    LINE_OF_CREDIT\n    MORTGAGE\n    INVESTMENT\n    PRE_PAID_CARD\n  }\n"]);
var _templateObject2$1 = _taggedTemplateLiteral$1(["\n  type Account {\n    # The account ID is a persistent and unique identifier for the account.\n    # It must be unique for all users across the institution and remain the\n    # same over the life of the account.\n    id: ID!\n\n    # The account name is the textual representation of the account. This\n    # value is visible to the user and must be human-readable.\n    name: String\n\n    type: AccountType\n\n    # Negative, zero or positive amount. If this is a loan, any balance owed\n    # to the financial institution will show as a positive amount. If this is\n    # a deposit product, if the product is overdrawn it will be a negative amount.\n    # Positive is assumed if the sign does not appear in the data.\n    availableBalance: Float\n\n    # The transactions for this account\n    transactions(limit: Int = 10): [Transaction!]!\n  }\n"], ["\n  type Account {\n    # The account ID is a persistent and unique identifier for the account.\n    # It must be unique for all users across the institution and remain the\n    # same over the life of the account.\n    id: ID!\n\n    # The account name is the textual representation of the account. This\n    # value is visible to the user and must be human-readable.\n    name: String\n\n    type: AccountType\n\n    # Negative, zero or positive amount. If this is a loan, any balance owed\n    # to the financial institution will show as a positive amount. If this is\n    # a deposit product, if the product is overdrawn it will be a negative amount.\n    # Positive is assumed if the sign does not appear in the data.\n    availableBalance: Float\n\n    # The transactions for this account\n    transactions(limit: Int = 10): [Transaction!]!\n  }\n"]);

function _taggedTemplateLiteral$1(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AccountType = gql(_templateObject$1);

var Account = gql(_templateObject2$1);

var Account$1 = (function () {
  return [Account, AccountType, Transaction$1];
});

var _templateObject$4 = _taggedTemplateLiteral$4(["\n  type User {\n    # The user ID is persistent and unique across the institution and remains the\n    # same over the life of the user.\n    id: ID!\n\n    accounts: [Account]\n  }\n"], ["\n  type User {\n    # The user ID is persistent and unique across the institution and remains the\n    # same over the life of the user.\n    id: ID!\n\n    accounts: [Account]\n  }\n"]);

function _taggedTemplateLiteral$4(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var User = gql(_templateObject$4);

var User$1 = (function () {
  return [Account$1, User];
});

var _templateObject = _taggedTemplateLiteral(["\n  input TransferInput {\n    toAccountId: ID!\n    fromAccountId: ID!\n    amount: Float!\n    message: String\n    scheduledDate: Date\n  }\n  \n  mutation createTransfer(transfer: TransferInput!): TransferConfirmation\n"], ["\n  input TransferInput {\n    toAccountId: ID!\n    fromAccountId: ID!\n    amount: Float!\n    message: String\n    scheduledDate: Date\n  }\n  \n  mutation createTransfer(transfer: TransferInput!): TransferConfirmation\n"]);
var _templateObject2 = _taggedTemplateLiteral(["\n  type RootQuery {\n    me: User\n    account(id: ID!): Account\n  }\n"], ["\n  type RootQuery {\n    me: User\n    account(id: ID!): Account\n  }\n"]);
var _templateObject3 = _taggedTemplateLiteral(["\n  schema {\n    query: RootQuery\n  }\n"], ["\n  schema {\n    query: RootQuery\n  }\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TransferMutation = gql(_templateObject);

var RootQuery = gql(_templateObject2);

var Schema = gql(_templateObject3);

var index = [Schema, RootQuery, Account$1, Date$1, Transaction$1, User$1];

module.exports = index;
