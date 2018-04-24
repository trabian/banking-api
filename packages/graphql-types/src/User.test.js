import { gql } from "./utils";
import User from "./User";

import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

describe("User schema", () => {
  const Query = gql`
    type Query {
      me: User
    }
  `;

  const typeDefs = [User, Query];

  const resolvers = {
    Account: {
      __resolveType: (obj, context, info) => {
        switch (obj.type) {
          case "loan":
            return "LoanAccount";
          default:
            return "CheckingAccount";
        }
      }
    },
    Party: {
      __resolveType: (obj, context, info) => {
        if (obj.firstName) {
          return "Person";
        }

        if (obj.name) {
          return "Organization";
        }
      }
    },
    Query: {
      me: root => root
    }
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  it("should provide party information for a person", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          me {
            id
            party {
              id
              accounts {
                id
              }
              ... on Person {
                firstName
              }
            }
          }
        }
      `,
      {
        id: "1",
        party: {
          id: "person-1",
          firstName: "Jane",
          accounts: [
            {
              id: "account-1"
            }
          ]
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.me).toEqual({
      id: "1",
      party: {
        id: "person-1",
        firstName: "Jane",
        accounts: [{ id: "account-1" }]
      }
    });
  });

  it("should provide party information for an organization", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          me {
            id
            party {
              ... on Organization {
                name
              }
            }
          }
        }
      `,
      {
        id: "1",
        party: {
          name: "Trabian"
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.me).toEqual({
      id: "1",
      party: {
        name: "Trabian"
      }
    });
  });

  it("should provide an address for a party", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          me {
            id
            party {
              address {
                street1
              }
            }
          }
        }
      `,
      {
        id: "1",
        party: {
          firstName: "Matt",
          address: {
            street1: "555 Test Street"
          }
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.me).toEqual({
      id: "1",
      party: {
        address: {
          street1: "555 Test Street"
        }
      }
    });
  });
});
