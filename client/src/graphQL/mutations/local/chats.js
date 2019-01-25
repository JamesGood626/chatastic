import gql from "graphql-tag";

// Need to actually pass in the particular group whose chat array
// will need to be updated with the newly created groupChat
export const updateGroupChats = gql`
  mutation updateGroupChatsOp($input: Chat!) {
    updateGroupChats(input: $input) @client {
      channel
      title
    }
  }
`;
