const Message = require("../model/message");
const authorizeRequest = require("../../authorization");
const { getChatByChannel } = require("../../Chats/services");

const createMessage = input => {
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
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    console.log("Got input: ", input);
    const { chatChannel, ...messageInput } = input;
    const chat = await getChatByChannel(chatChannel);
    console.log("GOT THE CHAT BACK IN AUTHORIZED CHECK: ", chat);
    console.log("THE USER ID: ", userId);
    console.log("THE messageInput: ", messageInput);
    messageInput.sender = userId;
    messageInput.channel = chatChannel;
    createdMessage = await createMessage(messageInput);
    console.log("THE CREATED MESSAGE: ", createdMessage);
    chat.messages = [...chat.messages, createdMessage];
    await chat.save();
    console.log("THE SAVED CHAT: ", chat);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdMessage;
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
  retrieveMessageList: retrieveMessageList
};
