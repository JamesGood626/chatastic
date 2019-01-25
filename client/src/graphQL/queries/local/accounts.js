import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
export const getAuthenticatedUser = gql`
  query getAuthenticatedUser {
    getAuthenticatedUser @client {
      uuid
      firstname
      lastname
      username
      token
    }
  }
`;
