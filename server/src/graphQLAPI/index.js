const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message

const queryTypeDef = gql`
  type Query {
    allUsers: [User]
    getGroup(input: GetGroupInput): Group
  }

  type Mutation {
    createUser(input: CreateUserInput!): Authenticated
    loginUser(input: LoginUserInput!): Authenticated
    createGroup(input: CreateGroupInput!): Group
    createDirectChat(input: CreateDirectChatInput!): Chat
    createGroupChat(input: CreateGroupChatInput!): Chat
    createMessageInExistingChat(input: MessageInExistingChatInput!) Message
  }

  type Subscription {
    userCreated(channel: String!): User
  }
`;

module.exports = queryTypeDef;
