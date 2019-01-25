import gql from "graphql-tag";

// Navbar Component uses this query for initial mount.
// AND Perhaps I could start making use of fragments to replace the duplicated
// fields that are being queried.
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
          sentDate
          text
          sender {
            username
          }
        }
      }
    }
  }
`;
