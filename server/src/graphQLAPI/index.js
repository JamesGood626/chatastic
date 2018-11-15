const { gql } = require("apollo-server-express");

// createMessage(input: MessageInExistingChatInput!): Message

const queryTypeDef = gql`
  type Query {
    getUserByUsername(input: UserSearchInput!): UserSearchResult
    getGroup(input: GetGroupInput): Group
  }

  type Mutation {
    acceptGroupInvitation(input: AcceptGroupInvitationInput): AcceptedStatus
    declineGroupInvitation(input: DeclineGroupInvitationInput): DeclinedStatus
    createUser(input: CreateUserInput!): Authenticated
    loginUser(input: LoginUserInput!): Authenticated
    createGroup(input: CreateGroupInput!): Group
    createGroupInvitation(input: CreateGroupInvitationInput!): GroupInvitation
    createDirectChat(input: CreateDirectChatInput!): Chat
    createGroupChat(input: CreateGroupChatInput!): Chat
    createMessageInExistingChat(
      input: createMessageInExistingChatInput!
    ): Message
  }

  type Subscription {
    userCreated(channel: String!): User
  }
`;

module.exports = queryTypeDef;
