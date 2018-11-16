const { gql } = require("apollo-server-express");

// With how I'm currently Implementing this...
// I'd need to either:
// 1. List all users that have been created/implement user search feature
//    so that whoever logs in can invite any of them into a group
// 2. Utilize an email service to facilitate invitation via email
// 3. Create an Invitation model, which will be displayed for any users for which
//    it is created for.

const UserTypeDef = gql`
  type User {
    id: String!
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type Authenticated {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    token: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type UserSearchResult {
    uuid: String
    firstname: String
    lastname: String
    username: String
    message: String
  }

  input UserSearchInput {
    username: String!
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
// need addusertogroupinput once I get around to that.

// input AddUserToGroupInput {
//   group: Group
// }
