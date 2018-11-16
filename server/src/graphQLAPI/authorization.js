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
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error(TOKEN_DECODING_MESSAGE);
  }
};

const verifyAuthorization = async authorization => {
  let user;
  const { username, iat, exp } = decodeToken(authorization);
  if (username && iat < exp) {
    try {
      console.log("THE USER NAME BEING PASSED IN: ", username);
      user = await getUserByUsername(username);
      return user;
    } catch (e) {
      console.log("Error retrieving user by username: ", username);
    }
  } else {
    throw new Error(TOKEN_EXPIRED_MESSAGE);
  }
};

const authorizeRequest = async authorization => {
  let user;
  let errors = {};
  try {
    user = await verifyAuthorization(authorization);
  } catch (e) {
    errors.decodeTokenError =
      e.message === TOKEN_DECODING_MESSAGE ? TOKEN_DECODING_MESSAGE : null;
    errors.expiredTokenError =
      e.message === TOKEN_EXPIRED_MESSAGE ? TOKEN_EXPIRED_MESSAGE : null;
  }
  return { userId: user._id, errors };
};

module.exports = authorizeRequest;
