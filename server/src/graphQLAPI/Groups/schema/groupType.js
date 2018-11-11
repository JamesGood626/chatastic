const { gql } = require("apollo-server-express");

const GroupTypeDef = gql`
  type Group {
    id: Int!
    channelId: Int!
    title: String
    chats: [Chat]
    members: [User!]!
  }

  input CreateGroupInput {
    id: Int!
    channelId: Int!
    title: String!
  }
`;

module.exports = GroupTypeDef;

// NOTE:
// the CreateGroupInput
// will be a reference ID to a mongo model once the DB is actually
// implemented, so it'll switch over to being id: String instead.
// creator: User! -> will be creator: String! instead, with a reference to user in
// mongo model

// If I have enough time
// input EditGroupInput {
//   id: Int!
//   channelId: Int!
//   title: String!
// }
