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

module.exports = {
  graphQLQueryRequest: graphQLQueryRequest,
  graphQLMutationRequest: graphQLMutationRequest,
  postRequest: postRequest
};
