const TOKEN_EXPIRED_MESSAGE = "Token is expired.";
const TOKEN_DECODING_MESSAGE = "An error occured while decoding token.";
const ACCOUNT_CREATION_ERR_MESSAGE =
  "An error occured while creating your account.";
const USERNAME_TAKEN_ERR_MESSAGE = "That username is already taken.";
const UNEXPECTED_LOGIN_ERR_MESSAGE =
  "An error occured while logging you into your account.";
const LOGIN_ERR_MESSAGE = "Username or password is incorrect.";
// I figure this will just prompt the UI to redirect the user to the login page.
const UNAUTHORIZED_REQUEST_MESSAGE = "You must login to perform this action.";

module.exports = {
  // These first two messages shouldn't ever be used in production...
  TOKEN_EXPIRED_MESSAGE,
  TOKEN_DECODING_MESSAGE,
  ACCOUNT_CREATION_ERR_MESSAGE,
  USERNAME_TAKEN_ERR_MESSAGE,
  UNEXPECTED_LOGIN_ERR_MESSAGE,
  LOGIN_ERR_MESSAGE
};
