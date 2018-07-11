import { gql } from "./utils";

const Address = gql`
  enum AddressType {
    HOME
    MAILING
    WORK
    TEMPORARY
    PREVIOUS
  }

  input AddressInput {
    street1: String!
    street2: String
    city: String!
    state: String!
    zipCode: String!
  }

  type Address {
    type: AddressType
    street1: String!
    street2: String
    city: String!
    state: String!
    zipCode: String!
  }
`;

export default Address;
