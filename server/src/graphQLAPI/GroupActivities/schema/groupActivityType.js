const { gql } = require("apollo-server-express");

// A group activity should only be created when a direct chat is created.
// Not upon initial group creation.
// And it can just be updated on both of the users whenever a direct chat is
// created... no need for any resolver actions for this.
const GroupActivityTypeDef = gql`
  type GroupActivity {
    id: String!
    uuid: String!
    groupUuid: String!
    directChats: [Chat]
  }
`;

module.exports = GroupActivityTypeDef;
