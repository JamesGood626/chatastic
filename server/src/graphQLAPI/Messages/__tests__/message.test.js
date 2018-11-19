process.env.TEST_SUITE = "model-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const { dropCollection } = require("../../testHelpers");
const User = require("../../Accounts/model/user");
const Group = require("../../Groups/model/group");
const Chat = require("../../Chats/model/chat");
const Message = require("../model/message");
const { createUserGQLRequest } = require("../../testHelpers/accountsRequest");
const {
  createGroupGQLRequest,
  getGroupGQLRequest
} = require("../../testHelpers/groupsRequest");
const {
  createDirectChatGQLRequest,
  createGroupChatGQLRequest
} = require("../../testHelpers/chatsRequest");
// Todo -> create a messageRequest.js helper test file.
const {
  graphQLMutationRequest,
  postRequestWithHeaders
} = require("../../testHelpers/index.js");

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

const groupInput = {
  title: "Group One"
};

const groupChat = {
  title: "Ze Group Chat"
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

const messageTwo = {
  text: "This is a followup message.",
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
  message,
  debug = false
) => {
  const operationInfo = await graphQLMutationRequest(
    createMessageMutation,
    "createMessageInExistingChatOp",
    message
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  if (debug) {
    console.log(
      "Create message in existing chat response body: ",
      response.body
    );
  }
  return response.body.data.createMessageInExistingChat;
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
    await dropCollection(Message);
    await dropCollection(Chat);
    await dropCollection(Group);
    await dropCollection(User);
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a message in a group chat", async done => {
    const { token } = await createUserGQLRequest(createdRequest, userTwo);
    const { uuid } = await createGroupGQLRequest(
      createdRequest,
      token,
      groupInput
    );
    groupChat.groupUuid = uuid;
    const { title, channel } = await createGroupChatGQLRequest(
      createdRequest,
      token,
      groupChat
    );
    // Starting to create messages in the group chat
    messageOne.chatChannel = channel;
    const { text: messageOneText } = await createMessageGraphQLRequest(
      createdRequest,
      token,
      messageOne
    );
    messageTwo.chatChannel = channel;
    const { text: messageTwoText } = await createMessageGraphQLRequest(
      createdRequest,
      token,
      messageTwo
    );
    expect(messageOneText).toBe("This is a message.");
    expect(messageTwoText).toBe("This is a followup message.");
    //
    const getGroupInput = {
      groupUuid: uuid
    };
    const { chats } = await getGroupGQLRequest(
      createdRequest,
      getGroupInput,
      true
    );
    expect(chats[0].messages.length).toBe(2);
    done();
  });

  // test("create a message in a direct chat", async done => {
  //   const { username: senderUsername } = await createUserGQLRequest(
  //     createdRequest,
  //     userOne
  //   );
  //   const { token, username: recipientUsername } = await createUserGQLRequest(
  //     createdRequest,
  //     userTwo
  //   );
  //   const { uuid: groupUuid } = await createGroupGQLRequest(
  //     createdRequest,
  //     token,
  //     groupOne
  //   );
  //   // Phil sending Sarah a message
  //   directChat.groupUuid = groupUuid;
  //   directChat.senderUsername = senderUsername;
  //   directChat.recipientUsername = recipientUsername;
  //   console.log("before the error");
  //   const { channel, messages } = await createDirectChatGQLRequest(
  //     createdRequest,
  //     token,
  //     directChat
  //   );
  //   // Need to add chatChannel before sending request
  //   messageOne.chatChannel = channel;
  //   // !!**!! Still needed to test that a message
  //   const { text } = await createMessageGQLRequest(createdRequest, token);
  //   expect(text).toBe("This is a message.");
  //   // To better cover this scenario
  //   // I could grab the users by username and check that
  //   // their groupActivities and check that their shared chat has had a message
  //   // added to it.
  //   // !!**!! Once user's have nested Group Activities on them, refetch both of the users and verify
  //   // that the new message was added to their direct chat's message array
  //   done();
  // });
});
