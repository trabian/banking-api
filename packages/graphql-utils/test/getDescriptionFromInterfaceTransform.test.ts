import { getDescriptionFromInterfaceTransform } from '../src';
import gql from 'graphql-tag';
import { makeExecutableSchema, transformSchema } from 'graphql-tools';
import { GraphQLObjectType } from 'graphql';

const getFieldDescription = (type: GraphQLObjectType, fieldName: string) => {
  const field = type.getFields()[fieldName];

  return field && field.description;
};

describe('getDescriptionFromInterfaceTransform', () => {
  it('uses the description from an interface', () => {
    const typeDefs = gql`
      interface SomeInterface {
        """
        Description to copy.
        """
        someField: String!
      }

      interface SomeOtherInterface {
        """
        Other description to copy.
        """
        someField: String!
      }

      type SomeType implements SomeInterface {
        someField: String!
      }

      type SomeOtherType implements SomeInterface {
        """
        Not copied.
        """
        someField: String!
      }

      type SomeMultiInterfaceType implements SomeInterface & SomeOtherInterface {
        someField: String!
      }
    `;

    const schema = makeExecutableSchema({
      typeDefs,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    });

    const transformed = transformSchema(schema, [
      getDescriptionFromInterfaceTransform,
    ]);

    const typeMap = transformed.getTypeMap();

    const interfaceFieldDescription = getFieldDescription(
      typeMap['SomeInterface'] as GraphQLObjectType,
      'someField'
    );

    const typeFieldDescription = getFieldDescription(
      typeMap['SomeType'] as GraphQLObjectType,
      'someField'
    );

    const otherTypeFieldDescription = getFieldDescription(
      typeMap['SomeOtherType'] as GraphQLObjectType,
      'someField'
    );

    const multiTypeFieldDescription = getFieldDescription(
      typeMap['SomeMultiInterfaceType'] as GraphQLObjectType,
      'someField'
    );

    expect(interfaceFieldDescription).toEqual('Description to copy.');
    expect(typeFieldDescription).toEqual('Description to copy.');
    expect(otherTypeFieldDescription).toEqual('Not copied.');
    expect(multiTypeFieldDescription).toEqual('Other description to copy.');
  });
});
