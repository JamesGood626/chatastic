const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const Chat = require("../model/chat");
const GroupActivity = require("../../GroupActivities/model/groupActivity");
const authorizeRequest = require("../../authorization");
const { createMessage } = require("../../messages/services");
const { getUserById, getUserByUuid } = require("../../Accounts/services");
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
    console.log("DATA YOU'RE CREATING THE DIRECT CHAT WITH: ", input);
    const chat = new Chat(input);
    try {
      await chat.save();
      console.log("THE SAVED CHAT WITH SENDER AND RECIPIENT: ", chat);
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
  console.log("What you're passing into create message: ", messageInput);
  const { _id } = await createMessage(messageInput);
  console.log("What you're passing into create direct chat: ", chatInput);
  createdChat = await createDirectChat(chatInput, _id);
  return createdChat;
};

const updateGroupActivity = async (
  user,
  filteredGroupActivity,
  createdChat
) => {
  // in this case filtered should have an object
  console.log("FILTERED IN UPDATE: ", filteredGroupActivity);
  filteredGroupActivity.directChats = [
    createdChat,
    ...filteredGroupActivity.directChats
  ];
  user.groupActivities = [filteredGroupActivity, ...user.groupActivities];
  await user.save();
  console.log(
    "THE USER'S GROUP ACTIVITIES WHEN UPDATING: ",
    user.groupActivities
  );
};

const prepareUpdateGroupActivity = async (input, createdChat) => {
  return new Promise(async (resolve, reject) => {
    console.log("THE INPUT YOU NEED: ", input);
    const { groupUuid, senderUuid, recipientUuid } = input;
    const sender = await getUserByUuid(senderUuid);
    const recipient = await getUserByUuid(recipientUuid);
    console.log("THIS IS THE SENDER BEFORE ERR: ", sender);
    console.log("THIS IS THE RECIPIENT BEFORE ERR: ", recipient);
    console.log(
      "THE SECOND TIME AROUND THE SENDER SHOULD HAVE SOMETHING1: ",
      sender.groupActivities
    );

    // BREAK THIS
    const senderGroupActivities = await retrieveGroupActivitiesList(
      sender.groupActivities
    );
    console.log(
      "THIS IS WHAT COMES BACK FROM THE RETRIEVED GROUP ACTIVITIES LIST: ",
      senderGroupActivities
    );
    const senderGAFilter = senderGroupActivities.filter(
      groupActivity => groupActivity.groupUuid === groupUuid
    );
    await updateGroupActivity(sender, senderGAFilter[0], createdChat);

    // AND THIS -> into a reusable function
    const recipientGroupActivities = await retrieveGroupActivitiesList(
      recipient.groupActivities
    );
    const recipientGAFilter = recipientGroupActivities.filter(
      groupActivity => groupActivity.groupUuid === groupUuid
    );
    await updateGroupActivity(recipient, recipientGAFilter[0], createdChat);

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
