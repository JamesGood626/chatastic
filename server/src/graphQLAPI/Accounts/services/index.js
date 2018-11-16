const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const hashPasswordAndSaveUser = require("./bcryptUtils");
const { JWT_SECRET } = require("../../../config");

const createJWToken = userCredentials => {
  // expires in one week.
  const token = jwt.sign(userCredentials, JWT_SECRET, {
    expiresIn: 60 * 10080
  });
  return token;
};

const verifyUserAuthenticationResult = (user, err, resolve, reject) => {
  if (err) {
    reject(err);
  }
  if (!user) {
    reject("Username or password is incorrect.");
  } else {
    const { firstname, lastname, username, uuid, password } = user;
    const authorization = {
      firstname,
      lastname,
      username,
      uuid,
      token: createJWToken({ username, password })
    };
    resolve(authorization);
  }
};

const getUserByUsername = async username => {
  console.log("ABOUT GET FIND USER BY USERNAME: ", username);
  const user = await User.findOne({ username });
  console.log("FOUND USER: ", user);
  return user;
};

const getUserByUuid = async uuid => {
  const user = await User.findOne({ uuid });
  //console.log("FOUND USER BY UUID: ", user);
  return user;
};

const getUserById = async id => {
  const user = await User.findById(id);
  //console.log("FOUND USER BY ID: ", user);
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
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    retrievedUser = await getUserByUsername(username);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  if (retrievedUser) {
    return retrievedUser;
  } else {
    return { message: "User not found." };
  }
};

const createUser = input => {
  return new Promise(async (resolve, reject) => {
    const { firstname, lastname, username, password } = input;
    try {
      const user = await User.findOne({ username });
      if (user) {
        return reject("User already exists");
      } else {
        const newUser = new User({ firstname, lastname, username });
        // Add in if else to lower saltRounds during testing
        const { uuid } = await hashPasswordAndSaveUser(newUser, password);
        const authorization = {
          firstname,
          lastname,
          username,
          uuid,
          token: createJWToken({ username, password })
        };
        resolve(authorization);
      }
    } catch (e) {
      reject("Something went wrong while creating user.");
    }
  });
};

const loginUser = (input, req) => {
  const { username, password } = input;
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, _info, _status) => {
      return verifyUserAuthenticationResult(user, err, resolve, reject);
    })({ body: { username, password } });
  });
};

const retrieveMembersList = async memberIdArr => {
  if (memberIdArr.length > 1) {
    return await User.find({ _id: { $in: memberIdArr } });
  } else {
    const member = await User.findById(memberIdArr[0]);
    return [member];
  }
};

module.exports = {
  getUserByUsernameIfAuthorized: getUserByUsernameIfAuthorized,
  createUser: createUser,
  loginUser: loginUser,
  getUserByUsername: getUserByUsername,
  getUserByUuid: getUserByUuid,
  getUserById: getUserById,
  retrieveMembersList: retrieveMembersList
};
