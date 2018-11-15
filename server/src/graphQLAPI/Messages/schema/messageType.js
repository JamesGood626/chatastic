const { gql } = require("apollo-server-express");

const MessageTypeDef = gql`
  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    sender: User!
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
`;

module.exports = MessageTypeDef;
