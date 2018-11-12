const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const hashPasswordAndSaveUser = require("./bcryptUtils");
const { JWT_SECRET } = require("../../../config");

// const allUsers = () => {
//   return Promise.resolve(users);
// };

// Unit test this...
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
    const { firstname, lastname, username, password } = user;
    const authorization = {
      firstname,
      lastname,
      username,
      token: createJWToken({ username, password })
    };
    resolve(authorization);
  }
};

const getUserByUsername = async username => {
  const user = await User.findOne({ username });
  console.log("FOUND USER: ", user);
  return user;
};

const getUserById = async id => {
  const user = await User.findById(id);
  console.log("FOUND USER BY ID: ", user);
  return user;
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
        await hashPasswordAndSaveUser(newUser, password);
        const authorization = {
          firstname,
          lastname,
          username,
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

module.exports = {
  // allUsers: allUsers,
  createUser: createUser,
  loginUser: loginUser,
  getUserByUsername: getUserByUsername,
  getUserById: getUserById
};

// Gonna need to do this check somewhere in resolvers
// After having put the token on the Authorization: Bearer <Token>
// try {
//   const decoded = jwt.verify(token, "wrong-secret");
//   console.log("IT'S DECODED: ", decoded);
// } catch (err) {
//   // err
//   console.log("ERR DECODING: ", err);
// }
