const { gql } = require("apollo-server-express");

// With how I'm currently Implementing this...
// I'd need to either:
// 1. List all users that have been created/implement user search feature
//    so that whoever logs in can invite any of them into a group
// 2. Utilize an email service to facilitate invitation via email

const UserTypeDef = gql`
  type User {
    id: String!
    uuid: Int!
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    groups: [Group]
    chats: [Chat]
  }

  type Authorization {
    firstname: String!
    lastname: String!
    username: String!
    token: String!
  }

  input CreateUserInput {
    firstname: String!
    lastname: String!
    username: String!
    password: String!
  }

  input LoginUserInput {
    username: String!
    password: String!
  }
`;

module.exports = UserTypeDef;

// NOTE:
// the addusertogroupinput and addusertochatinput
// will be a reference ID to a mongo model once the DB is actually
// implemented, so it'll switch over to being id: String instead.

// input AddUserToGroupInput {
//   group: Group
// }

// input AddUserToChatInput {
//   chat: Chat
// }
