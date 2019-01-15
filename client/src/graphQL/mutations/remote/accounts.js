import gql from "graphql-tag";

const UserSearchInputTypes = gql`
  input UserSearchInput {
    username: String!
  }
`;

const createUserInputTypes = gql`
  input CreateUserInput {
    firstname: String!
    lastname: String!
    username: String!
    password: String!
  }
`;

export const CREATE_USER = gql`
  mutation createUserOp($input: CreateUserInput!) {
    createUser(input: $input) {
      uuid
      firstname
      lastname
      username
      token
    }
  }
`;

const loginUserInputTypes = gql`
  input LoginUserInput {
    username: String!
    password: String!
  }
`;

// Removed the retrieval of messages in this query
// Will instead opt to retrieveChatMessagesByChannel(start: Int!, end: Int!)
// This will require maintaining the start and end that has been retrieved for each channel's
// messages in order to prevent refetching messages already in the cache.
// The message mongo model does have the chat channel on it, so you can query by this.
export const LOGIN_USER = gql`
  mutation loginUserOp($input: LoginUserInput!) {
    loginUser(input: $input) {
      uuid
      firstname
      lastname
      username
      token
      groups {
        uuid
        title
        creatorUsername
        chats {
          channel
          title
        }
        members {
          uuid
          username
        }
      }
      groupActivities {
        uuid
        groupUuid
        directChats {
          channel
          senderUsername
          recipientUsername
        }
      }
      groupInvitations {
        group {
          uuid
          title
        }
        inviter {
          username
          firstname
          lastname
        }
        invitee {
          username
          firstname
          lastname
        }
      }
    }
  }
`;

// mutation loginUserOp($input: LoginUserInput!) {
//               loginUser(input: $input) {
//                  token
//                  groups {
//                    title
//                  }
//              }
//           }

// mutation LoginUserOp($input: CreateUserInput!) {
//   createUser(input: $input) {
//     firstname
//     lastname
//     username
//     token
//     uuid
//      groups {
//          title
//      }
//   }
// }

//  mutation createGroupOp($input: CreateGroupInput!) {
//   createGroup(input: $input) {
//     id
//    uuid
//    title
//     creator {
//      username
//     }
//   }
//  }

// {
//   "input": {
//     "title": "Group Two",
//     "creationDate": 121221143
//   }
//   }
