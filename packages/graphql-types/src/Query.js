import { gql } from "./utils";

const RootQuery = gql`
  type RootQuery {
    me: User
    category(id: ID): Category
    account(id: ID!): Account
    transaction(id: ID!): Transaction

    # This is helpful during development and would not be resolved
    # in a production environment.
    users: [User]
  }
`;

export default RootQuery;
