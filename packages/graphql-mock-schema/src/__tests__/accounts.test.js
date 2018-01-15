import { typeDefs, resolvers } from "../index";
import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import R from "ramda";

import { gql } from "../utils.js";

const schema = makeExecutableSchema({ typeDefs, resolvers });

import { InMemorySDK } from "../sdk";

describe("The accounts schema using the InMemorySDK", () => {
  let execute;

  beforeEach(() => {
    const sdk = new InMemorySDK(
      {
        accounts: [
          {
            id: "1234",
            actualBalance: 2345.67,
            userId: "1"
          },
          {
            id: "2345",
            userId: "1",
            actualBalance: 2345.67
          },
          {
            id: "not-mine",
            actualBalance: 100,
            userId: "2"
          }
        ]
      },
      {
        userId: "1"
      }
    );

    execute = query => graphql(schema, query, {}, { sdk });
  });

  it("should allow access to an account based on ID", async () => {
    const result = await execute(
      gql`
        {
          account(id: "1234") {
            id
            actualBalance
          }
        }
      `
    );

    expect(R.path(["data", "account", "id"], result)).toEqual("1234");

    expect(result).toMatchSnapshot();
  });

  it("should prevent access to other users' accounts based on ID", async () => {
    const result = await execute(
      gql`
        {
          account(id: "not-mine") {
            id
          }
        }
      `
    );

    expect(R.path(["data", "account", "id"], result)).toBeUndefined();
    expect(result.errors).toBeTruthy();

    expect(result).toMatchSnapshot();
  });

  it("should show all of a user's accounts", async () => {
    const result = await execute(
      gql`
        {
          me {
            accounts {
              id
            }
          }
        }
      `
    );

    expect(
      R.pipe(R.pathOr([], ["data", "me", "accounts"]), R.pluck("id"))(result)
    ).toEqual(["1234", "2345"]);

    expect(result).toMatchSnapshot();
  });
});