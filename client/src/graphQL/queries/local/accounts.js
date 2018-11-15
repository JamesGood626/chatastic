import gql from "graphql-tag";

export const getAuthenticatedUser = gql`
  query authenticatedUser {
    authenticatedUser @client {
      firstname
      lastname
      username
      uuid
      token
      chats {
        channel
      }
    }
  }
`;
