import { gql } from "./utils";

import Account from "./Account";
import Contact from "./Contact";
import RootMutation from "./Mutation";

const Party = gql`
  # The Party defines all the fields necessary to define a person or organization related to a financial institution.
  interface Party {
    id: ID!
    accounts: [Account]
    contacts: [Contact]
  }

  type Person implements Party {
    id: ID!
    accounts: [Account]
    # List of how the person can be contacted
    contacts: [Contact]
    firstName: String!
    lastName: String!
  }

  type Organization implements Party {
    id: ID!
    accounts: [Account]
    # List of how the organization can be contacted
    contacts: [Contact]
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

export default Party;
