import { visit, DocumentNode, ObjectTypeDefinitionNode } from 'graphql';

const addInterfacesToTypes = (
  typeDefs: DocumentNode,
  {
    interfaces: interfaceNames,
    types,
  }: {
    interfaces: string[];
    types: string[];
  }
) => {
  const typesSet = new Set(types);

  const visitor = {
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      if (typesSet.has(node.name.value)) {
        const interfaces = node.interfaces || [];

        const existingInterfaceNames = new Set(
          interfaces.map((inter: any) => inter.name.value)
        );

        return {
          ...node,
          interfaces: [
            ...interfaces,
            ...interfaceNames.map(interfaceName => {
              return existingInterfaceNames.has(interfaceName)
                ? null
                : {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: interfaceName,
                    },
                  };
            }),
          ].filter(Boolean),
        };
      }
      return undefined;
    },
  };

  return visit(typeDefs, {
    leave: visitor,
  });
};

export default addInterfacesToTypes;
