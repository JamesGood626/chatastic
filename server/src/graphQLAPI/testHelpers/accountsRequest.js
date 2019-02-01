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
const createUserMutation = `mutation createUserOp($input: CreateUserInput!) {
  createUser(input: $input) {
    errors {
      key
      message
    }
    authenticatedUser {
      firstname
      lastname
      username
      token
      uuid
    }
  }
}`;

const loginUserMutation = `mutation loginUserOp($input: LoginUserInput!) {
  loginUser(input: $input) {
    errors {
      key
      message
    }
    authenticatedUser {
      firstname
      lastname
      username
      token
      groups {
        uuid
        title
      }
      groupActivities {
        groupUuid
        directChats {
          channel
          title
          messages {
            text
            sentDate
            senderUsername
          }
        }
      }
      groupInvitations {
        uuid
        group {
          uuid
          title
        }
        inviter {
          firstname
          lastname
          username
        }
        invitee {
          firstname
          lastname
          username
        }
      }
    }
  }
}`;

const userSearchQuery = `query getUserByUsernameOp ($input: UserSearchInput!) {
  getUserByUsername (input: $input) {
    errors {
      key
      message
    }
    user {
      uuid
      firstname
      lastname
      username
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
const createUserGQLRequest = async (
  createdRequest,
  userInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createUserMutation,
    "createUserOp",
    userInput
  );
  const response = await postRequest(createdRequest, operationInfo);
  if (debug) {
    console.log("createUser response body: ", response.body);
  }
  return response.body.data.createUser;
};
// commit auth fail

const loginUserGQLRequest = async (
  createdRequest,
  loginInput,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    loginUserMutation,
    "loginUserOp",
    loginInput
  );
  const response = await postRequest(createdRequest, operationInfo);
  if (debug) {
    console.log("loginUser response body: ", response.body);
  }
  return response.body.data.loginUser;
};

const getUserByUsernameGQLRequest = async (
  createdRequest,
  token,
  userSearchInput,
  debug = false
) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    userSearchQuery,
    "getUserByUsernameOp",
    userSearchInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("getUserByUsername response body: ", response.body);
  }
  return response.body.data.getUserByUsername;
};

module.exports = {
  createUserGQLRequest: createUserGQLRequest,
  loginUserGQLRequest: loginUserGQLRequest,
  getUserByUsernameGQLRequest: getUserByUsernameGQLRequest
};
