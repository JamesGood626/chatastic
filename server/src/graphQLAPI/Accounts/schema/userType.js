const { gql } = require("apollo-server-express");

// With how I'm currently Implementing this...
// I'd need to either:
// 1. List all users that have been created/implement user search feature
//    so that whoever logs in can invite any of them into a group
// 2. Utilize an email service to facilitate invitation via email
// 3. Create an Invitation model, which will be displayed for any users for which
//    it is created for.

// Thinking about changing groupInvitations on AuthenticatedUser to be receivedGroupInvitations
// Refer to GroupActivities type to see the update regarding groupInvitations there.
const UserTypeDef = gql`
  interface User {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type AuthenticatedUser implements User {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    token: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type GroupMember {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type Inviter {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type Invitee {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type UserSearchResult {
    user: Invitee
    message: String
    errors: [InputError]
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

  type AuthenticatedUserResult {
    errors: [InputError]
    authenticatedUser: AuthenticatedUser
  }

  type Bull {
    name: String!
    age: Int!
  }
`;

module.exports = UserTypeDef;

// NOTE:
// need addusertogroupinput once I get around to that.

// input AddUserToGroupInput {
//   group: Group
// }
