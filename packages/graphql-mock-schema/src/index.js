import DataLoader from "dataloader";

import FileAsync from "lowdb/adapters/FileAsync";

import typeDefs from "./types";
import resolvers from "./resolvers";

import { LowSDK } from "./sdk";

export const createLoaders = ({ sdk, userId }) => ({
  accounts: new DataLoader(ids =>
    sdk.getAccounts(ids, {
      userId
    })
  )
});

export const createMockSdk = ({
  dbFile,
  defaultValue = {
    accounts: [],
    users: [],
    transactions: []
  }
}) => {
  return new LowSDK({
    adapter: new FileAsync(dbFile, {
      defaultValue
    })
  });
};

// const oldResolvers = {
//   Date: new GraphQLScalarType({
//     name: "Date",
//     description: "Date custom scalar type",
//     parseValue(value) {
//       return new Date(value); // value from the client
//     },
//     serialize(value) {
//       return value.getTime(); // value sent to the client
//     },
//     parseLiteral(ast) {
//       if (ast.kind === Kind.INT) {
//         return parseInt(ast.value, 10); // ast value is always in string format
//       }
//       return null;
//     }
//   }),
//   Account: {
//     transactions: ({ id }, { limit, categoryId, query }) => {
//       const transactions = db
//         .getCollection("transactions")
//         .find({ accountId: id });

//       // TODO: Can/should we use the loki queries instead?
//       return R.pipe(
//         R.unless(
//           () => R.isNil(categoryId),
//           R.filter(R.pathEq(["category", "id"], categoryId))
//         ),
//         R.unless(
//           () => R.isNil(query),
//           transactions =>
//             matchSorter(transactions, query, {
//               keys: ["description"]
//             })
//         ),
//         R.take(limit)
//       )(transactions || []);
//     }
//   },
//   Transaction: {
//     account: ({ accountId }) => accountLoader.load(accountId)
//   },
//   User: {
//     accounts: ({ id }) => db.getCollection("accounts").find({ userId: id })
//   },
//   RootQuery: {
//     account: (obj, { id: accountId }) => accountLoader.load(accountId),
//     category: (obj, { id: categoryId }, ctx) =>
//       categoryId && getCategoryForUser(getUserId(ctx), categoryId),
//     me: (obj, args, ctx) =>
//       db.getCollection("users").findOne({ id: getUserId(ctx) }),
//     users: () => db.getCollection("users").find()
//   }
// };

export { resolvers, typeDefs };
