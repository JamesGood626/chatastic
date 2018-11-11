import React, { Component } from "react";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import { getMainDefinition } from "apollo-utilities";
import Main from "./Main";
import "./reset.css";

const httpLink = new HttpLink({
  uri: "http://localhost:5000/graphql"
  // headers: {}
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/graphql`,
  options: {
    reconnect: true
  }
});

// The returned boolean value from the gate will determine which link is used.
// true -> wsLink
// false -> httpLink
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    console.log("THE OPERATION: ", operation);
    const result =
      kind === "OperationDefinition" && operation === "subscription";
    console.log("RESULT: ", result);
    return result;
  },
  wsLink,
  httpLink
);

const defaultState = {};

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {}
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, link])
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Main />
      </ApolloProvider>
    );
  }
}

export default App;
