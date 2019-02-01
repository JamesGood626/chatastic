process.env.TEST_SUITE = "chat-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const User = require("../../Accounts/model/user");
const Group = require("../../Groups/model/group");
const Chat = require("../model/chat");
const Message = require("../../Messages/model/message");
const { dropCollection } = require("../../testHelpers");
const {
  chatCreationTestFixtureSetup,
  getDirectChatTestables
} = require("../../testHelpers/chatOperations");
const { createUserGQLRequest } = require("../../testHelpers/accountsRequest");
const {
  createGroupGQLRequest,
  getGroupGQLRequest
} = require("../../testHelpers/groupsRequest");
const {
  createDirectChatGQLRequest,
  createGroupChatGQLRequest
} = require("../../testHelpers/chatsRequest");

// NOTE!!!!! had to add groupUuid to accomodate checking whether
// a groupActivity has yet to be created upon creation of a directChat
// this is so that duplicate groupActivities will not be created.
const userOne = {
  firstname: "Sam",
  lastname: "Holland",
  username: "BamBamSam",
  password: "supa-secret"
};

const userTwo = {
  firstname: "Sarah",
  lastname: "Holland",
  username: "BamBamSar",
  password: "supa-secret"
};

const loginInput = {
  username: "BamBamSar",
  password: "supa-secret"
};

const secondLoginInput = {
  username: "BamBamSam",
  password: "supa-secret"
};

const userThree = {
  firstname: "Johnny",
  lastname: "Rockets",
  username: "Milkshake",
  password: "theword"
};

const directChat = {
  messageInput: {
    text: "The start of something amazing.",
    sentDate: Date.now()
  }
};

const secondDirectChat = {
  messageInput: {
    text: "But this is gonna be better.",
    sentDate: Date.now()
  }
};

const groupInput = {
  title: "Group One"
};

const groupInvitationInput = {
  sentDate: Date.now()
};

const groupChat = {
  title: "Group Chat"
};

const fixtureInput = {
  loginInput,
  groupInput,
  groupInvitationInput,
  secondLoginInput
};

const createDirectChatTestSetup = async createdRequest => {
  const {
    token,
    groupUuid,
    senderUsername,
    recipientUsername
  } = await chatCreationTestFixtureSetup(createdRequest, fixtureInput);
  directChat.groupUuid = groupUuid;
  directChat.senderUsername = senderUsername;
  directChat.recipientUsername = recipientUsername;
  await createDirectChatGQLRequest(createdRequest, token, directChat);
  // Just passing off the getting of the nested Mongo resources to a helper
  const {
    groupActivities: senderGroupActivities,
    directChats: senderDirectChats,
    messages: senderDirectChatMessages
  } = await getDirectChatTestables(senderUsername);
  const {
    groupActivities: recipientGroupActivities,
    directChats: recipientDirectChats,
    messages: recipientDirectChatMessages
  } = await getDirectChatTestables(recipientUsername);
  return {
    groupUuid,
    senderGroupActivities,
    recipientGroupActivities,
    senderDirectChats,
    recipientDirectChats,
    senderDirectChatMessages,
    recipientDirectChatMessages
  };
};

// Could go further with these tests by repeating this with a third user that's part of the same group, and then
// ensuring that he isn't able to see any of the direct messages between two users.
describe("With the Chat resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(3001);
    createdRequest = await request.agent(server);
    await createUserGQLRequest(createdRequest, userOne);
    await createUserGQLRequest(createdRequest, userTwo);
    done();
  });

  afterEach(async done => {
    await dropCollection(Message);
    await dropCollection(Chat);
    await dropCollection(Group);
    await dropCollection(User);
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a direct chat", async done => {
    const data = await createDirectChatTestSetup(createdRequest);
    // groupActivities checks
    expect(data.senderGroupActivities.length).toBe(1);
    expect(data.recipientGroupActivities.length).toBe(1);
    expect(data.senderGroupActivities[0].groupUuid).toBe(data.groupUuid);
    expect(data.recipientGroupActivities[0].groupUuid).toBe(data.groupUuid);
    // directChats checks
    expect(data.senderDirectChats.length).toBe(1);
    expect(data.recipientDirectChats.length).toBe(1);
    expect(data.senderDirectChats[0].senderUsername).toBe("BamBamSar");
    expect(data.recipientDirectChats[0].senderUsername).toBe("BamBamSar");
    // messages checks
    expect(data.senderDirectChatMessages.length).toBe(1);
    expect(data.recipientDirectChatMessages.length).toBe(1);
    expect(data.senderDirectChatMessages[0].text).toBe(
      "The start of something amazing."
    );
    expect(data.recipientDirectChatMessages[0].text).toBe(
      "The start of something amazing."
    );
    done();
  });

  test("create a group chat", async done => {
    const {
      authenticatedUser: { token }
    } = await createUserGQLRequest(createdRequest, userTwo);
    // Need uuid for more testing after chat is added.
    const { uuid } = await createGroupGQLRequest(
      createdRequest,
      token,
      groupInput
    );
    groupChat.groupUuid = uuid;
    const {
      chat: { title }
    } = await createGroupChatGQLRequest(createdRequest, token, groupChat);
    const getGroupInput = {
      groupUuid: uuid
    };
    const { chats, members } = await getGroupGQLRequest(
      createdRequest,
      getGroupInput
    );
    expect(title).toBe("Group Chat");
    expect(chats.length).toBe(1);
    expect(chats[0].title).toBe("Group Chat");
    expect(members.length).toBe(1);
    expect(members[0].firstname).toBe("Sarah");
    done();
  });
});
