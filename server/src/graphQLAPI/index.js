const { gql } = require("apollo-server-express");

const queryTypeDef = gql`
  type Query {
    allUsers: [User]
    allGroups: [Group]
  }

  type Mutation {
    createUser(input: CreateUserInput!): Authorization
    loginUser(input: LoginUserInput!): Authorization
    createGroup(input: CreateGroupInput!): Group
    createDirectChat(input: CreateDirectChatInput!): Chat
    createGroupChat(input: CreateGroupChatInput!): Chat
    createMessage(input: MessageInput!): Message
  }

  type Subscription {
    userCreated(channelId: Int!): User
  }
`;

module.exports = queryTypeDef;
