const uuidv4 = require("uuid/v4");
const authorizeRequest = require("../../authorization");
const GroupInvitation = require("../model/groupInvitation");
const { getGroupById, getGroupByUuid } = require("../../Groups/services");
const { getUserById, getUserByUuid } = require("../../Accounts/services");
const { addGroupActivity } = require("../../GroupActivities/services");

const getGroupInvitationByUuid = async uuid => {
  return await GroupInvitation.findOne({ uuid });
};

const createGroupInvitation = (input, userId) => {
  return new Promise(async (resolve, reject) => {
    const { groupUuid, inviteeUuid, ...groupInvitationInput } = input;
    const inviter = await getUserById(userId);
    const invitee = await getUserByUuid(inviteeUuid);
    const group = await getGroupByUuid(groupUuid);
    groupInvitationInput.inviter = userId;
    groupInvitationInput.invitee = invitee._id;
    groupInvitationInput.group = group._id;
    groupInvitationInput.uuid = uuidv4();
    const groupInvitation = new GroupInvitation(groupInvitationInput);
    try {
      await groupInvitation.save();
      inviter.groupInvitations = [groupInvitation, ...inviter.groupInvitations];
      invitee.groupInvitations = [groupInvitation, ...invitee.groupInvitations];
      await inviter.save();
      await invitee.save();
      resolve(groupInvitation);
    } catch (e) {
      console.log("Error saving chat: ", e);
      reject(e.message);
    }
  });
};

const acceptGroupInvitation = async (input, userId) => {
  const { invitationUuid } = input;
  const {
    _id,
    group: groupId,
    inviter: inviterId
  } = await getGroupInvitationByUuid(invitationUuid);
  const inviter = await getUserById(inviterId);
  const group = await getGroupById(groupId);
  group.members = [...group.members, userId];
  let user = await getUserById(userId);
  user = await addGroupActivity(user, group.uuid);
  user.groups = [group, ...user.groups];
  user.groupInvitations = user.groupInvitations.filter(
    invitation => invitation.toString() !== _id.toString()
  );
  inviter.groupInvitations = inviter.groupInvitations.filter(
    invitation => invitation.toString() !== _id.toString()
  );
  await user.save();
  await inviter.save();
  await group.save();
  return group;
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

const retrieveGroupInvitationList = async idArr => {
  if (idArr.length > 1) {
    return await GroupInvitation.find({ _id: { $in: idArr } });
  } else {
    const groupInvitation = await GroupInvitation.findById(idArr[0]);
    return [groupInvitation];
  }
};

module.exports = {
  createGroupInvitation: createGroupInvitation,
  acceptGroupInvitationIfAuthorized: acceptGroupInvitationIfAuthorized,
  declineGroupInvitationIfAuthorized: declineGroupInvitationIfAuthorized,
  createGroupInvitationIfAuthorized: createGroupInvitationIfAuthorized,
  retrieveGroupInvitationList: retrieveGroupInvitationList
};
