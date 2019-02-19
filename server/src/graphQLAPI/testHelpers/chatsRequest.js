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
    chat {
      channel
      senderUsername
      recipientUsername
      participating
      messages {
        edges {
          cursor
          node {
            text
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
    errors {
      key
      message
    }
  }
}`;

const createGroupChatMutation = `mutation createGroupChatOp($input: CreateGroupChatInput!) {
  createGroupChat(input: $input) {
    chat {
      title
      channel
    }
    errors {
      key
      message
    }
  }
}`;

const updateGroupChatParticipationMutation = `mutation updateGroupChatParticipationOp($input: UpdateGroupChatParticipationInput!) {
  updateGroupChatParticipation(input: $input) {
    chat {
      title
      channel
    }
    result
    errors {
      key
      message
    }
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
  if (debug) {
    console.log(
      "createDirectChat response body: ",
      response.body.data.createDirectChat.chat
    );
  }
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

const updateGroupChatParticipationGQLRequest = async (
  createdRequest,
  token,
  input,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    updateGroupChatParticipationMutation,
    "updateGroupChatParticipationOp",
    input
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug)
    console.log("updateGroupChatParticipation response body: ", response.body);
  return response.body.data.updateGroupChatParticipation;
};

module.exports = {
  createDirectChatGQLRequest: createDirectChatGQLRequest,
  createGroupChatGQLRequest: createGroupChatGQLRequest,
  updateGroupChatParticipationGQLRequest: updateGroupChatParticipationGQLRequest
};
