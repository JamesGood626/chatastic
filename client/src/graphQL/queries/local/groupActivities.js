import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
export const getGroupActivities = gql`
  query getGroupActivities {
    groupActivities @client {
      uuid
      groupUuid
      directChats {
        channel
        senderUsername
        recipientUsername
        messages {
          text
          sentDate
          sender {
            username
          }
        }
      }
    }
  }
`;
