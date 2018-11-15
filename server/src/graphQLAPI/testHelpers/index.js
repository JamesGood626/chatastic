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

const graphQLQueryWithVariablesRequest = (data, operation, opName) => {
  const operationInfo = {
    query: operation,
    operationName: opName,
    variables: {
      input: data
    }
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

// TO GET RID OF ALL THIS SIMILAR LOGIC.... JUST PASS IN THE MODEL AND A STRING AND OPERATE
// OFF OF THAT
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

const dropGroupInvitationCollection = async () => {
  await Group.remove({}, err => {
    if (err !== null) {
      console.log("Group Invitation Collection Drop Error: ", err);
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

const createGroupMutation = `mutation createGroupOp($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    uuid
    title
    creator {
      uuid
      username
      groups {
        title
      }
    }
  }
}`;

const createGroupGraphQLRequest = async (createdRequest, token, group) => {
  const operationInfo = await graphQLMutationRequest(
    group,
    createGroupMutation,
    "createGroupOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

const getGroupQuery = `query getGroupOp($input: GetGroupInput!) {
  getGroup(input: $input) {
    uuid
    title
    chats {
      title
    }
    members {
      firstname
    }
  }
}`;

const getGroupGraphQLRequest = async (createdRequest, input) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    input,
    getGroupQuery,
    "getGroupOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

// REMOVE NESTED CHATS FROM USERS AND IMPLEMENT THE CONCATENATED UUID SCHEME INSTEAD
const createDirectChatMutation = `mutation createDirectChatOp($input: CreateDirectChatInput!) {
  createDirectChat(input: $input) {
    channel
    messages {
      text
      sentDate
      sender {
        uuid
        firstname
        lastname
        chats {
          id
          channel
        }
      }
    }
  }
}`;

const createDirectChatGraphQLRequest = async (createdRequest, token, chat) => {
  const operationInfo = await graphQLMutationRequest(
    chat,
    createDirectChatMutation,
    "createDirectChatOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

module.exports = {
  graphQLQueryRequest: graphQLQueryRequest,
  graphQLQueryWithVariablesRequest: graphQLQueryWithVariablesRequest,
  graphQLMutationRequest: graphQLMutationRequest,
  postRequest: postRequest,
  postRequestWithHeaders: postRequestWithHeaders,
  dropUserCollection: dropUserCollection,
  dropGroupCollection: dropGroupCollection,
  dropGroupInvitationCollection: dropGroupInvitationCollection,
  dropChatCollection: dropChatCollection,
  dropMessageCollection: dropMessageCollection,
  createUserGraphQLRequest: createUserGraphQLRequest,
  loginUserGraphQLRequest: loginUserGraphQLRequest,
  createGroupGraphQLRequest: createGroupGraphQLRequest,
  createDirectChatGraphQLRequest: createDirectChatGraphQLRequest,
  getGroupGraphQLRequest: getGroupGraphQLRequest
};
