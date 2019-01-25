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
const retrieveMessagesQuery = `query retrieveMessagesByChatChannelOp($input: RetrieveMessagesInput!) {
  retrieveMessagesByChatChannel(input: $input) {
    errors {
      key
      message
    }
    messages {
      channel
      text
      cursor
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
const getMessagesByChatChannelGQLRequest = async (
  createdRequest,
  token,
  retrieveMessagesInput,
  debug = false
) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    retrieveMessagesQuery,
    "retrieveMessagesByChatChannelOp",
    retrieveMessagesInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("Retrieve message list response body: ", response.body);
  }
  return response.body.data.retrieveMessagesByChatChannel;
};

module.exports = {
  getMessagesByChatChannelGQLRequest: getMessagesByChatChannelGQLRequest
};
