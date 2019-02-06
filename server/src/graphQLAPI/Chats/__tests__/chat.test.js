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
  await createDirectChatGQLRequest(createdRequest, token, directChat, true);
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
    chat: { title }
  } = await createGroupChatGQLRequest(
    createdRequest,
    token,
    groupChatInput,
    true
  );
  const getGroupInput = {
    groupUuid: uuid
  };
  const {
    group: { chats, members }
  } = await getGroupGQLRequest(createdRequest, getGroupInput);
  return { uuid, title, chats, members };
};

// Could go further with these tests by repeating this with a third user that's part of the same group, and then
// ensuring that he isn't able to see any of the direct messages between two users.
describe("With the Chat resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;
  let directChatTestData;
  let chatTitle;
  let groupChats;
  let groupMembers;

  beforeAll(async done => {
    server = await httpServer.listen(3001);
    createdRequest = await request.agent(server);
    await createUserGQLRequest(createdRequest, userOne);
    await createUserGQLRequest(createdRequest, userTwo);
    const data = await createDirectChatTestSetup(createdRequest);
    groupOneUuid = data.groupUuid;
    directChatTestData = data;
    const { uuid, title, chats, members } = await groupChatCreationSetup(
      createdRequest,
      data.token,
      groupInput,
      groupChatInput
    );
    groupTwoUuid = uuid;
    chatTitle = title;
    groupChats = chats;
    groupMembers = members;
    done();
  });

  // afterEach(async done => {
  //   done();
  // });

  afterAll(async done => {
    await dropCollection(Message);
    await dropCollection(Chat);
    await dropCollection(Group);
    await dropCollection(User);
    await server.close(done);
  });

  test("create a direct chat", async done => {
    const data = directChatTestData;
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

  // test("creating similar group chat titles in different groups doesn't cause an error", async done => {
  //   // Use groupChat input using groupTwoUuid to create a similarly titled groupChat in different group.
  //   // groupChatInput.groupUuid = groupTwoUuid;
  //   const groupChatTwoInput = {
  //     title: "Group Chat",
  //     groupUuid: groupTwoUuid
  //   };
  //   const {
  //     chat: { title }
  //   } = await createGroupChatGQLRequest(
  //     createdRequest,
  //     directChatTestData.token,
  //     groupChatTwoInput
  //   );
  //   expect(groupChatInput.title).toBe(title);
  //   done();
  // });
});
