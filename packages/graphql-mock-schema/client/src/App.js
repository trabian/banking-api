import React, { Component } from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";
import { parse, print } from "graphql";

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

const defaultQuery = `
# Welcome to Trabian's GraphQL Banking API
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)


{
  me {
    accounts {
      id
      name
      availableBalance
      actualBalance
      transactions(limit: 10) {
        id
        amount
        date
        description
        merchant {
          name
        }
        category {
          name
        }
      }
    }
  }
}
`;

class App extends Component {
  handleClickPrettifyButton = event => {
    const editor = this.graphiql.getQueryEditor();
    const currentText = editor.getValue();
    const prettyText = print(parse(currentText));
    editor.setValue(prettyText);
  };

  render() {
    return <GraphiQL fetcher={graphQLFetcher} defaultQuery={defaultQuery} />;
    // return (
    //   <GraphiQL
    //     ref={c => {
    //       console.warn("ref", c);
    //       this.graphiql = c;
    //     }}
    //     fetcher={graphQLFetcher}
    //     defaultQuery={defaultQuery}
    //   >
    //     <GraphiQL.Toolbar>
    //       <GraphiQL.Button
    //         onClick={this.handleClickPrettifyButton}
    //         label="Prettify"
    //         title="Prettify Query (Shift-Ctrl-P)"
    //       />

    //       <GraphiQL.Menu label="File" title="File">
    //         <GraphiQL.MenuItem label="Save" title="Save" />
    //       </GraphiQL.Menu>
    //     </GraphiQL.Toolbar>
    //   </GraphiQL>
    // );
  }
}

export default App;
