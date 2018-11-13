const request = require("supertest");
const { httpServer } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  dropChatCollection,
  dropMessageCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest
} = require("../../testHelpers");
const { getUserByUuid } = require("../../Accounts/services");

const userOne = {
  firstname: "Joe",
  lastname: "Salmon",
  username: "joesal",
  password: "sardines"
};

const userTwo = {
  firstname: "Sam",
  lastname: "Scoggin",
  username: "SamTimeTwo",
  password: "theword"
};

const chatOne = {
  messageInput: {
    text: "The start of something amazing.",
    sentDate: Date.now()
  }
};

const createDirectChatMutation = `mutation createDirectChatOp($input: CreateDirectChatInput!) {
                                    createDirectChat(input: $input) {
                                      channel
                                      messages {
                                        text
                                        sentDate
                                        sender {
                                          uuid
                                          firstname
                                          lastname
                                          chats {
                                            id
                                            channel
                                          }
                                        }
                                      }
                                    }
                                  }`;

const createDirectChatGraphQLRequest = async (createdRequest, token, chat) => {
  const operationInfo = await graphQLMutationRequest(
    chat,
    createDirectChatMutation,
    "createDirectChatOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

describe("With Chat resources a user may", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(2020);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(async done => {
    await dropUserCollection();
    await dropChatCollection();
    await dropMessageCollection();
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a direct chat", async done => {
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
    chatOne.recipientUuid = uuid;
    const response = await createDirectChatGraphQLRequest(
      createdRequest,
      token,
      chatOne
    );
    const { channel, messages } = response.body.data.createDirectChat;
    expect(channel.length).toBe(72);
    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe("The start of something amazing.");
    // Will later use new Date() on the client side to convert to date.
    expect(typeof messages[0].sentDate).toBe("number");
    const { sender } = messages[0];
    expect(sender.uuid).toBe(senderUuid);
    expect(sender.firstname).toBe("Sam");
    expect(sender.lastname).toBe("Scoggin");
    expect(sender.chats.length).toBe(1);
    // Now check the recipient user's chats length
    const recipientUser = await getUserByUuid(uuid);
    expect(recipientUser.chats.length).toBe(1);
    // And finally, make sure they share the same chat
    expect(sender.chats[0].id).toBe(recipientUser.chats[0].toString());
    done();
  });
});
