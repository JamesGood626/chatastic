const { to } = require("await-to-js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const hashPasswordAndSaveUser = require("./bcryptUtils");
const { JWT_SECRET } = require("../../../config");
const {
  USERNAME_TAKEN_ERR_MESSAGE,
  UNEXPECTED_LOGIN_ERR_MESSAGE,
  LOGIN_ERR_MESSAGE
} = require("../../errorMessages");

const createJWToken = userCredentials => {
  // expires in one week.
  // could sign potentially throw an error? Look at the source code.
  const token = jwt.sign(userCredentials, JWT_SECRET, {
    expiresIn: 60 * 10080
  });
  return token;
};

// Could also refactor the resolve/reject GraphQL return values to instead
// build up an object literal and modify the values of the object throughout
// the function to accomodate for either a successful or failure result.
// Would save a few lines.
const verifyUserAuthenticationResult = (user, err, resolve, reject) => {
  if (err) {
    reject({
      errors: { key: "?", message: UNEXPECTED_LOGIN_ERR_MESSAGE },
      authenticatedUser: null
    });
  }
  if (!user) {
    reject({
      errors: { key: "?", message: LOGIN_ERR_MESSAGE },
      authenticatedUser: null
    });
  }
  // doing this to avoid exposing _id and password of user
  // to the client. See ./userType.js type AuthenticationResult
  const authorization = {
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    uuid: user.uuid,
    groups: user.groups,
    groupActivities: user.groupActivities,
    groupInvitations: user.groupInvitations,
    token: createJWToken({ username: user.username, password: user.password })
  };
  resolve({
    errors: null,
    authenticatedUser: authorization
  });
};

// This needs to be refactored... Because if will return different error messages depending on
// what dfunction is calling it.
const getUserByUsername = async username => {
  return new Promise(async (resolve, reject) => {
    const [err, user] = await to(User.findOne({ username }));
    if (err) {
      reject(err);
    }
    // Need to pass in a second arg that will indicate which operation
    // is being performed:
    // if it's login, just return err message username or password is incorrect.
    // If it's a user search to find a user to invite to a group
    // for authorizing a request
    resolve(user);
  });
};

const getUserByUuid = async uuid => {
  const user = await User.findOne({ uuid });
  return user;
};

const getUserById = async id => {
  const user = await User.findById(id);
  return user;
};

// Switched over to passing in the authorizeRequest function in to this function
// to mitigate issues related to circular imports since, authorizeRequest utilizes
// getUserByUsername from this file. Will more than likely switch over other resolvers
// to do the same.
const getUserByUsernameIfAuthorized = async (
  username,
  authorization,
  authorizeRequest
) => {
  let retrievedUser;
  let [err, { userId, errors }] = await to(authorizeRequest(authorization));
  if (err) {
    Promise.reject({
      errors: { key: "?", message: UNAUTHORIZED_REQUEST_MESSAGE },
      user: null
    });
  }
  if (userId) {
    [err, retrievedUser] = await to(getUserByUsername(username));
    if (err) {
      Promise.reject({
        errors: { key: "?", message: err },
        message: null,
        user: null
      });
    }
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  if (retrievedUser) {
    return Promise.resolve({
      errors: null,
      message: null,
      user: retrievedUser
    });
  } else {
    return Promise.resolve({
      errors: null,
      message: "User not found.",
      user: null
    });
  }
};

const createUser = input => {
  return new Promise(async (resolve, reject) => {
    let err;
    const { firstname, lastname, username, password } = input;
    [err, user] = await to(getUserByUsername(username));
    if (err) {
      reject({
        errors: { key: "?", message: err },
        authenticatedUser: null
      });
    }
    if (user) {
      reject({
        errors: { key: "?", message: USERNAME_TAKEN_ERR_MESSAGE },
        authenticatedUser: null
      });
    }
    const newUser = new User({ firstname, lastname, username });
    [err, { uuid }] = await to(hashPasswordAndSaveUser(newUser, password));
    if (err) {
      reject({
        errors: { key: "?", message: err },
        authenticatedUser: null
      });
    }
    const authorization = {
      firstname,
      lastname,
      username,
      uuid,
      token: createJWToken({ username, password })
    };
    resolve({
      errors: null,
      authenticatedUser: authorization
    });
  });
};

const loginUser = input => {
  const { username, password } = input;
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, _info, _status) => {
      return verifyUserAuthenticationResult(user, err, resolve, reject);
    })({ body: { username, password } });
  });
};

// Uhh... well actually if an error is thrown in an error resolver, then the
// regular GraphQL error should be populated if I'm not mistaken...
// So in this case where this is being used in the Group SubResolver I think that I'd
// want this to bubble up and cause the entire operation to fail anyway.
// Gonna need to look into this.
const retrieveMembersList = async memberIdArr => {
  if (memberIdArr.length > 1) {
    return await User.find({ _id: { $in: memberIdArr } });
  } else {
    const member = await User.findById(memberIdArr[0]);
    return [member];
  }
};

module.exports = {
  getUserByUsernameIfAuthorized,
  createUser,
  loginUser,
  getUserByUsername,
  getUserByUuid,
  getUserById,
  retrieveMembersList
};
