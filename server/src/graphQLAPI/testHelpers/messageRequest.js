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
// expected return shape
// const messageResult = {
//   errors: null,
//   // type MessageConnection instance
//   messageconnection: {
//     edges: [
//       // type MessageEdge instances
//       { cursor: 1, node: { text: "message one" } },
//       { cursor: 2, node: { text: "message two" } }
//     ],
//     pageInfo: {
//       // type PageInfo instance
//       hasNextPage: true,
//       hasPreviousPage: false
//     }
//   }
// };

const getMessagesByChatChannelQuery = `query getMessagesByChatChannelOp($input: getMessagesByChatChannelInput!) {
  getMessagesByChatChannel(input: $input) {
    errors {
      key
      message
    }
    messageConnection {
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
  getMessagesByChatChannelInput,
  debug = false
) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    getMessagesByChatChannelQuery,
    "getMessagesByChatChannelOp",
    getMessagesByChatChannelInput
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log("Get message list response body: ", response.body);
  }
  return response.body.data.getMessagesByChatChannel;
};

module.exports = {
  getMessagesByChatChannelGQLRequest: getMessagesByChatChannelGQLRequest
};
