const { gql } = require("apollo-server-express");

// A group activity should only be created when a direct chat is created.
// Not upon initial group creation.
// And it can just be updated on both of the users whenever a direct chat is
// created... no nee

// This seems like a good spot to put this -> [sentGroupInvitations]
// Having the received/sent GroupInvitations on AuthenticatedUser
// will help with displaying those separate pieces of data in the UI.
const GroupActivityTypeDef = gql`
  type GroupActivity {
    id: String!
    uuid: String!
    groupUuid: String!
    directChats: [Chat]
  }
`;
// I would think that adding a directCalls array would be suitable here for that feature.

module.exports = GroupActivityTypeDef;
