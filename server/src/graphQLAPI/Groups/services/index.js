const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const { ForbiddenError } = require("apollo-server");
const Group = require("../model/group");
const authorizeRequest = require("../../authorization");
const { getUserById } = require("../../Accounts/services");
const { addGroupActivity } = require("../../GroupActivities/services");
const {
  TOKEN_EXPIRED_MESSAGE,
  TOKEN_DECODING_MESSAGE
} = require("../../errorMessages");

const getGroupById = async id => {
  return await Group.findById(id);
};

const getGroupByUuid = async uuid => {
  return await Group.findOne({ uuid });
};

const createGroup = input => {
  return new Promise(async (resolve, reject) => {
    const group = new Group(input);
    try {
      await group.save();
      resolve(group);
    } catch (e) {
      console.log("Error saving group: ", e);
      reject(e.message);
    }
  });
};

const assignCreatorAndCreateGroup = async (userId, input) => {
  let createdGroup;
  let user;
  if (userId && input) {
    input.creator = userId;
    input.uuid = uuidv1() + uuidv4();
    input.members = [userId];
    user = await getUserById(userId);
    createdGroup = await createGroup(input);
    // !!!!! ******** !!!!!!!
    // Create the group activity and add it to the user's ensted group activity array.
    console.log("THIS INPUT SHOULD HAVE GROUP UUID: ", createdGroup);
    user = await addGroupActivity(user, createdGroup.uuid);
    user.groups = [...user.groups, createdGroup._id];
    await user.save();
    console.log("NESTED GROUP ON USER: ", user);
    return createdGroup;
  } else {
    throw new Error("Something went wrong while creating group");
  }
};

const createGroupIfAuthorized = async (input, authorization) => {
  let createdGroup;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    createdGroup = await assignCreatorAndCreateGroup(userId, input);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdGroup;
};

const retrieveGroupsList = async groupIdArr => {
  if (groupIdArr.length > 1) {
    return await Group.find({ _id: { $in: groupIdArr } });
  } else {
    const group = await Group.findById(groupIdArr[0]);
    return [group];
  }
};

module.exports = {
  getGroupById: getGroupById,
  getGroupByUuid: getGroupByUuid,
  createGroupIfAuthorized: createGroupIfAuthorized,
  retrieveGroupsList: retrieveGroupsList
};
