import gql from "graphql-tag";

const UserSearchInputTypes = gql`
  input UserSearchInput {
    username: String!
  }
`;

export const GET_USER_BY_USERNAME = gql`
  mutation getUserByUsernameOp($input: UserSearchInput!) {
    getUserByUsername(input: $input) {
      uuid
      firstname
      lastname
      username
    }
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
      firstname
      lastname
      username
      token
      uuid
    }
  }
`;

const loginUserInputTypes = gql`
  input LoginUserInput {
    username: String!
    password: String!
  }
`;

export const LOGIN_USER = gql`
  mutation loginUserOp($input: LoginUserInput!) {
    loginUser(input: $input) {
      firstname
      lastname
      username
      token
      uuid
      groups {
        uuid
        title
        creator {
          # Adding this to the mutation request data makes the app crash..
          # uuid (don't really need this, but why does it fail?)
          username
        }
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
          messages {
            text
            sentDate
            sender {
              username
            }
          }
        }
      }
      groupInvitations {
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
