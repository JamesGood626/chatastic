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
const createGroupInvitationMutation = `mutation createGroupInvitationOp($input: CreateGroupInvitationInput!) {
  createGroupInvitation(input: $input) {
    groupInvitation { 
      uuid
      group {
        title
      }
      inviter {
        username
        firstname
      }
      invitee {
        username
        firstname
      }
    }
  }
}`;

const acceptGroupInvitationMutation = `mutation acceptGroupInvitationOp($input: AcceptGroupInvitationInput!) {
  acceptGroupInvitation(input: $input) {
    acceptedStatus {
      acceptedMessage
      joinedGroup {
        uuid
        members {
          uuid
          firstname
          lastname
          username
        }
      }
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
const createGroupInvitationGQLRequest = async (
  createdRequest,
  token,
  groupInvitationInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createGroupInvitationMutation,
    "createGroupInvitationOp",
    groupInvitationInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("createGroupInvitation response body: ", response.body);
  }
  return response.body.data.createGroupInvitation;
};

const acceptGroupInvitationGQLRequest = async (
  createdRequest,
  token,
  acceptGroupInvitationInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    acceptGroupInvitationMutation,
    "acceptGroupInvitationOp",
    acceptGroupInvitationInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("acceptGroupInvitation response body: ", response.body);
  }
  return response.body.data.acceptGroupInvitation;
};

module.exports = {
  createGroupInvitationGQLRequest: createGroupInvitationGQLRequest,
  acceptGroupInvitationGQLRequest: acceptGroupInvitationGQLRequest
};
