import bankingTypes from "@trabian/banking-graphql-types";

import { gql } from "./utils";

const mutations = gql`
  extend type RootMutation {
    createUser(months: Int, routingNumber: String): User!
  }
`;

export default [mutations, ...bankingTypes];
