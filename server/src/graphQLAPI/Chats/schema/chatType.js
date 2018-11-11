const { gql } = require("apollo-server-express");

const ChatTypeDef = gql`
  type Chat {
    id: Int!
    channelId: Int!
    title: String
    messages: [Message]
  }

  input CreateDirectChatInput {
    id: Int!
    channelId: Int!
    message: String!
  }

  input CreateGroupChatInput {
    id: Int!
    channelId: Int!
    title: String!
  }
`;

module.exports = ChatTypeDef;
