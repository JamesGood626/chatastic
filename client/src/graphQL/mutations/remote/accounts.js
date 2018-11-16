import gql from "graphql-tag";

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
      groups {
        uuid
        title
        members
      }
      groupActivities {
        groupUuid
        directChats {
          channel
          title
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
