const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message
// commit auth fail
const queryTypeDef = gql`
  type Query {
    allUsers: [Bull]
    getGroup(input: GetGroupInput): Group
    getUserByUsername(input: UserSearchInput!): UserSearchResult
    retrieveMessagesByChatChannel(
      input: RetrieveMessagesInput
    ): PaginatedMessagesResult
  }

  type Mutation {
    acceptGroupInvitation(
      input: AcceptGroupInvitationInput
    ): AcceptedStatusResult
    declineGroupInvitation(
      input: DeclineGroupInvitationInput
    ): DeclinedStatusResult
    createUser(input: CreateUserInput!): AuthenticatedUserResult
    loginUser(input: LoginUserInput!): AuthenticatedUserResult
    createGroup(input: CreateGroupInput!): Group
    createGroupInvitation(
      input: CreateGroupInvitationInput!
    ): GroupInvitationResult
    createDirectChat(input: CreateDirectChatInput!): ChatResult
    createGroupChat(input: CreateGroupChatInput!): ChatResult
    createMessageInExistingChat(
      input: createMessageInExistingChatInput!
    ): MessageResult
  }

  type Subscription {
    userCreated(channel: String!): AuthenticatedUserResult
  }

  type InputError {
    key: String!
    message: String!
  }
`;

module.exports = queryTypeDef;
