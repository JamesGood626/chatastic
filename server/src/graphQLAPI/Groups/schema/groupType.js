const { gql } = require("apollo-server-express");

// removed channel.
const GroupTypeDef = gql`
  type Group {
    id: String!
    uuid: String!
    title: String!
    createdAt: Date!
    creatorUsername: String!
    chats: [Chat]
    members: [GroupMember!]!
  }

  type GroupResult {
    group: Group
    errors: [UserError]
  }

  input CreateGroupInput {
    title: String!
  }

  input GetGroupInput {
    groupUuid: String!
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
