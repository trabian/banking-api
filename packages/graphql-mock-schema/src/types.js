import bankingTypes from "@trabian/banking-graphql-types";

import { gql } from "./utils";

const mutations = gql`
  extend type RootMutation {
    createUser: User!
  }
`;

export default [mutations, ...bankingTypes];
