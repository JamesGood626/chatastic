// mutation loginUserOp($input: LoginUserInput!) {
//               loginUser(input: $input) {
//                  token
//                  groups {
//                    title
//                  }
//              }
//           }

// mutation createUserOp($input: CreateUserInput!) {
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
