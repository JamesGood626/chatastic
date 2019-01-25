const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message
// commit auth fail
const queryTypeDef = gql`
  type Query {
    getGroup(input: GetGroupInput): Group
    getUserByUsername(input: UserSearchInput!): UserSearchResult
    retrieveMessagesByChatChannel(
      input: RetrieveMessagesInput
    ): PaginatedMessagesResult
  }

  type Mutation {
    acceptGroupInvitation(input: AcceptGroupInvitationInput): AcceptedStatus
    declineGroupInvitation(input: DeclineGroupInvitationInput): DeclinedStatus
    createUser(input: CreateUserInput!): AuthenticatedUser
    loginUser(input: LoginUserInput!): AuthenticatedUser
    createGroup(input: CreateGroupInput!): Group
    createGroupInvitation(input: CreateGroupInvitationInput!): GroupInvitation
    createDirectChat(input: CreateDirectChatInput!): Chat
    createGroupChat(input: CreateGroupChatInput!): Chat
    createMessageInExistingChat(
      input: createMessageInExistingChatInput!
    ): MessageResult
  }

  type Subscription {
    userCreated(channel: String!): AuthenticatedUser
  }

  type InputError {
    key: String!
    message: String!
  }
`;

module.exports = queryTypeDef;
