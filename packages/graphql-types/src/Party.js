import { gql } from "./utils";

import Account from "./Account";
import Address from "./Address";
import RootMutation from "./Mutation";

const Party = gql`
  # The Party defines all the fields necessary to define a person or organization related to a financial institution.
  interface Party {
    id: ID!
    accounts: [Account]
    address: Address
    mailingAddress: Address
  }

  type Person implements Party {
    id: ID!
    accounts: [Account]
    address: Address
    mailingAddress: Address
    firstName: String!
    lastName: String!
  }

  type Organization implements Party {
    id: ID!
    accounts: [Account]
    address: Address
    mailingAddress: Address
    name: String!
  }

  extend type RootMutation {
    # Update the address associated with the current user
    updateAddress(type: String, address: AddressInput!): Address

    # Update the address for a specific party
    updatePartyAddress(
      partyId: ID!
      type: String
      address: AddressInput!
    ): Address
  }
`;

export default () => [Account, Address, Party, RootMutation];
