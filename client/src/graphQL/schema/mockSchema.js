import gql from "graphql-tag";
// LoginUserInput -> This is also declared in the /mutations/remote/accounts file
// Okay, so the real client schema only needs the client side supported operations
// The mock schema will need EVERYTHING, so that the mock resolvers can pick up
// mocked remote GraphQL requests.
const typeDefs = gql`
  scalar Date

  type User {
    id: String!
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type GroupMember {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type Inviter {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type Invitee {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
  }

  type Group {
    id: String!
    uuid: String!
    title: String!
    createdAt: Date!
    creatorUsername: String!
    chats: [Chat]
    members: [GroupMember!]!
  }

  type GroupActivity {
    id: String!
    uuid: String!
    groupUuid: String!
    directChats: [Chat]
  }

  type GroupInvitation {
    id: String!
    uuid: String!
    sentDate: Date!
    group: Group!
    inviter: Inviter!
    invitee: Invitee!
  }

  type Chat {
    id: String!
    channel: String!
    title: String
    createdAt: Date!
    creatorUsername: User
    senderUsername: String!
    recipientUsername: String!
    messages: [Message]
  }

  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    senderUsername: String!
  }

  input LoginUserInput {
    username: String
    password: String
  }

  input CreateGroupInput {
    title: String!
  }

  input AuthenticatedInput {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    token: String!
    groups: [GroupInput]
    groupActivities: [GroupActivityInput]
    groupInvitations: [GroupInvitationInput]
  }

  input GroupInput {
    id: String!
    uuid: String!
    title: String!
    createdAt: Date!
    chats: [ChatInput]
    members: [UserInput!]!
  }

  input GroupActivityInput {
    id: String!
    uuid: String!
    groupUuid: String!
    directChats: [ChatInput]
  }

  input GroupInvitationInput {
    id: String!
    uuid: String!
    sentDate: Date!
    group: GroupInput!
    inviter: UserInput!
    invitee: UserInput!
  }

  input UserInput {
    id: String!
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    groups: [GroupInput]
    groupActivities: [GroupActivityInput]
    groupInvitations: [GroupInvitationInput]
  }

  input ChatInput {
    id: String!
    channel: String!
    title: String
    createdAt: Date!
    creator: UserInput
    senderUsername: String!
    recipientUsername: String!
    messages: [MessageInput]
  }

  input MessageInput {
    channel: String!
    text: String!
    sentDate: Date!
    senderUsername: String!
  }

  # the schema allows the following query:
  type Query {
    getAuthenticatedUser: User
  }

  # this schema allows the following mutation:
  type Mutation {
    loginUser(input: LoginUserInput!): User
    updateAuthenticatedUser(input: AuthenticatedInput!): User
    createGroup(input: CreateGroupInput!): Group
  }
`;

export default typeDefs;
