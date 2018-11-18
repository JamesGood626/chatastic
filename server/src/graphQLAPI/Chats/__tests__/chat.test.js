process.env.TEST_SUITE = "chat-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const User = require("../../Accounts/model/user");
const Group = require("../../Groups/model/group");
const Chat = require("../model/chat");
const Message = require("../../Messages/model/message");
const { dropCollection } = require("../../testHelpers");
const { createUserGQLRequest } = require("../../testHelpers/accountsRequest");
const { createGroupGQLRequest } = require("../../testHelpers/groupsRequest");
const {
  createGroupInvitationGQLRequest
} = require("../../testHelpers/groupInvitationsRequest");
const { createTwoUsers } = require("../../testHelpers/accountsOperations");
const { createGroupChatGQLRequest } = require("../../testHelpers/chatsRequest");
const { getUserByUuid } = require("../../Accounts/services");
const { getGroupByUuid } = require("../../Groups/services");
const { getGroupActivityById } = require("../../GroupActivities/services");

// NOTE!!!!! had to add groupUuid to accomodate checking whether
// a groupActivity has yet to be created upon creation of a directChat
// this is so that duplicate groupActivities will not be created.
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

const groupChat = {
  title: "Group Chat"
};

const groupOne = {
  title: "Group One"
};

describe("With the Chat resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  test("1+1 = 2", () => {
    expect(1 + 1).toBe(2);
  });

  // beforeAll(async done => {
  //   server = await httpServer.listen(3001);
  //   createdRequest = await request.agent(server);
  //   done();
  // });

  // afterEach(async done => {
  //   // await dropCollection(Message);
  //   await dropCollection(Chat);
  //   // await dropCollection(Group);
  //   await dropCollection(User);
  //   done();
  // });

  // afterAll(async done => {
  //   await server.close(done);
  // });

  // And this direct chat is precisely the reason I'm rewriting my tests and test helpers
  // By this point, I should already have tested that all of the:
  // User GraphQL requests
  // Group GraphQL requests
  // And Group Invitation GraphQL requests
  // All function as intended.
  // So I should be able to just wrap up the helper functions which perform
  // those into one big function that returns the required data to create a direct
  // chat which helps get me to the point where I'd start that process... and then focus
  // on testing that since it's the focal point of this test.

  // Should really ensure that these user's are both in the same group before creating this direct chat.
  // test("create a direct chat", async done => {
  //   const { userOneData, userTwoData } = await createTwoUsers(
  //     createdRequest,
  //     userOne,
  //     userTwo
  //   );
  //   const { uuid: firstRecipientUuid } = userOneData;
  //   const { uuid: senderUuid, token } = userTwoData;

  //   // Create group so that we can use the uuid in the directChat creation,
  //   // which will allow us to determine whether we need to create/update a
  //   // GroupActivity for the user's current groupActivity array.
  //   const createGroupResponse = await createGroupGQLRequest(
  //     createdRequest,
  //     token,
  //     groupOne
  //   );
  //   const { uuid: groupUuid } = createGroupResponse.body.data.createGroup;
  //   const createInvitationInput = {
  //     groupUuid,
  //     inviteeUuid: firstRecipientUuid,
  //     sentDate: Date.now()
  //   };
  //   // Need to invite the UserOne to group before creating direct chat
  //   const createGroupInvitiationResponse = await createGroupInvitationGQLRequest(
  //     createdRequest,
  //     createInvitationInput
  //   );
  //   console.log(
  //     "Create invitation response body: ",
  //     createGroupInvitiationResponse.body
  //   );
  //   directChat.groupUuid = groupUuid;
  //   directChat.senderUuid = senderUuid;
  //   directChat.recipientUuid = firstRecipientUuid;
  //   const response = await createDirectChatGQLRequest(
  //     createdRequest,
  //     token,
  //     directChat
  //   );
  //   console.log("A Successful creation of direct chat: ", response.body);
  //   const sender = await getUserByUuid(senderUuid);
  //   const recipient = await getUserByUuid(firstRecipientUuid);
  //   expect(sender.groupActivities.length).toBe(1);
  //   expect(recipient.groupActivities.length).toBe(1);
  //   const groupActivity = await getGroupActivityById(sender.groupActivities[0]);
  //   const {
  //     channel,
  //     messages,
  //     senderUuid: responseSenderUuid,
  //     recipientUuid: responseRecipientUuid
  //   } = response.body.data.createDirectChat;
  //   expect(responseSenderUuid).toBe(senderUuid);
  //   expect(responseRecipientUuid).toBe(firstRecipientUuid);
  //   expect(channel.length).toBe(72);
  //   expect(messages.length).toBe(1);
  //   expect(messages[0].text).toBe("The start of something amazing.");
  //   // Will later use new Date() on the client side to convert to date.
  //   expect(typeof messages[0].sentDate).toBe("number");
  //   expect(messages[0].sender.uuid).toBe(senderUuid);
  //   expect(messages[0].sender.firstname).toBe("Tom");
  //   expect(messages[0].sender.lastname).toBe("Scoggin");
  //   // Now we need to test that a new chat opened between two different users in the same group
  //   // won't add a duplicate groupActivity model to one of the users that previously established a direct chat
  //   // with each other.
  //   const createUserThreeResponse = await createUserGQLRequest(
  //     createdRequest,
  //     userThree
  //   );
  //   const {
  //     uuid: secondRecipientUuid
  //   } = createUserThreeResponse.body.data.createUser;
  //   secondDirectChat.groupUuid = groupUuid;
  //   secondDirectChat.senderUuid = senderUuid;
  //   secondDirectChat.recipientUuid = secondRecipientUuid;
  //   const createDirectTwoResponse = await createDirectChatGraphQLRequest(
  //     createdRequest,
  //     token,
  //     secondDirectChat
  //   );
  //   const updatedSender = await getUserByUuid(senderUuid);
  //   const secondRecipient = await getUserByUuid(firstRecipientUuid);
  //   expect(updatedSender.groupActivities.length).toBe(2);
  //   expect(secondRecipient.groupActivities.length).toBe(1);
  //   // The last thing would be to ensure that additional messages are added to the
  //   // groupActivities -> directChats -> messages array...
  //   // Not gonna test that now. But could do that here or
  //   // back in the message.test.js file
  //   done();
  // });

  // test("create a group chat", async done => {
  //   const createUserResponse = await createUserGraphQLRequest(
  //     createdRequest,
  //     userTwo
  //   );
  //   const { token } = createUserResponse.body.data.createUser;
  //   const createGroupResponse = await createGroupGraphQLRequest(
  //     createdRequest,
  //     token,
  //     groupOne
  //   );
  //   // Need uuid for more testing after chat is added.
  //   const { uuid } = createGroupResponse.body.data.createGroup;
  //   groupChat.groupUuid = uuid;
  //   const createGroupChatResponse = await createGroupChatGraphQLRequest(
  //     createdRequest,
  //     token,
  //     groupChat
  //   );
  //   const { title } = createGroupChatResponse.body.data.createGroupChat;
  //   const getGroupInput = {
  //     groupUuid: uuid
  //   };
  //   const getGroupResponse = await getGroupGraphQLRequest(
  //     createdRequest,
  //     getGroupInput
  //   );
  //   const { chats, members } = getGroupResponse.body.data.getGroup;
  //   expect(title).toBe("Group Chat");
  //   expect(chats.length).toBe(1);
  //   expect(chats[0].title).toBe("Group Chat");
  //   expect(members.length).toBe(1);
  //   expect(members[0].firstname).toBe("Tom");
  //   done();
  // });
});
