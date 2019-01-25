const {
  graphQLQueryRequest,
  graphQLQueryWithVariablesRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders
} = require("./index.js");

/**
 *
 *
 * GraphQL Documents
 *
 *
 */
// Remember to change sender&recipientUuid to Username in schema and chat's service index file
const createDirectChatMutation = `mutation createDirectChatOp($input: CreateDirectChatInput!) {
  createDirectChat(input: $input) {
    channel
    senderUsername
    recipientUsername
    messages {
      text
      sentDate
      senderUsername
    }
  }
}`;

const createGroupChatMutation = `mutation createGroupChatOp($input: CreateGroupChatInput!) {
  createGroupChat(input: $input) {
    title
    channel
  }
}`;

/**
 *
 *
 * GraphQL Request Functions
 *
 *
 */
const createDirectChatGQLRequest = async (
  createdRequest,
  token,
  chatInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createDirectChatMutation,
    "createDirectChatOp",
    chatInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) console.log("createDirectChat response body: ", response.body);
  return response.body.data.createDirectChat;
};

const createGroupChatGQLRequest = async (
  createdRequest,
  token,
  chatInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createGroupChatMutation,
    "createGroupChatOp",
    chatInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) console.log("createGroupChat response body: ", response.body);
  return response.body.data.createGroupChat;
};

module.exports = {
  createDirectChatGQLRequest: createDirectChatGQLRequest,
  createGroupChatGQLRequest: createGroupChatGQLRequest
};
