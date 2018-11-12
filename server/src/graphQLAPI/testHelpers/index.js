const User = require("../Accounts/model/user");

const graphQLQueryRequest = (operation, opName) => {
  const operationInfo = {
    query: operation,
    operationName: opName
  };
  return operationInfo;
};

const graphQLMutationRequest = (data, operation, opName) => {
  const operationInfo = {
    query: operation,
    operationName: opName,
    variables: {
      input: data
    }
  };
  return operationInfo;
};

const postRequest = async (createdRequest, operationInfo) => {
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .send(operationInfo);
  return response;
};

const dropUserCollection = async () => {
  await User.remove({}, err => {
    if (err !== null) {
      console.log("User Collection Drop Error: ", err);
    }
  });
};

const createUserMutation = `mutation createUserOp($input: CreateUserInput!) {
                              createUser(input: $input) {
                                firstname
                                lastname
                                token
                              }
                            }`;

const loginUserMutation = `mutation loginUserOp($input: LoginUserInput!) {
                            loginUser(input: $input) {
                              firstname
                              lastname
                              token
                            }
                          }`;

const createUserGraphQLRequest = async (createdRequest, user) => {
  const operationInfo = await graphQLMutationRequest(
    user,
    createUserMutation,
    "createUserOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

const loginUserGraphQLRequest = async (createdRequest, user) => {
  const operationInfo = await graphQLMutationRequest(
    user,
    loginUserMutation,
    "loginUserOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

module.exports = {
  graphQLQueryRequest: graphQLQueryRequest,
  graphQLMutationRequest: graphQLMutationRequest,
  postRequest: postRequest,
  dropUserCollection: dropUserCollection,
  createUserGraphQLRequest: createUserGraphQLRequest,
  loginUserGraphQLRequest: loginUserGraphQLRequest
};
