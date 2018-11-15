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
const { getUserByUuid } = require("../../Accounts/services");
const { getGroupByUuid } = require("../../Groups/services");

const userOne = {
  firstname: "Sarah",
  lastname: "Salmon",
  username: "sarsal",
  password: "sardines"
};

const userTwo = {
  firstname: "Tom",
  lastname: "Scoggin",
  username: "TomTimeTwo",
  password: "theword"
};

const directChat = {
  messageInput: {
    text: "The start of something amazing.",
    sentDate: Date.now()
  }
};

const groupChat = {
  title: "Group Chat"
};

const groupOne = {
  title: "Group One",
  creationDate: Date.now()
};

const createGroupChatMutation = `mutation createGroupChatOp($input: CreateGroupChatInput!) {
                                    createGroupChat(input: $input) {
                                      title
                                    }
                                  }`;

const createGroupChatGraphQLRequest = async (createdRequest, token, chat) => {
  const operationInfo = await graphQLMutationRequest(
    chat,
    createGroupChatMutation,
    "createGroupChatOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

describe("With the Chat resource a user may issue a GraphQL request to", () => {
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
    await dropGroupCollection();
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  // Should really ensure that these user's are both in the same group before creating this direct chat.
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
    directChat.recipientUuid = uuid;
    const response = await createDirectChatGraphQLRequest(
      createdRequest,
      token,
      directChat
    );
    const { channel, messages } = response.body.data.createDirectChat;
    expect(channel.length).toBe(72);
    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe("The start of something amazing.");
    // Will later use new Date() on the client side to convert to date.
    expect(typeof messages[0].sentDate).toBe("number");
    const { sender } = messages[0];
    expect(sender.uuid).toBe(senderUuid);
    expect(sender.firstname).toBe("Tom");
    expect(sender.lastname).toBe("Scoggin");
    // Now check the recipient user's chats length
    const recipientUser = await getUserByUuid(uuid);
    done();
  });

  test("create a group chat", async done => {
    const createUserResponse = await createUserGraphQLRequest(
      createdRequest,
      userTwo
    );
    const { token } = createUserResponse.body.data.createUser;
    const createGroupResponse = await createGroupGraphQLRequest(
      createdRequest,
      token,
      groupOne
    );
    // Need uuid for more testing after chat is added.
    const { uuid } = createGroupResponse.body.data.createGroup;
    groupChat.groupUuid = uuid;
    const createGroupChatResponse = await createGroupChatGraphQLRequest(
      createdRequest,
      token,
      groupChat
    );
    const { title } = createGroupChatResponse.body.data.createGroupChat;
    const getGroupInput = {
      groupUuid: uuid
    };
    const getGroupResponse = await getGroupGraphQLRequest(
      createdRequest,
      getGroupInput
    );
    const { chats, members } = getGroupResponse.body.data.getGroup;
    expect(title).toBe("Group Chat");
    expect(chats.length).toBe(1);
    expect(chats[0].title).toBe("Group Chat");
    expect(members.length).toBe(1);
    expect(members[0].firstname).toBe("Tom");
    done();
  });
});
