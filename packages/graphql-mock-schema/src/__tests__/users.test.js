import { typeDefs, resolvers } from "../index";
import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import R from "ramda";

import { gql } from "../utils.js";

import { createLowSdk } from "../sdk";

describe("Users", () => {
  let execute;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  beforeEach(async () => {
    const sdk = await createLowSdk();
    execute = (query, userId) => graphql(schema, query, {}, { sdk, userId });
  });

  it("should support creating a new user", async () => {
    const result = await execute(
      gql`
        mutation {
          createUser {
            id
          }
        }
      `
    );

    const id = R.path(["data", "createUser", "id"], result);

    expect(id).toBeTruthy();

    const accountsResult = await execute(
      gql`
        {
          me {
            id
            accounts {
              id
            }
          }
        }
      `,
      id
    );

    const retrievedUser = R.path(["data", "me"], accountsResult);

    expect(retrievedUser.id).toBeTruthy();
    expect(retrievedUser.accounts.length).toBeGreaterThan(0);

    const usersResult = await execute(
      gql`
        {
          users {
            id
          }
        }
      `
    );

    const retrievedUsers = R.path(["data", "users"], usersResult);

    expect(R.map(R.prop("id"), retrievedUsers)).toEqual([id]);
  });
});
