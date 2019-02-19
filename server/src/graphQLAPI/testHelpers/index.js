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

const graphQLQueryWithVariablesRequest = (operation, opName, inputData) => {
  const operationInfo = {
    query: operation,
    operationName: opName,
    variables: {
      input: inputData
    }
  };
  return operationInfo;
};

const graphQLMutationRequest = (operation, opName, inputData) => {
  const operationInfo = {
    query: operation,
    operationName: opName,
    variables: {
      input: inputData
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

// TO GET RID OF ALL THIS SIMILAR LOGIC.... JUST PASS IN THE MODEL AND A STRING AND OPERATE
// OFF OF THAT
const dropCollection = async Model => {
  await Model.deleteMany({}, err => {
    if (err !== null) {
      console.log(`${Model} Collection Drop Error: `, err);
    }
  });
};

module.exports = {
  graphQLQueryRequest: graphQLQueryRequest,
  graphQLQueryWithVariablesRequest: graphQLQueryWithVariablesRequest,
  graphQLMutationRequest: graphQLMutationRequest,
  postRequest: postRequest,
  postRequestWithHeaders: postRequestWithHeaders,
  dropCollection: dropCollection
};
