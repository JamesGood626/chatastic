import gql from "graphql-tag";
// LoginUserInput -> This is also declared in the /mutations/remote/accounts file
const typeDefs = gql`
  scalar Date
  type Authenticated {
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    token: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type User {
    id: String!
    uuid: String!
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    groups: [Group]
    groupActivities: [GroupActivity]
    groupInvitations: [GroupInvitation]
  }

  type Group {
    id: String!
    uuid: String!
    title: String!
    createdAt: Date!
    creator: User!
    chats: [Chat]
    members: [User!]!
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
    inviter: User!
    invitee: User!
  }

  type Chat {
    id: String!
    channel: String!
    title: String
    createdAt: Date!
    creator: User
    senderUsername: String!
    recipientUsername: String!
    messages: [Message]
  }

  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    sender: User!
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
    creator: UserInput!
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
    sender: UserInput!
  }

  # the schema allows the following query:
  type Query {
    getAuthenticatedUser: Authenticated
  }

  # this schema allows the following mutation:
  type Mutation {
    loginUser(input: LoginUserInput!): Authenticated
    updateAuthenticatedUser(input: AuthenticatedInput!): Authenticated
    createGroup(input: CreateGroupInput!): Group
  }
`;

export default typeDefs;
