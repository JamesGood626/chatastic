import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
export const getGroupInvitations = gql`
  query getGroupInvitations {
    groupInvitations @client {
      group {
        uuid
        title
      }
      inviter {
        firstname
        lastname
        username
      }
      invitee {
        firstname
        lastname
        username
      }
    }
  }
`;
