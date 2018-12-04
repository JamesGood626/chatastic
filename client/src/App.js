import React, { Component } from "react";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { setContext } from "apollo-link-context";
import { ApolloProvider } from "react-apollo";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import styled from "styled-components";
// import getAuthenticatedUser from './graphQL/queries/local/accounts'
import Main from "./Main";
import "./reset.css";

const authLink = setContext((request, previousContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: { authorization: `Bearer ${token}` }
  };
});

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

// defaultState for user:
// uuid
// firstname
// lastname
// token
// username

const defaultState = {
  authenticatedUser: {
    __typename: "authenticatedUser",
    firstname: null,
    lastname: null,
    username: null,
    uuid: null,
    token: null
  },
  groups: [],
  groupActivities: [],
  groupInvitations: [],
  activeGroup: null
};

const cache = new InMemoryCache({
  dataIdFromObject: o => {
    console.log("dataIfFromObject executing: ", o);
    return o.uuid;
  }
});

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateAuthenticatedUser: (_, { input }, { cache }) => {
        const {
          firstname,
          lastname,
          username,
          uuid,
          token,
          groups,
          groupActivities,
          groupInvitations
        } = input;
        console.log("DA input: ", input);
        const query = gql`
          query getAuthenticatedUser {
            authenticatedUser @client {
              __typename
              firstname
              lastname
              username
              uuid
              token
            }
          }
        `;
        const previousState = cache.readQuery({ query });
        console.log("PREVIOUS STATE: ", previousState);
        const data = {
          ...previousState,
          authenticatedUser: {
            ...previousState.authenticatedUser,
            firstname,
            lastname,
            username,
            uuid,
            token
          },
          groups: groups[0] !== null ? groups : [],
          groupActivities: groupActivities[0] !== null ? groupActivities : [],
          groupInvitations: groupInvitations[0] !== null ? groupInvitations : []
        };
        console.log("NEW DATA: ", data);
        cache.writeData({ query, data });
      }
      // updateGroups: (_, { input }, { cache }) => {
      //   // const { firstname, lastname, username, uuid, token, chats } = input;
      //   console.log("input for updateGroups: ", input);
      //   const query = gql`
      //     query getGroups {
      //       groups @client {
      //         __typename
      //         title
      //       }
      //     }
      //   `;
      //   const previousState = cache.readQuery({ query });
      //   console.log("PREVIOUS STATE: ", previousState);
      //   const data = {
      //     ...previousState,
      //     groups: {
      //       ...previousState.groups,
      //       // title,
      //       members: [...previousState.groups.members]
      //     }
      //   };
      //   console.log("NEW DATA: ", data);
      //   cache.writeData({ query, data });
      // }
    }
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, stateLink, link])
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
