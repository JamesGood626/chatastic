const mongoose = require("mongoose");
const { createMessage } = require("../services");
const { createUser, getUserByUsername } = require("../../Accounts/services");
const initMongoMongooseConnection = require("../../../middleware/mongo");
const { dropUserCollection } = require("../../testHelpers");

const userOne = {
  firstname: "Sam",
  lastname: "Scoggin",
  username: "Scogsam",
  password: "theword"
};

// NOTE: channel will be supplied from chat to match the chat channel.
const messageOne = {
  channel: "1201",
  text: "Legit message."
};

describe("Messages can be", () => {
  beforeAll(async done => {
    await initMongoMongooseConnection();
    done();
  });

  afterAll(async done => {
    await mongoose.disconnect();
    done();
  });

  afterEach(async done => {
    await dropUserCollection();
    done();
  });

  test("created with user who sent message assigned as sender.", async done => {
    await createUser(userOne);
    const user = await getUserByUsername("Scogsam");
    messageOne.sentDate = Date.now();
    messageOne.sender = user;
    const createdMessage = await createMessage(messageOne);
    expect(createdMessage.channel).toBe("1201");
    expect(createdMessage.text).toBe("Legit message.");
    expect(createdMessage.sender.username).toBe("Scogsam");
    done();
  });
});
