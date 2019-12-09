import { Transform, forEachField } from 'graphql-tools';
import { GraphQLObjectType } from 'graphql';

const getDescriptionFromInterfaceTransform: Transform = {
  transformSchema: schema => {
    forEachField(schema, (field, typeName, fieldName) => {
      if (!field.description) {
        const type = schema.getType(typeName);

        if (type?.astNode?.kind === 'ObjectTypeDefinition') {
          const objectType = type as GraphQLObjectType;

          const interfaces = objectType.getInterfaces();

          if (interfaces.length) {
            const reversedInterfaces = [...interfaces].reverse();

            for (let interfaceType of reversedInterfaces) {
              const interfaceDescription = interfaceType.getFields()[fieldName]
                ?.description;
              if (interfaceDescription) {
                field.description = interfaceDescription;
                break;
              }
            }
          }
        }
      }
    });

    return schema;
  },
};

export default getDescriptionFromInterfaceTransform;
