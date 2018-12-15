import gql from "graphql-tag";

const createGroupInput = gql`
  input CreateGroupInput {
    title: String!
  }
`;

export const CREATE_GROUP = gql`
  mutation createGroupOp($input: CreateGroupInput!) {
    createGroup(input: $input) {
      uuid
      title
      members {
        username
      }
      creator {
        username
      }
      chats {
        channel
        title
      }
    }
  }
`;

// Unnecessary to pull off creator?
// groups {
//   title
//   members {
//     username
//   }
// }
