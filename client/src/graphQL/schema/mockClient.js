import { graphql } from "graphql";
import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import typeDefs from "./mockSchema";
import mocks from "../resolvers/mocks";

const cache = new InMemoryCache();

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: mocks,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

// Add mocks, modifies schema in place
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: false });

const link = new SchemaLink({ schema });

const client = new ApolloClient({
  link,
  cache
});

export default client;
