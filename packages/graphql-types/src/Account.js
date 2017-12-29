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
  }
`;

const Account = gql`
  type Account {
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

export default () => [Account, AccountType, Transaction];
