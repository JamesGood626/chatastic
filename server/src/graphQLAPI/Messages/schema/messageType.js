const { gql } = require("apollo-server-express");

const MessageTypeDef = gql`
  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    sender: User!
  }

  input MessageInNewChatInput {
    text: String!
    sentDate: Date!
  }

  input MessageInExistingChatInput {
    channel: String!
    text: String!
    sentDate: Date!
  }
`;

module.exports = MessageTypeDef;
