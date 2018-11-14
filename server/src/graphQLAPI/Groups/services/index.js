const uuidv4 = require("uuid/v4");
const { ForbiddenError } = require("apollo-server");
const Group = require("../model/group");
const authorizeRequest = require("../../authorization");
const {
  TOKEN_EXPIRED_MESSAGE,
  TOKEN_DECODING_MESSAGE
} = require("../../errorMessages");

const getGroupByUuid = async uuid => {
  const group = await Group.findOne({ uuid });
  return group;
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
  if (userId && input) {
    input.creator = userId;
    input.uuid = uuidv4();
    input.members = [userId];
    createdGroup = await createGroup(input);
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

module.exports = {
  getGroupByUuid: getGroupByUuid,
  createGroupIfAuthorized: createGroupIfAuthorized
};
