import { gql } from "./utils";
// import Contact from "./Contact";

import typeDefs from "./index.js";

import { graphql, GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { makeExecutableSchema } from "graphql-tools";

const toEnum = (obj, _params, _root, { fieldName }) =>
  obj[fieldName].toUpperCase();

const resolveContactType = ({ type }, _params, _root) =>
  ({
    address: "ContactAddress",
    phone: "ContactPhone",
    email: "ContactEmail"
  }[type]);

describe("Contact schema", () => {
  const resolvers = {
    Date: new GraphQLScalarType({
      name: "Date",
      description: "Date custom scalar type as String",
      parseValue(value) {
        return value;
      },
      serialize(value) {
        return value;
      },
      parseLiteral(ast) {
        return ast.value;
      }
    }),
    Node: {
      __resolveType: () => "Contact"
    },
    Address: {
      type: toEnum
    },
    Contact: {
      type: toEnum,
      contactPoint: ({ contactPoint, type }) => ({
        ...contactPoint,
        type
      })
    },
    ContactAddress: {
      type: toEnum
    },
    ContactEmail: {
      type: toEnum,
      emailType: toEnum
    },
    ContactPhone: {
      type: toEnum,
      phoneType: toEnum
    },
    ContactPoint: {
      __resolveType: resolveContactType
    },
    RootQuery: {
      node: root => root
    }
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  it("should be available via the `node` query", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          node(id: "1", type: "Contact") {
            ... on Contact {
              id
            }
          }
        }
      `,
      {
        id: "1",
        type: "address"
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.node).toEqual({
      id: "1"
    });
  });

  it("should provide address details when type is 'address'", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          node(id: "1", type: "Contact") {
            ... on Contact {
              id
              type
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
      `,
      {
        id: "contact-1",
        type: "address",
        contactPoint: {
          address: {
            type: "mailing",
            street1: "555 Test Street"
          }
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.node).toEqual({
      id: "contact-1",
      type: "ADDRESS",
      contactPoint: {
        type: "ADDRESS",
        address: {
          type: "MAILING",
          street1: "555 Test Street"
        }
      }
    });
  });

  it("should be provide phone details when type is 'phone'", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          node(id: "1", type: "Contact") {
            ... on Contact {
              id
              contactPoint {
                ... on ContactPhone {
                  type
                  phoneType
                  number
                }
              }
            }
          }
        }
      `,
      {
        id: "contact-1",
        type: "phone",
        contactPoint: {
          phoneType: "mobile",
          number: "2145550001"
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.node).toEqual({
      id: "contact-1",
      contactPoint: {
        type: "PHONE",
        phoneType: "MOBILE",
        number: "2145550001"
      }
    });
  });

  it("should be provide email details when type is 'email'", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          node(id: "1", type: "Contact") {
            ... on Contact {
              id
              contactPoint {
                ... on ContactEmail {
                  type
                  emailType
                  emailAddress
                }
              }
            }
          }
        }
      `,
      {
        id: "contact-1",
        type: "email",
        contactPoint: {
          emailType: "home",
          emailAddress: "test@example.com"
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.node).toEqual({
      id: "contact-1",
      contactPoint: {
        type: "EMAIL",
        emailType: "HOME",
        emailAddress: "test@example.com"
      }
    });
  });

  it("should be able to report demonstrated access", async () => {
    const result = await graphql(
      schema,
      gql`
        query {
          node(id: "1", type: "Contact") {
            ... on Contact {
              id
              demonstratedAccess {
                userId
                dateTime
              }
            }
          }
        }
      `,
      {
        id: "contact-1",
        type: "email",
        demonstratedAccess: {
          userId: "2",
          dateTime: "20180101"
        }
      }
    );

    expect(result.errors).toBeFalsy();

    expect(result.data.node).toEqual({
      id: "contact-1",
      demonstratedAccess: {
        userId: "2",
        dateTime: "20180101"
      }
    });
  });
});
