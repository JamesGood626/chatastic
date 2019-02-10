const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");
const { ACCOUNT_CREATION_ERR_MESSAGE } = require("../../errorMessages");

const hashPasswordAndSaveUser = (user, password, saltRounds = 10) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        // Clientside approved generic error message.
        reject(ACCOUNT_CREATION_ERR_MESSAGE);
        // console.log should be removed in prod.
        // However, would this kind of information be valuable if logged?
        console.log("error generating salt: ", err);
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          // Clientside approved generic error message.
          reject(ACCOUNT_CREATION_ERR_MESSAGE);
          // console.log should be removed in prod.
          console.log("error hashing password: ", err);
        }
        user.password = hash;
        user.uuid = uuidv4();
        const [error, savedUser] = await to(user.save());
        if (error) {
          reject(error);
        }
        resolve(savedUser);
      });
    });
  });
};

module.exports = hashPasswordAndSaveUser;
