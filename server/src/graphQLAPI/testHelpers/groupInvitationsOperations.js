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
  const { token } = await loginUserGQLRequest(createdRequest, loginInput, true);
  const { uuid: groupUuid } = await createGroupGQLRequest(
    createdRequest,
    token,
    groupInput
  );
  return { token, groupUuid };
};

const loginAndAcceptGroupInvitation = async (createdRequest, loginInput) => {
  const { token, groupInvitations } = await loginUserGQLRequest(
    createdRequest,
    loginInput
  );
  const acceptInvitationInput = {
    invitationUuid: groupInvitations[0].uuid
  };
  const {
    acceptedMessage,
    joinedGroup
  } = await acceptGroupInvitationGQLRequest(
    createdRequest,
    token,
    acceptInvitationInput,
    true
  );
  console.log("WHAT YOU RECEIVED BACK FOR JOINED GROUP: ", joinedGroup);
  return { acceptedMessage, joinedGroup, groupInvitation: groupInvitations[0] };
};

module.exports = {
  loginAndCreateGroupSetup: loginAndCreateGroupSetup,
  loginAndAcceptGroupInvitation: loginAndAcceptGroupInvitation
};
