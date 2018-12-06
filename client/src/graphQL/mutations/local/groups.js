import gql from "graphql-tag";

export const updateGroups = gql`
  mutation updateGroups($input: Group!) {
    updateGroups(input: $input) @client {
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
