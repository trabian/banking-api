import React from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";

function graphQLFetcher(graphQLParams) {
  return fetch("/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: "responsible-spender"
    },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json());
}

const App = () => (
  <div>
    <GraphiQL fetcher={graphQLFetcher} />
  </div>
);

export default App;
