import Account from "./Account";

const RootQuery = `
  type RootQuery {
    account(id: ID!): Account
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default [SchemaDefinition, RootQuery, Account];
