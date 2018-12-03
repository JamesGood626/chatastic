import gql from "graphql-tag";

export const updateGroups = gql`
  query updateGroups {
    updateGroups @client {
      title
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
