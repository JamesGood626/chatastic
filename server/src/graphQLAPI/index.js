const { gql } = require("apollo-server-express");

const queryTypeDef = gql`
  type Query {
    allUsers: [User]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
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

// Don't know why I had this in here.
// input SearchRestaurantInput {
//   latitude: Float!
//   longitude: Float!
//   categories: [String]
//   cuisines: [String]
//   establishment: String
//   radius: String
// }
