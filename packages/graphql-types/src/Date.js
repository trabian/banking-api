import { gql } from "./utils";

const DateScalar = gql`
  scalar Date
`;

export default () => [DateScalar];
