const uuidv4 = require("uuid/v4");
const authorizeRequest = require("../../authorization");
const GroupInvitation = require("../model/groupInvitation");
// const { createMessage } = require("../../messages/services");
// const { getUserById, getUserByUuid } = require("../../Accounts/services");
const { getGroupById, getGroupByUuid } = require("../../Groups/services");
const { getUserByUuid } = require("../../Accounts/services");

const getGroupInvitationByUuid = async uuid => {
  return await GroupInvitation.findOne({ uuid });
};

const createGroupInvitation = (input, userId) => {
  return new Promise(async (resolve, reject) => {
    const { groupUuid, inviteeUuid, ...groupInvitationInput } = input;
    const invitee = await getUserByUuid(inviteeUuid);
    const group = await getGroupByUuid(groupUuid);
    groupInvitationInput.inviter = userId;
    groupInvitationInput.invitee = invitee._id;
    groupInvitationInput.group = group._id;
    groupInvitationInput.uuid = uuidv4();
    console.log("THE INPUT BEFORE CREATION: ", groupInvitationInput);
    const groupInvitation = new GroupInvitation(groupInvitationInput);
    try {
      await groupInvitation.save();
      console.log("THE SAVED GROUP INVITATION: ", groupInvitation);
      resolve(groupInvitation);
    } catch (e) {
      console.log("Error saving chat: ", e);
      reject(e.message);
    }
  });
};

const acceptGroupInvitation = async (input, userId) => {
  const { invitationUuid } = input;
  const { group: groupId } = await getGroupInvitationByUuid(invitationUuid);
  console.log("SHOULD BE THE GROUP ID: ", groupId);
  const group = await getGroupById(groupId);
  group.members = [...group.members, userId];
  group.save();
  return true;
};

// Could just replace createGroupInvitation with a Higher Order Function and jsut
// call it inside to prevent the three times copy.
const acceptGroupInvitationIfAuthorized = async (input, authorization) => {
  let joinedGroup;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    joinedGroup = await acceptGroupInvitation(input, userId);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return joinedGroup;
};

const declineGroupInvitationIfAuthorized = async (input, authorization) => {
  let deletedInvitation;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    deletedInvitation = await declineGroupInvitation(input, userId);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return deletedInvitation;
};

const createGroupInvitationIfAuthorized = async (input, authorization) => {
  let createdChat;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    createdChat = await createGroupInvitation(input, userId);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdChat;
};

const retrieveGroupInvitationList = async chatIdArr => {
  if (chatIdArr.length > 1) {
    return await Chat.find({ _id: { $in: chatIdArr } });
  } else {
    const chat = await Chat.findById(chatIdArr[0]);
    return [chat];
  }
};

module.exports = {
  createGroupInvitation: createGroupInvitation,
  acceptGroupInvitationIfAuthorized: acceptGroupInvitationIfAuthorized,
  declineGroupInvitationIfAuthorized: declineGroupInvitationIfAuthorized,
  createGroupInvitationIfAuthorized: createGroupInvitationIfAuthorized,
  retrieveGroupInvitationList: retrieveGroupInvitationList
};
