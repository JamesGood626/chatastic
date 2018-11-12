const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const User = require("../graphQLAPI/Accounts/model/user");

const localLogin = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    let user;
    try {
      user = await User.findOne({ username });
    } catch (err) {
      console.log("Error retrieving user in passport strategy: ", err);
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Incorrect username or password." });
    }
    console.log("Make it to last compare: ", user);
    return done(null, user);
  }
);

const initPassport = app => {
  passport.use(localLogin);
  app.use(passport.initialize());
};

module.exports = initPassport;
