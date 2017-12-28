import { gql } from "./utils";

const Date = gql`
  scalar Date
`;

export default () => [Date];
