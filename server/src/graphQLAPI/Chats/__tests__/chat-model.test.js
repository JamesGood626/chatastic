process.env.TEST_SUITE = "chat-model-test";
const mongoose = require("mongoose");
const { createDirectChat, createGroupChat } = require("../services");
const { createMessage } = require("../../Messages/services");
const initMongoMongooseConnection = require("../../../middleware/mongo");
const { createUser, getUserByUsername } = require("../../Accounts/services");
const { dropUserCollection, dropChatCollection } = require("../../testHelpers");

const userInput = {
  firstname: "Sam",
  lastname: "Scoggin",
  username: "Scogsam",
  password: "theword"
};

const messageInput = {
  channel: "1201",
  text: "Legit message."
};

const directChatInput = {
  channel: "9001",
  dateSent: Date.now()
};

const groupChatInput = {
  channel: "23",
  title: "Slammin'"
};

describe("Chats can be", () => {
  // beforeAll(async done => {
  //   await initMongoMongooseConnection();
  //   done();
  // });

  // afterEach(async done => {
  //   await dropUserCollection();
  //   await dropChatCollection();
  //   done();
  // });

  // afterAll(async done => {
  //   await mongoose.disconnect();
  //   done();
  // });

  test("1+1 = 2", () => {
    expect(1 + 1).toBe(2);
  });

  // Group chat test

  // test("created as a direct chat", async done => {
  //   // sender(User) and message creation
  //   await createUser(userInput);
  //   const user = await getUserByUsername("Scogsam");
  //   messageInput.sender = user._id;
  //   const { _id } = await createMessage(messageInput);
  //   // Create direct chat
  //   const createdChat = await createDirectChat(directChatInput, _id);
  //   expect(createdChat.channel).toBe("9001");
  //   expect(createdChat.messages.length).toBe(1);
  //   done();
  // });
});
