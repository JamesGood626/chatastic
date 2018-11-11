const { gql } = require("apollo-server-express");

const ChatTypeDef = gql`
  type Chat {
    uuid: Int!
    channelId: String!
    title: String
    messages: [Message]
  }

  input CreateDirectChatInput {
    channelId: String!
    message: String!
  }

  input CreateGroupChatInput {
    channelId: String!
    title: String!
  }
`;

module.exports = ChatTypeDef;
