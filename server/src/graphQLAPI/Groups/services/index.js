const { ForbiddenError } = require("apollo-server");
const Group = require("../model/group");
const authorizeRequest = require("../../authorization");
const {
  TOKEN_EXPIRED_MESSAGE,
  TOKEN_DECODING_MESSAGE
} = require("../../errorMessages");

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

const assignCreatorAndCreateGroup = async (user, input) => {
  let createdGroup;
  if ((user, input)) {
    input.creator = user._id;
    if (user) {
      createdGroup = await createGroup(input);
      return createdGroup;
    } else {
      throw new Error("Something went wrong while creating group");
    }
  }
};

const createGroupIfUserAuthorizationSuccess = async (input, authorization) => {
  let createdGroup;
  const { user, errors } = await authorizeRequest(authorization);
  if (user) {
    createdGroup = await assignCreatorAndCreateGroup(user, input);
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
  createGroupIfUserAuthorizationSuccess: createGroupIfUserAuthorizationSuccess
};
