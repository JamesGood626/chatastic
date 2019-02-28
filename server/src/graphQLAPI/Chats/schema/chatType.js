const { gql } = require("apollo-server-express");

// channel will be the user's uuid which first character is a greater value than the other
// user's uuid userOneUuid + userTwoUuid + groupUuid; with userOne and userTwo determined by
// the first character value of their uuids.
const ChatTypeDef = gql`
  type Chat {
    id: String!
    channel: String!
    title: String
    createdAt: Date!
    creatorUsername: String!
    senderUsername: String!
    recipientUsername: String!
    groupUuid: String!
    messages: MessageConnection
    participating: Boolean!
  }

  type ChatResult {
    chat: Chat
    errors: [UserError]
  }

  type UpdateGroupChatParticipationResult {
    result: String!
    chat: Chat
    errors: [UserError]
  }

  input CreateDirectChatInput {
    groupUuid: String!
    recipientUsername: String!
    senderUsername: String!
    messageInput: createMessageInput!
  }

  input CreateGroupChatInput {
    groupUuid: String!
    title: String!
  }

  input UpdateGroupChatParticipationInput {
    groupUuid: String!
    chatChannel: String!
  }
`;

module.exports = ChatTypeDef;
