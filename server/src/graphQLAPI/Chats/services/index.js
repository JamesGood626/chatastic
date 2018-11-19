const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const Chat = require("../model/chat");
const GroupActivity = require("../../GroupActivities/model/groupActivity");
const authorizeRequest = require("../../authorization");
const { createMessage } = require("../../messages/services");
const { getUserById, getUserByUsername } = require("../../Accounts/services");
const { getGroupByUuid } = require("../../Groups/services");
const {
  getGroupActivityById,
  createGroupActivity,
  retrieveGroupActivitiesList
} = require("../../GroupActivities/services");

const getChatByChannel = async channel => {
  const chat = await Chat.findOne({ channel });
  return chat;
};

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
  // chatInput.senderUuid = messageInput.senderUuid;
  // chatInput.recipientUuid = messageInput.recipientUuid;
  // don't forget you were destructing _id from here
  const { _id } = await createMessage(messageInput);
  createdChat = await createDirectChat(chatInput, _id);
  return createdChat;
};

const updateGroupActivity = async (
  user,
  filteredGroupActivity,
  createdChat
) => {
  // in this case filtered should have an object
  filteredGroupActivity.directChats = [
    createdChat,
    ...filteredGroupActivity.directChats
  ];
  user.groupActivities = [filteredGroupActivity, ...user.groupActivities];
  await user.save();
};

const prepareUpdateGroupActivity = async (input, createdChat) => {
  return new Promise(async (resolve, reject) => {
    const { groupUuid, senderUsername, recipientUsername } = input;
    const sender = await getUserByUsername(senderUsername);
    const recipient = await getUserByUsername(recipientUsername);
    // BREAK THIS
    const senderGroupActivities = await retrieveGroupActivitiesList(
      sender.groupActivities
    );
    const updatedSenderGroupActivities = senderGroupActivities.map(
      groupActivity => {
        if (groupActivity.groupUuid === groupUuid) {
          groupActivity.directChats = [
            createdChat,
            ...groupActivity.directChats
          ];
          groupActivity.save();
        }
        return groupActivity;
      }
    );
    // await updateGroupActivity(sender, senderGAFilter[0], createdChat);

    // AND THIS -> into a reusable function
    const recipientGroupActivities = await retrieveGroupActivitiesList(
      recipient.groupActivities
    );
    const updatedRecipientGroupActivities = await recipientGroupActivities.map(
      groupActivity => {
        if (groupActivity.groupUuid === groupUuid) {
          groupActivity.directChats = [
            createdChat,
            ...groupActivity.directChats
          ];
          groupActivity.save();
        }
        return groupActivity;
      }
    );

    sender.groupActivities = updatedSenderGroupActivities;
    recipient.groupActivities = updatedRecipientGroupActivities;
    await sender.save();
    await recipient.save();
    // await updateGroupActivity(recipient, recipientGAFilter[0], createdChat);

    resolve(true);
    // Only if one hasn't been created for a group yet
    // const createdGroupActivity = await createGroupActivity(groupActivityInput);
    // Then nest this on both user's groupActivities array
    // Else update groupActivites on both users.
    // await updateGroupActivitiesChatArray(groupActivityInput);
  });
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
    // Should have groupUuid by this point to decide how to proceed below.
    await prepareUpdateGroupActivity(input, createdChat);
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
  getChatByChannel: getChatByChannel,
  retrieveChatsList: retrieveChatsList
};
