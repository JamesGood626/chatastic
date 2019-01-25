const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");

const saltAmount = process.env.NODE_ENV === "test" ? 1 : 10;

const hashPasswordAndSaveUser = (user, password, saltRounds = saltAmount) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.log("error generating salt: ", err);
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.log("error hashing password: ", err);
        }
        user.password = hash;
        user.uuid = uuidv4();
        const [error, savedUser] = await to(user.save());
        resolve(user);
      });
    });
  });
};

module.exports = hashPasswordAndSaveUser;
