const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message
// commit auth fail
const queryTypeDef = gql`
  type Query {
    allUsers: [Bull]
    getGroup(input: GetGroupInput): GroupResult
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
    loginUser(input: LoginUserInput!): AuthenticatedUserResult
    createUser(input: CreateUserInput!): AuthenticatedUserResult
    createGroup(input: CreateGroupInput!): GroupResult
    createGroupInvitation(
      input: CreateGroupInvitationInput!
    ): GroupInvitationResult
    createDirectChat(input: CreateDirectChatInput!): ChatResult
    createGroupChat(input: CreateGroupChatInput!): ChatResult
    updateGroupChatParticipation(
      input: UpdateGroupChatParticipationInput
    ): UpdateGroupChatParticipationResult
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
