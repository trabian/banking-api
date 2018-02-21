import { gql } from "./utils";

import Transaction from "./Transaction";

const AccountType = gql`
  enum AccountType {
    CHECKING
    SAVINGS
    LOAN
    CREDIT_CARD
    LINE_OF_CREDIT
    MORTGAGE
    INVESTMENT
    PRE_PAID_CARD
    CERTIFICATE
  }
`;

const Account = gql`
  interface Account {
    # The account ID is a persistent and unique identifier for the account.
    # It must be unique for all users across the institution and remain the
    # same over the life of the account.
    id: ID!

    # The account number (or a masked portion there-of) will be displayed to the
    # user. Like the ID, it must be unique for all users across the institution
    # and remain the same over the life of the account. It may contain a prefix to
    # define the Account Type for consumption, such as SV-1234 or IL-1234.
    accountNumber: String

    # The account name is the textual representation of the account. This
    # value is visible to the user and must be human-readable.
    name: String

    type: AccountType

    # Negative, zero or positive amount. If this is a loan, any balance owed to
    # the financial institution will show as a positive amount. If this is a
    # deposit product, if the product is overdrawn it will be a negative amount.
    # Positive is assumed if the sign does not appear in the data.
    actualBalance: Float

    # Negative, zero or positive amount. If this is a loan, any balance owed
    # to the financial institution will show as a positive amount. If this is
    # a deposit product, if the product is overdrawn it will be a negative amount.
    # Positive is assumed if the sign does not appear in the data.
    availableBalance: Float

    # The transactions for this account
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!
  }
`;

const InterestBearingAccount = gql`
  interface InterestBearingAccount {
    apy: Float
  }
`;

const CheckingAccount = gql`
  type CheckingAccount implements Account, InterestBearingAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!
    apy: Float
  }
`;

const SavingsAccount = gql`
  type SavingsAccount implements Account, InterestBearingAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!

    # Number of remaining transactions according to Reg D
    regDRemaining: Int

    apy: Float
  }
`;

const CertificateAccount = gql`
  type CertificateAccount implements Account, InterestBearingAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!

    apy: Float
  }
`;

const InvestmentAccount = gql`
  type InvestmentAccount implements Account {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!
  }
`;

const LoanPayment = gql`
  type LoanPayment {
    nextDueDate: Date
    amount: Float
  }
`;

const AbstractLoanAccount = gql`
  interface AbstractLoanAccount {
    apr: Float
    nextPayment: LoanPayment
    originationDate: Date
    payoff: Float
    secured: Boolean
  }
`;

const LoanAccount = gql`
  type LoanAccount implements Account, AbstractLoanAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!

    apr: Float
    nextPayment: LoanPayment
    originationDate: Date
    secured: Boolean
    payoff: Float
  }
`;

const OpenLoanAccount = gql`
  interface OpenLoanAccount {
    limit: Float
  }
`;

const LineOfCreditAccount = gql`
  type LineOfCreditAccount implements Account, AbstractLoanAccount, OpenLoanAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!

    apr: Float
    nextPayment: LoanPayment
    limit: Float
    secured: Boolean
    originationDate: Date
    payoff: Float
  }
`;

const CreditCardAccount = gql`
  type CreditCardAccount implements Account, AbstractLoanAccount, OpenLoanAccount {
    id: ID!
    accountNumber: String
    name: String
    type: AccountType
    actualBalance: Float
    availableBalance: Float
    routingNumber: String
    transactions(
      limit: Int = 10
      categoryId: ID
      query: String
    ): [Transaction!]!

    apr: Float
    nextPayment: LoanPayment
    limit: Float
    secured: Boolean
    originationDate: Date
    payoff: Float
  }
`;

export default () => [
  Account,
  InterestBearingAccount,
  AccountType,
  CertificateAccount,
  InvestmentAccount,
  CheckingAccount,
  CreditCardAccount,
  SavingsAccount,
  AbstractLoanAccount,
  LoanAccount,
  LineOfCreditAccount,
  LoanPayment,
  OpenLoanAccount,
  Transaction
];
