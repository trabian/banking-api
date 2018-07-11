import { gql } from "./utils";

const User = gql`
  type User {
    # The user ID is persistent and unique across the institution and remains the
    # same over the life of the user.
    id: ID!

    accounts: [Account]

    party: Party
  }
`;

export default User;
