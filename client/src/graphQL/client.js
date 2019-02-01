import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { setContext } from "apollo-link-context";
// import { SchemaLink } from "apollo-link-schema";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
// import schema from "./graphQL/schema/schema";
import resolvers from "../graphQL/resolvers";

const authLink = setContext((request, { headers }) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN BEING SET ON THE HEADER: ", token);
  return {
    ...headers,
    headers: { authorization: token ? `Bearer ${token}` : "" }
  };
});

export const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
  // headers: {}
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
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
  activeGroup: null,
  usersToInvite: []
};

const cache = new InMemoryCache({
  dataIdFromObject: o => {
    if (o.__typename === "GroupActivity") {
      // console.log(
      //   `o has a typename of GroupActivity: ${o.__typename}_${o.groupUuid}`
      // );
      return `${o.__typename}_${o.groupUuid}`;
    }
    //  console.log("dataIfFromObject executing: ", o);
    return o.uuid;
  }
});

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers
});

// const trueSchema = schema.then(result => result);
// console.log("trueSchema: ", trueSchema);
// console.log("the schema: ", schema);
// const schemaLink = new SchemaLink({ schema });
// console.log("What's a schema link? ", schemaLink);

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, stateLink, link])
});

export default client;
