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
      groupActivities {
        groupUuid
      }
    }
  }
}`;

const getGroupQuery = `query getGroupOp($input: GetGroupInput!) {
  getGroup(input: $input) {
    uuid
    title
    chats {
      title
      messages {
        text
      }
    }
    members {
      firstname
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
const createGroupGQLRequest = async (
  createdRequest,
  token,
  groupInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createGroupMutation,
    "createGroupOp",
    groupInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("createGroup response body: ", response.body);
  }
  return response.body.data.createGroup;
};

const getGroupGQLRequest = async (createdRequest, input, debug = false) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    getGroupQuery,
    "getGroupOp",
    input
  );
  const response = await postRequest(createdRequest, operationInfo);
  if (debug) {
    console.log("getGroup response body: ", response.body);
  }
  return response.body.data.getGroup;
};

module.exports = {
  createGroupGQLRequest: createGroupGQLRequest,
  getGroupGQLRequest: getGroupGQLRequest
};
