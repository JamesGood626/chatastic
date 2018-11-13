const mongoose = require("mongoose");
const { createDirectChat, createGroupChat } = require("../services");
const { createMessage } = require("../../Messages/services");
const initMongoMongooseConnection = require("../../../middleware/mongo");
const { createUser, getUserByUsername } = require("../../Accounts/services");
const { dropUserCollection } = require("../../testHelpers");

// input CreateDirectChatInput {
//   channel: String!
//   message: String!
// }

// input CreateGroupChatInput {
//   channel: String!
//   title: String!
// }

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
  beforeAll(async done => {
    await initMongoMongooseConnection();
    done();
  });

  afterEach(async done => {
    await dropUserCollection();
    done();
  });

  afterAll(async done => {
    await mongoose.disconnect();
    done();
  });

  test("created as a direct chat", async done => {
    // sender(User) and message creation
    await createUser(userInput);
    const user = await getUserByUsername("Scogsam");
    messageInput.sender = user._id;
    const { _id } = await createMessage(messageInput);
    // Create direct chat
    const createdChat = await createDirectChat(directChatInput, _id);
    expect(createdChat.channel).toBe("9001");
    expect(createdChat.messages.length).toBe(1);
    done();
  });
});
