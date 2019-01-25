const {
  createUserGQLRequest,
  loginUserGQLRequest
} = require("./accountsRequest");

// commit auth fail
// See createUserMutation GraphQL Document in "./accountsRequest" for data returned
// for type AuthenticatedUser

const createAndLoginUser = async (createdRequest, userInput) => {
  return await createUserGQLRequest(createdRequest, userInput);
};

// See createUserMutation GraphQL Document in "./accountsRequest"
// for data returned for type User
const createTwoUsers = async (createdRequest, userOne, userTwo) => {
  const userOneData = await createUserGQLRequest(createdRequest, userOne);
  const userTwoData = await createUserGQLRequest(createdRequest, userTwo);
  return { userOneData, userTwoData };
};

module.exports = {
  createAndLoginUser: createAndLoginUser,
  createTwoUsers: createTwoUsers
};
