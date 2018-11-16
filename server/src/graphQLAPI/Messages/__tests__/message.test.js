process.env.TEST_SUITE = "model-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  dropChatCollection,
  dropGroupCollection,
  dropMessageCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest,
  createGroupGraphQLRequest,
  createDirectChatGraphQLRequest,
  getGroupGraphQLRequest
} = require("../../testHelpers");

const userOne = {
  firstname: "Sarah",
  lastname: "Salmon",
  username: "sarsal",
  password: "sardines"
};

const userTwo = {
  firstname: "Phil",
  lastname: "Knight",
  username: "pk",
  password: "pk"
};

const directChat = {
  messageInput: {
    text: "The start of something amazing.",
    sentDate: Date.now()
  }
};

const messageOne = {
  text: "This is a message.",
  sentDate: Date.now()
};

const createMessageMutation = `mutation createMessageInExistingChatOp($input: createMessageInExistingChatInput!) {
                                createMessageInExistingChat(input: $input) {
                                  channel
                                  text
                                  sender {
                                    firstname
                                  }
                                }
                              }`;

const createMessageGraphQLRequest = async (
  createdRequest,
  token,
  message = messageOne
) => {
  const operationInfo = await graphQLMutationRequest(
    message,
    createMessageMutation,
    "createMessageInExistingChatOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  return response;
};

describe("With Message resources a user may", () => {
  let createdRequest;
  let server;

  // test("1+1 = 2", () => {
  //   expect(1 + 1).toBe(2);
  // });

  beforeAll(async done => {
    server = await httpServer.listen(3004);
    createdRequest = await request.agent(server);
    done();
  });

  beforeEach(async done => {
    await dropMessageCollection();
    await dropChatCollection();
    await dropUserCollection();
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a message", async done => {
    const createUserOneResponse = await createUserGraphQLRequest(
      createdRequest,
      userOne
    );
    const createUserTwoResponse = await createUserGraphQLRequest(
      createdRequest,
      userTwo
    );
    const { uuid } = createUserOneResponse.body.data.createUser;
    const {
      token,
      uuid: senderUuid
    } = createUserTwoResponse.body.data.createUser;
    // Phil sending Sarah a message
    directChat.senderUuid = senderUuid;
    directChat.recipientUuid = uuid;
    const createDirectChatResponse = await createDirectChatGraphQLRequest(
      createdRequest,
      token,
      directChat
    );
    const {
      channel,
      messages
    } = createDirectChatResponse.body.data.createDirectChat;
    // Need to add chatChannel before sending request
    messageOne.chatChannel = channel;
    // !!**!! Still needed to test that a message
    const response = await createMessageGraphQLRequest(createdRequest, token);
    expect(response.body.data.createMessageInExistingChat.text).toBe(
      "This is a message."
    );
    // !!**!! Once user's have nested Group Activities on them, refetch both of the users and verify
    // that the new message was added to their direct chat's message array
    done();
  });
});
