const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const Chat = require("../model/chat");
const authorizeRequest = require("../../authorization");
const { createMessage } = require("../../messages/services");
const { getUserById, getUserByUuid } = require("../../Accounts/services");
const { getGroupByUuid } = require("../../Groups/services");

const createDirectChat = (input, messageId) => {
  return new Promise(async (resolve, reject) => {
    input.messages = [messageId];
    const chat = new Chat(input);
    try {
      await chat.save();
      resolve(chat);
    } catch (e) {
      console.log("Error saving chat: ", e);
      reject(e.message);
    }
  });
};

const createGroupChat = (input, userId) => {
  return new Promise(async (resolve, reject) => {
    const channel = uuidv1() + uuidv4();
    input.channel = channel;
    input.creator = userId;
    const { groupUuid, ...chatInput } = input;
    const chat = new Chat(chatInput);
    const group = await getGroupByUuid(groupUuid);
    try {
      await chat.save();
      group.chats = [...group.chats, chat._id];
      await group.save();
      resolve(chat);
    } catch (e) {
      console.log("Error saving chat: ", e);
      reject(e.message);
    }
  });
};

const createMessageAndChat = async input => {
  const { messageInput, ...chatInput } = input;
  const channel = uuidv1() + uuidv4();
  // Necessary for subscriptions
  messageInput.channel = channel;
  chatInput.channel = channel;
  // don't forget you were destructing _id from here
  const { _id } = await createMessage(messageInput);
  createdChat = await createDirectChat(chatInput, _id);
  return createdChat;
};

const updateRecipientUserChatArray = async (
  createdChat,
  senderId,
  recipientUuid
) => {
  const [sender, recipient] = await Promise.all([
    getUserById(senderId),
    getUserByUuid(recipientUuid)
  ]);
  sender.chats = [...sender.chats, createdChat];
  recipient.chats = [...recipient.chats, createdChat];
  try {
    await Promise.all([sender.save(), recipient.save()]);
  } catch (e) {
    throw new Error(
      "Something went wrong while updating user's chat array with a new chat."
    );
  }
  return sender;
};

// Need to use this inside of createDirectChat GraphQL Resolver
// And inside of this function I'll need to use the createMessage service function
// before calling createDirectChat
// Could also change this to createResourceIfAuthorized, and swap out
// the logic inside of the if(userId) with a function specific to the resource.
// to eliminate the duplication that's going on with createGroupIfAuthorized and this.
const createDirectChatIfAuthorized = async (input, authorization) => {
  let createdChat;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    input.messageInput.sender = userId;
    // Need message so that the user(sender) updated with the newly created chat
    // may be placed on the message as sender
    createdChat = await createMessageAndChat(input);
    await updateRecipientUserChatArray(
      createdChat,
      userId,
      input.recipientUuid
    );
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdChat;
};

const createGroupChatIfAuthorized = async (input, authorization) => {
  let createdChat;
  const { userId, errors } = await authorizeRequest(authorization);
  if (userId) {
    createdChat = await createGroupChat(input, userId);
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return createdChat;
};

const retrieveChatsList = async chatIdArr => {
  if (chatIdArr.length > 1) {
    return await Chat.find({ _id: { $in: chatIdArr } });
  } else {
    const chat = await Chat.findById(chatIdArr[0]);
    return [chat];
  }
};

module.exports = {
  createDirectChat: createDirectChat,
  createDirectChatIfAuthorized: createDirectChatIfAuthorized,
  createGroupChatIfAuthorized: createGroupChatIfAuthorized,
  retrieveChatsList: retrieveChatsList
};
