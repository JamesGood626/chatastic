const { gql } = require("apollo-server-express");

// channel will be the user's uuid which first character is a greater value than the other
// user's uuid userOneUuid + userTwoUuid + groupUuid; with userOne and userTwo determined by
// the first character value of their uuids.
const GroupInvitationTypeDef = gql`
  type GroupInvitation {
    id: String!
    uuid: String!
    sentDate: Date!
    group: Group!
    inviter: User!
    invitee: User!
  }

  type AcceptedStatus {
    acceptedMessage: String!
    joinedGroup: Group!
  }

  type DeclinedStatus {
    declinedMessage: String!
  }

  input AcceptGroupInvitationInput {
    invitationUuid: String!
  }

  input DeclineGroupInvitationInput {
    invitationUuid: String!
  }

  input CreateGroupInvitationInput {
    sentDate: Date!
    groupUuid: String!
    inviteeUuid: String!
  }
`;

module.exports = GroupInvitationTypeDef;
