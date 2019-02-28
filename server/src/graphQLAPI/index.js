const { gql } = require("apollo-server-express");

const queryTypeDef = gql`
  type Query {
    allUsers: [Bull]
    getGroup(input: GetGroupInput): GroupResult
    getUserByUsername(input: UserSearchInput!): UserSearchResult
    getMessagesByChatChannel(
      input: getMessagesByChatChannelInput
    ): PaginatedMessagesResult!
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
    createMessageInExistingChat(
      input: createMessageInExistingChatInput!
    ): MessageResult
    updateGroupChatParticipation(
      input: UpdateGroupChatParticipationInput
    ): UpdateGroupChatParticipationResult
  }

  type Subscription {
    userCreated(channel: String!): AuthenticatedUserResult
  }

  type UserError {
    key: String!
    message: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;

module.exports = queryTypeDef;
