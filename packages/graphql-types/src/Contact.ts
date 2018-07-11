import { gql } from "./utils";

const Contact = gql`
  enum ContactType {
    ADDRESS
    PHONE
    EMAIL
  }

  interface ContactPoint {
    type: ContactType
  }

  type ContactAddress implements ContactPoint {
    type: ContactType
    address: Address
  }

  enum PhoneType {
    HOME
    WORK
    MOBILE
    PAGER
    FAX
    OTHER
  }

  type ContactPhone implements ContactPoint {
    type: ContactType
    phoneType: PhoneType!
    number: String!
    extension: String
    description: String
    # Phone number is registered to receive SMS messages.
    smsRegistered: Boolean
  }

  enum EmailType {
    HOME
    WORK
    OTHER
  }

  type ContactEmail implements ContactPoint {
    type: ContactType
    emailType: EmailType!
    emailAddress: String!
  }

  # This identifies that appropriate access has been demonstrated to receive information
  # electronically for the associated contact point.
  type DemonstratedAccess {
    dateTime: Date!
    userId: ID!
  }

  type Contact implements Node {
    id: ID!
    type: ContactType
    contactPoint: ContactPoint!
    demonstratedAccess: DemonstratedAccess
  }

  extend type RootMutation {
    updateContact(id: ID!, address: AddressInput): Contact
  }
`;

export default Contact;