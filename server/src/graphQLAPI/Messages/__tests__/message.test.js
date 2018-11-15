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

  beforeAll(async done => {
    server = await httpServer.listen(5000);
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
    const response = await createMessageGraphQLRequest(createdRequest, token);
    console.log("THE RESPONSE BODY: ", response.body);
    // expect(response.body.data.createMessageInExistingChat.text).toBe(
    //   "This is a message."
    // );
    done();
  });
});
