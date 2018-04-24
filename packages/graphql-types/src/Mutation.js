import { gql } from "./utils";

const RootMutation = gql`
  type RootMutation {
    # Placeholder for now
    transfer(amount: Float): String
  }
`;

export default RootMutation;
