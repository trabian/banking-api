import { gql } from "./utils";

const Node = gql`
  interface Node {
    id: ID!
  }

  extend type RootQuery {
    node(id: ID!, type: String!): Node
  }
`;

export default Node;
