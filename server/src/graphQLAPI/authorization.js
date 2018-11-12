const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { getUserByUsername } = require("./Accounts/services");

const decodeToken = token => {
  const splitToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("An error occured while decoding token.");
  }
};

const verifyAuthorization = async authorization => {
  let user;
  const { username, iat, exp } = decodeToken(authorization);
  if (username && iat < exp) {
    try {
      user = await getUserByUsername(username);
      return user;
    } catch (e) {
      console.log("Error retrieving user by username: ", username);
    }
  } else {
    throw new Error("Token is expired.");
  }
};

const authorizeRequest = async authorization => {
  let user;
  let expired;
  try {
    user = await verifyAuthorization(authorization);
  } catch (e) {
    expired = e.message;
  }
  return { user, expired };
};

module.exports = authorizeRequest;
