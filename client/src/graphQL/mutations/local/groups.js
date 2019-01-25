import gql from "graphql-tag";

export const updateGroups = gql`
  mutation updateGroupsOp($input: Group!) {
    updateGroups(input: $input) @client {
      uuid
      title
      creatorUsername
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
