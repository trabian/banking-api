import bankingTypes from "@trabian/banking-graphql-types";

// import { gql } from "./utils";

import gql from "graphql-tag";

export const devTypeDefs = gql`
  extend type Query {
    users: [User]
  }

  extend type Mutation {
    userCreate(months: Int, routingNumber: String, reset: Boolean): User!
  }
`;

export default [devTypeDefs, bankingTypes];
