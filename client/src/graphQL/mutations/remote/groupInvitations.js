import gql from "graphql-tag";

const CreateGroupInvitationInput = gql`
  input CreateGroupInvitationInput {
    sentDate: Date!
    groupUuid: String!
    inviteeUuid: String!
  }
`;

export const CREATE_GROUP_INVITATION = gql`
  mutation createGroupInvitationOp($input: CreateGroupInvitationInput!) {
    createGroupInvitationOp(input: $input) {
      uuid
      sentDate
      group
      invitee
    }
  }
`;
