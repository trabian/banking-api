const { ApolloServer } = require("apollo-server");
const openBrowser = require("react-dev-utils/openBrowser");

const typeDefs = require("../build").default;

const { typeResolvers, mocks } = require("./mocks");

const server = new ApolloServer({
  typeDefs,
  resolvers: typeResolvers,
  mocks,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  openBrowser(url);
});
