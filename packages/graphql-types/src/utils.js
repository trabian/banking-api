// gql is a nice hint to editors and prettier, but we don't really want to parse the graphql schema.
export const gql = str => str[0];
