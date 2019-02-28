const { to } = require("await-to-js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { getUserByUsername } = require("./Accounts/services");
const {
  TOKEN_EXPIRED_MESSAGE,
  TOKEN_DECODING_MESSAGE
} = require("./errorMessages");
// const User = require("./Accounts/model/user");

const decodeToken = token => {
  const splitToken = token.split(" ")[1];
  try {
    // await-to-js not useful here as jwt.verify doesn't return a promise.
    // Will need to promisify this function call. But later..
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error(TOKEN_DECODING_MESSAGE);
  }
};

const verifyAuthorization = async authorization => {
  let user;
  let err;
  const { username, iat, exp } = decodeToken(authorization);
  if (username && iat < exp) {
    [err, user] = await to(getUserByUsername(username));
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(user);
  } else {
    // don't throw error, just return a promise
    throw new Error(TOKEN_EXPIRED_MESSAGE);
  }
};

const authorizeRequest = async authorization => {
  let user;
  let err;
  [err, user] = await to(verifyAuthorization(authorization));
  if (err) {
    return Promise.reject(err);
  }
  // Refactored away 2/27/2019
  // Should I include logic for doing a token refresh for expired tokens?
  // must look further into security matters...
  // try {
  //   [err, user] = await to(verifyAuthorization(authorization));
  //   if (err) {
  //     return Promise.reject(err);
  //   }
  // } catch (e) {
  //   errors.decodeTokenError =
  //     e.message === TOKEN_DECODING_MESSAGE ? TOKEN_DECODING_MESSAGE : null;
  //   errors.expiredTokenError =
  //     e.message === TOKEN_EXPIRED_MESSAGE ? TOKEN_EXPIRED_MESSAGE : null;
  // }
  const { _id, username, groupActivities } = user;
  return { userId: _id, username, groupActivities };
};

module.exports = authorizeRequest;
