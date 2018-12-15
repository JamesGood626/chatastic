import { graphql } from "graphql";
import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import typeDefs from "./index";
import mocks from "../resolvers/mocks";

const cache = new InMemoryCache();

// const typeResolvers = {
//   List: {
//     __resolveType(data) {
//       return data.typename; // typename property must be set by your mock functions
//     }
//   }
// };

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
