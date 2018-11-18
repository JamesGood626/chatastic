const {
  createUserGQLRequest,
  loginUserGQLRequest
} = require("./accountsRequest");

// See loginUserMutation GraphQL Document in "./accountsRequest" for data returned
const createAndLoginUser = async (createdRequest, userInput, loginInput) => {
  await createUserGQLRequest(createdRequest, userInput);
  return await loginUserGQLRequest(createdRequest, loginInput);
};

// See createUserMutation GraphQL Document in "./accountsRequest" for data returned
const createTwoUsers = async (createdRequest, userOne, userTwo) => {
  const userOneData = await createUserGQLRequest(createdRequest, userOne);
  const userTwoData = await createUserGQLRequest(createdRequest, userTwo);
  return { userOneData, userTwoData };
};

module.exports = {
  createAndLoginUser: createAndLoginUser,
  createTwoUsers: createTwoUsers
};
