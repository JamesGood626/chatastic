import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
export const getGroups = gql`
  query getGroups {
    groups @client {
      title
      uuid
      creator {
        username
      }
      members {
        username
      }
      chats {
        channel
        title
      }
    }
  }
`;
