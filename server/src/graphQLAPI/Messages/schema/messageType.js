const { gql } = require("apollo-server-express");

// commit auth fail
const MessageTypeDef = gql`
  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    senderUsername: String!
    cursor: Int!
  }

  type MessageResult {
    errors: [InputError]
    message: Message
  }

  type PaginatedMessagesResult {
    errors: [InputError]
    messages: [Message]
  }

  input createMessageInput {
    text: String!
    sentDate: Date!
  }

  input createMessageInExistingChatInput {
    text: String!
    sentDate: Date!
    chatChannel: String!
  }

  input RetrieveMessagesInput {
    start: Int!
    end: Int!
    chatChannel: String!
  }
`;

module.exports = MessageTypeDef;
