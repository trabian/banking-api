import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import { addInterfacesToTypes } from '../src';

import { graphql } from 'graphql';

describe('addInterfacesToTypes', () => {
  it('should add interfaces to existing types', async () => {
    const typeDefs = gql`
      interface SomeInterface {
        someField: String!
      }

      interface SomeIdInterface {
        id: ID!
      }

      type SomeType implements SomeIdInterface {
        id: ID! # Placeholder
        someField: String!
      }

      type Query {
        something: SomeType
      }
    `;

    const transformedTypeDefs = addInterfacesToTypes(typeDefs, {
      interfaces: ['SomeInterface'],
      types: ['SomeType'],
    });

    const schema = makeExecutableSchema({
      typeDefs: transformedTypeDefs,
      resolvers: {
        SomeType: {
          someField: () => 'Yay.',
        },
        Query: {
          something: () => ({
            id: 'test',
          }),
        },
      },
    });

    const query = `
      query TestQuery {
        something {
          id
          ...SomeFieldFragment
        }
      }
      fragment SomeFieldFragment on SomeInterface {
        someField
      }
    `;

    const response = await graphql(schema, query);

    expect(response.data!.something.someField).toEqual('Yay.');
  });
});
