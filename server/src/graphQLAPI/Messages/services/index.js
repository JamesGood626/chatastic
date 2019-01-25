const Message = require("../model/message");
const authorizeRequest = require("../../authorization");
const { getChatByChannel } = require("../../Chats/services");

const createMessage = (input, chat) => {
  return new Promise(async (resolve, reject) => {
    const message = new Message(input);
    try {
      await message.save();
      resolve(message);
    } catch (e) {
      console.log("Error saving message: ", e);
      reject(e.message);
    }
  });
};

// Refactor
const createMessageIfAuthorized = async (input, authorization) => {
  let createdMessage;
  const { userId, username, errors } = await authorizeRequest(authorization);
  if (userId) {
    const { chatChannel, ...messageInput } = input;
    const chat = await getChatByChannel(chatChannel);
    const length = chat.messages.length;
    messageInput.cursor = length + 1;
    messageInput.senderUsername = username;
    messageInput.channel = chatChannel;
    createdMessage = await createMessage(messageInput);
    chat.messages = [...chat.messages, createdMessage];
    await chat.save();
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdMessage;
};

// The service function that makes pagination possible
const retrieveMessagesIfAuthorized = async (input, authorization) => {
  let retrievedMessages;
  const { userId, username, errors } = await authorizeRequest(authorization);
  if (userId) {
    const { start, end, chatChannel } = input;
    retrievedMessages = await Message.find({
      channel: chatChannel
    });
    // THIS COULD WORK. using start - 1 && end - 1
    // HOWEVER, the cleaner solution would be to use some query
    // filters provided by mongoose, but you know... the documentation kind of sucks
    // Will look into this later
    retrievedMessages = retrievedMessages.slice(start - 1, end - 1);
    console.log("did retrieve messages: ", retrievedMessages);
  }
  return retrievedMessages;
};

const retrieveMessageList = async messageIdArr => {
  if (messageIdArr.length > 1) {
    return await Message.find({ _id: { $in: messageIdArr } });
  } else {
    const message = await Message.findById(messageIdArr[0]);
    return [message];
  }
};

module.exports = {
  createMessage: createMessage,
  createMessageIfAuthorized: createMessageIfAuthorized,
  retrieveMessagesIfAuthorized: retrieveMessagesIfAuthorized,
  retrieveMessageList: retrieveMessageList
};
