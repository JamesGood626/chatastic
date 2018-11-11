const { gql } = require("apollo-server-express");

// Still need to implement date scalar.
// Read that new graphql book you got.
const MessageTypeDef = gql`
  type Message {
    channelId: String!
    text: String!
  }

  input MessageInput {
    channelId: String!
    text: String!
  }
`;

module.exports = MessageTypeDef;
