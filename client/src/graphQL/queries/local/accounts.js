import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
export const getAuthenticatedUser = gql`
  query authenticatedUser {
    authenticatedUser @client {
      firstname
      lastname
      username
      uuid
      token
    }
  }
`;
