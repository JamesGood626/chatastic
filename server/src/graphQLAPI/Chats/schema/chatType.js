const { gql } = require("apollo-server-express");

const ChatTypeDef = gql`
  type Chat {
    id: String!
    channel: String!
    title: String
    creator: User!
    messages: [Message]
  }

  input CreateDirectChatInput {
    recipientUuid: String!
    messageInput: MessageInNewChatInput!
  }

  input CreateGroupChatInput {
    groupUuid: String!
    title: String!
  }
`;

module.exports = ChatTypeDef;
