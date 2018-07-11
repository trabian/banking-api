import bankingTypes from "@trabian/banking-graphql-types";

import { gql } from "./utils";

const devExtensions = gql`
  extend type Query {
    users: [User]
  }

  extend type Mutation {
    createUser(months: Int, routingNumber: String, reset: Boolean): User!
  }
`;

export default [devExtensions, bankingTypes];
