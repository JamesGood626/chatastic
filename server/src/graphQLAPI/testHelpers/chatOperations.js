const {
  loginAndCreateGroupSetup,
  loginAndAcceptGroupInvitation
} = require("./groupInvitationsOperations");
const {
  createGroupInvitationGQLRequest
} = require("./groupInvitationsRequest");
const { getUserByUsername } = require("../Accounts/services");
const { retrieveGroupActivitiesList } = require("../GroupActivities/services");
const { retrieveChatsList } = require("../Chats/services");
const { retrieveMessageList } = require("../Messages/services");

const chatCreationTestFixtureSetup = async (createdRequest, input) => {
  // Logging in user and creating group
  const {
    loginInput,
    groupInput,
    groupInvitationInput,
    secondLoginInput
  } = input;

  const { token, groupUuid } = await loginAndCreateGroupSetup(
    createdRequest,
    loginInput,
    groupInput
  );

  // Creating group invitation
  const { uuid: userOneUuid, username } = await getUserByUsername("BamBamSam");
  groupInvitationInput.groupUuid = groupUuid;
  groupInvitationInput.inviteeUuid = userOneUuid;

  const {
    groupInvitation: { inviter }
  } = await createGroupInvitationGQLRequest(
    createdRequest,
    token,
    groupInvitationInput
  );

  // Accepting group invitation
  await loginAndAcceptGroupInvitation(createdRequest, secondLoginInput);

  return {
    token,
    groupUuid,
    senderUsername: inviter.username,
    recipientUsername: username
  };
};

const getDirectChatTestables = async username => {
  const user = await getUserByUsername(username);
  const groupActivities = await retrieveGroupActivitiesList(
    user.groupActivities
  );
  const directChats = await retrieveChatsList(groupActivities[0].directChats);
  const messages = await retrieveMessageList(directChats[0].messages);
  return { groupActivities, directChats, messages };
};

module.exports = {
  chatCreationTestFixtureSetup: chatCreationTestFixtureSetup,
  getDirectChatTestables: getDirectChatTestables
};
