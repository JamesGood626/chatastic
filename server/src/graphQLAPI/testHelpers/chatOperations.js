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
  const { group, inviter, invitee } = await createGroupInvitationGQLRequest(
    createdRequest,
    token,
    groupInvitationInput
  );
  // Accepting group invitation
  const {
    acceptedMessage,
    joinedGroup,
    groupInvitation
  } = await loginAndAcceptGroupInvitation(createdRequest, secondLoginInput);
  return {
    token,
    groupUuid,
    senderUsername: inviter.username,
    recipientUsername: username
  };
};

const getDirectChatTestables = async username => {
  const user = await getUserByUsername(username);
  console.log("got the user: ", user);
  const groupActivities = await retrieveGroupActivitiesList(
    user.groupActivities
  );
  console.log("got the groupActivities: ", groupActivities);
  const directChats = await retrieveChatsList(groupActivities[0].directChats);
  console.log("got the directChats: ", directChats);
  const messages = await retrieveMessageList(directChats[0].messages);
  console.log("got the messages: ", messages);
  return { groupActivities, directChats, messages };
};

module.exports = {
  chatCreationTestFixtureSetup: chatCreationTestFixtureSetup,
  getDirectChatTestables: getDirectChatTestables
};
