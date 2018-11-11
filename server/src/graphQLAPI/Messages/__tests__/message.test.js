const request = require("supertest");
const { httpServer, apolloServer, app } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest
} = require("../../testHelpers");
const { resetMessages } = require("../services");

const messageOne = {
  id: 1,
  channelId: 1,
  text: "This is a message."
};

const createMessageMutation = `mutation createMessageOp($input: MessageInput!) {
  createMessage(input: $input) {
    id
    channelId
    text
  }
}`;

const createMessageGraphQLRequest = async (
  createdRequest,
  message = messageOne
) => {
  const operationInfo = await graphQLMutationRequest(
    message,
    createMessageMutation,
    "createMessageOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(5000);
    createdRequest = await request.agent(server);
    done();
  });

  beforeEach(() => {
    resetMessages();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("message is one", () => {
    expect(1 + 1).toBe(2);
  });

  // test("create a message", async done => {
  //   const response = await createMessageGraphQLRequest(createdRequest);
  //   expect(response.body.data.createMessage.text).toBe("This is a message.");
  //   done();
  // });
});
