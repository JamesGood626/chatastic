const User = require("../Accounts/model/user");
const Group = require("../Groups/model/group");
const Chat = require("../Chats/model/chat");
const Message = require("../Messages/model/message");

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

const postRequestWithHeaders = async (createdRequest, operationInfo, token) => {
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${token}`)
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

const dropGroupCollection = async () => {
  await Group.remove({}, err => {
    if (err !== null) {
      console.log("Group Collection Drop Error: ", err);
    }
  });
};

const dropChatCollection = async () => {
  await Chat.remove({}, err => {
    if (err !== null) {
      console.log("Chat Collection Drop Error: ", err);
    }
  });
};

const dropMessageCollection = async () => {
  await Message.remove({}, err => {
    if (err !== null) {
      console.log("Message Collection Drop Error: ", err);
    }
  });
};

const createUserMutation = `mutation createUserOp($input: CreateUserInput!) {
                              createUser(input: $input) {
                                firstname
                                lastname
                                username
                                token
                                uuid
                              }
                            }`;

const loginUserMutation = `mutation loginUserOp($input: LoginUserInput!) {
                            loginUser(input: $input) {
                              firstname
                              lastname
                              username
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
  postRequestWithHeaders: postRequestWithHeaders,
  dropUserCollection: dropUserCollection,
  dropGroupCollection: dropGroupCollection,
  dropChatCollection: dropChatCollection,
  dropMessageCollection: dropMessageCollection,
  createUserGraphQLRequest: createUserGraphQLRequest,
  loginUserGraphQLRequest: loginUserGraphQLRequest
};
