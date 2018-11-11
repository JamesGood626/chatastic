const { gql } = require("apollo-server-express");

// Still need to implement date scalar.
// Read that new graphql book you got.
const MessageTypeDef = gql`
  type Message {
    id: Int!
    channelId: Int!
    text: String!
  }

  input MessageInput {
    id: Int!
    channelId: Int!
    text: String!
  }
`;

module.exports = MessageTypeDef;
