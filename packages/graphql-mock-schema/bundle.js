'use strict';

const Account = `
  type Account {
    id: ID!
  }
`;

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

var typeDefs = [SchemaDefinition, RootQuery, Account];

console.warn("typeDefs", typeDefs);
