const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message

const queryTypeDef = gql`
  type Query {
    getGroup(input: GetGroupInput): Group
    getUserByUsername(input: UserSearchInput!): UserSearchResult
    retrieveMessagesByChatChannel(input: RetrieveMessagesInput): [Message]
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
    ): Message
  }

  type Subscription {
    userCreated(channel: String!): AuthenticatedUser
  }
`;

module.exports = queryTypeDef;
