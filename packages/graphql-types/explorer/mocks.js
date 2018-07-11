const { MockList } = require("apollo-server");

const sample = require("lodash.sample");

const interfaceResolvers = {
  __resolveType(data) {
    return data.__typename;
  },
};

exports.typeResolvers = {
  Account: interfaceResolvers,
  AbstractLoanAccount: interfaceResolvers,
  InterestBearingAccount: interfaceResolvers,
  OpenLoanAccount: interfaceResolvers,
  ContactPoint: interfaceResolvers,
  Node: interfaceResolvers,
  Party: interfaceResolvers,
};

exports.mocks = {
  Account: () => ({
    __typename: sample([
      "CheckingAccount",
      "SavingsAccount",
      "CertificateAccount",
      "InvestmentAccount",
      "LoanAccount",
      "LineOfCreditAccount",
      "CreditCardAccount",
    ]),
  }),
  AbstractLoanAccount: () => ({
    __typename: sample([
      "LoanAccount",
      "LineOfCreditAccount",
      "CreditCardAccount",
    ]),
  }),
  InterestBearingAccount: () => ({
    __typename: sample([
      "CheckingAccount",
      "SavingsAccount",
      "CertificateAccount",
    ]),
  }),
  OpenLoanAccount: () => ({
    __typename: sample(["LineOfCreditAccount", "CreditCardAccount"]),
  }),
  ContactPoint: () =>
    sample([
      {
        type: "PHONE",
        __typename: "ContactPhone",
      },
      {
        type: "EMAIL",
        __typename: "ContactEmail",
      },
      {
        type: "ADDRESS",
        __typename: "ContactAddress",
      },
    ]),
  Node: () => ({
    __typename: sample(["Contact"]),
  }),
  Party: () => ({
    __typename: sample(["Person", "Organization"]),
  }),
  User: () => ({
    accounts: () => new MockList([5, 15]),
  }),
};
