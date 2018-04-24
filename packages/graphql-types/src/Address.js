import { gql } from "./utils";

const Address = gql`
  input AddressInput {
    street1: String!
    street2: String
    city: String!
    state: String!
    zipCode: String!
  }

  type Address {
    street1: String!
    street2: String
    city: String!
    state: String!
    zipCode: String!
  }
`;

export default () => [Address];
