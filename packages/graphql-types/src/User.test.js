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
    Address: {
      type: ({ type }) => type.toUpperCase()
    },
    Contact: {
      contactPoint: ({ contactPoint, type }) => ({
        ...contactPoint,
        type
      })
    },
    ContactAddress: {
      type: ({ type }) => type.toUpperCase()
    },
    ContactPoint: {
      __resolveType: (obj, context, info) => {
        return {
          address: "ContactAddress"
        }[obj.type];
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

  it("should provide contacts for a party", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          me {
            id
            party {
              contacts {
                id
                contactPoint {
                  type
                  ... on ContactAddress {
                    address {
                      type
                      street1
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        id: "1",
        party: {
          firstName: "Matt",
          contacts: [
            {
              id: "contact--1",
              type: "address",
              contactPoint: {
                address: {
                  type: "mailing",
                  street1: "555 Test Street"
                }
              }
            }
          ]
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.me).toEqual({
      id: "1",
      party: {
        contacts: [
          {
            id: "contact--1",
            contactPoint: {
              type: "ADDRESS",
              address: {
                type: "MAILING",
                street1: "555 Test Street"
              }
            }
          }
        ]
      }
    });
  });
});
