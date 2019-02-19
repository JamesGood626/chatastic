process.env.TEST_SUITE = "chat-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const User = require("../../Accounts/model/user");
const Group = require("../../Groups/model/group");
const Chat = require("../model/chat");
const { Message, MessageEdge } = require("../../Messages/model/message");
const { dropCollection } = require("../../testHelpers");
const {
  chatCreationTestFixtureSetup,
  getDirectChatTestables
} = require("../../testHelpers/chatOperations");
const {
  createUserGQLRequest,
  loginUserGQLRequest
} = require("../../testHelpers/accountsRequest");
const {
  createGroupGQLRequest,
  getGroupGQLRequest
} = require("../../testHelpers/groupsRequest");
const {
  createDirectChatGQLRequest,
  createGroupChatGQLRequest,
  updateGroupChatParticipationGQLRequest
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

const groupChatInput = {
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
    messageConnection: senderDirectChatMessages
  } = await getDirectChatTestables(senderUsername);
  const {
    groupActivities: recipientGroupActivities,
    directChats: recipientDirectChats,
    messageConnection: recipientDirectChatMessages
  } = await getDirectChatTestables(recipientUsername);
  return {
    token,
    groupUuid,
    senderGroupActivities,
    recipientGroupActivities,
    senderDirectChats,
    recipientDirectChats,
    senderDirectChatMessages,
    recipientDirectChatMessages
  };
};

const groupChatCreationSetup = async (
  createdRequest,
  token,
  groupInput,
  groupChatInput
) => {
  // Need uuid for more testing after chat is added.
  const {
    group: { uuid }
  } = await createGroupGQLRequest(createdRequest, token, groupInput);
  groupChatInput.groupUuid = uuid;
  const {
    chat: { title, channel }
  } = await createGroupChatGQLRequest(createdRequest, token, groupChatInput);
  const getGroupInput = {
    groupUuid: uuid
  };
  const {
    group: { chats, members }
  } = await getGroupGQLRequest(createdRequest, getGroupInput);
  return { uuid, title, chats, members, channel };
};

const dropAll = async () => {
  await dropCollection(MessageEdge);
  await dropCollection(Chat);
  await dropCollection(Group);
  await dropCollection(User);
};

// Could go further with these tests by repeating this with a third user that's part of the same group, and then
// ensuring that he isn't able to see any of the direct messages between two users.
describe("With the Chat resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;
  let directChatTestData;
  let groupOneUuid;
  let groupTwoUuid;
  let chatChannel;
  let chatTitle;
  let groupChats;
  let groupMembers;

  beforeAll(async done => {
    server = await httpServer.listen(3001);
    createdRequest = await request.agent(server);
    await dropAll();
    await createUserGQLRequest(createdRequest, userOne);
    await createUserGQLRequest(createdRequest, userTwo);
    const data = await createDirectChatTestSetup(createdRequest);
    directChatTestData = data;
    const {
      uuid,
      title,
      chats,
      members,
      channel
    } = await groupChatCreationSetup(
      createdRequest,
      data.token,
      groupInput,
      groupChatInput
    );
    groupOneUuid = data.groupUuid;
    groupTwoUuid = uuid;
    chatTitle = title;
    chatChannel = channel;
    groupChats = chats;
    groupMembers = members;
    done();
  });

  afterAll(async done => {
    // await dropAll();
    await server.close(done);
  });

  test("create a direct chat", async done => {
    const data = directChatTestData;
    const senderDirectChatMessages = data.senderDirectChatMessages.edges;
    const recipientDirectChatMessages = data.recipientDirectChatMessages.edges;
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
    expect(senderDirectChatMessages.length).toBe(1);
    expect(recipientDirectChatMessages.length).toBe(1);
    expect(senderDirectChatMessages[0].node.text).toBe(
      "The start of something amazing."
    );
    expect(recipientDirectChatMessages[0].node.text).toBe(
      "The start of something amazing."
    );
    done();
  });

  test("create a group chat", async done => {
    expect(chatTitle).toBe("Group Chat");
    expect(groupChats.length).toBe(1);
    expect(groupChats[0].title).toBe("Group Chat");
    expect(groupMembers.length).toBe(1);
    expect(groupMembers[0].firstname).toBe("Sarah");
    done();
  });

  test("creating similar group chat titles in same group causes an error", async done => {
    const { errors, chat } = await createGroupChatGQLRequest(
      createdRequest,
      directChatTestData.token,
      groupChatInput
    );
    expect(chat).toBe(null);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('The title "Group Chat" already in use!');
    done();
  });

  test("creating similar group chat titles in different groups doesn't cause an error", async done => {
    // Use groupChat input using groupTwoUuid to create a similarly titled groupChat in different group.
    // groupChatInput.groupUuid = groupTwoUuid;
    const groupChatTwoInput = {
      title: "Group Chat",
      groupUuid: groupOneUuid
    };
    const {
      chat: { title }
    } = await createGroupChatGQLRequest(
      createdRequest,
      directChatTestData.token,
      groupChatTwoInput
    );
    expect(groupChatInput.title).toBe(title);
    done();
  });

  test("user can update whether they want to participate in a chat", async done => {
    const data = await updateGroupChatParticipationGQLRequest(
      createdRequest,
      directChatTestData.token,
      { groupUuid: groupTwoUuid, chatChannel }
    );
    expect(data.errors).toBe(null);
    expect(data.chat).toBe(null);
    expect(data.result).toBe("You've successfully left the chat!");
    done();
  });

  // TODO -> Test that user can rejoin a chat that they previously left.
});
