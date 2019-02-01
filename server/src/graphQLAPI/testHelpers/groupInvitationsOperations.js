const { loginUserGQLRequest } = require("./accountsRequest");
const { createGroupGQLRequest } = require("./groupsRequest");
const {
  acceptGroupInvitationGQLRequest
} = require("./groupInvitationsRequest");

const loginAndCreateGroupSetup = async (
  createdRequest,
  loginInput,
  groupInput
) => {
  const {
    authenticatedUser: { token }
  } = await loginUserGQLRequest(createdRequest, loginInput);
  const { uuid: groupUuid } = await createGroupGQLRequest(
    createdRequest,
    token,
    groupInput,
    true
  );
  return { token, groupUuid };
};

const loginAndAcceptGroupInvitation = async (createdRequest, loginInput) => {
  const {
    authenticatedUser: { token, groupInvitations }
  } = await loginUserGQLRequest(createdRequest, loginInput);
  const acceptInvitationInput = {
    invitationUuid: groupInvitations[0].uuid
  };
  const {
    acceptedStatus: { acceptedMessage, joinedGroup }
  } = await acceptGroupInvitationGQLRequest(
    createdRequest,
    token,
    acceptInvitationInput
  );
  return { acceptedMessage, joinedGroup, groupInvitation: groupInvitations[0] };
};

module.exports = {
  loginAndCreateGroupSetup: loginAndCreateGroupSetup,
  loginAndAcceptGroupInvitation: loginAndAcceptGroupInvitation
};
