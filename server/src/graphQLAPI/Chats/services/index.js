const { to } = require("await-to-js");
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

// Ahhhh, to enforce that the same group can't have duplicate named group chat title's
// with the current implementation I'd need to query for the array of groupChats
// AND THEN filter to see if that name is in there.
// OR I can do that MongoDB trigger/check enforcement thing of which the name currently
// escapes me, but that would be the cleanest option I think?
// This matters so it must be done.

// But it'll be done later... But as of now this is breaking many tests.†
const createGroupChat = (input, userId, username) => {
  return new Promise(async (resolve, reject) => {
    const channel = uuidv1() + uuidv4();
    input.channel = channel;
    input.creatorUsername = username;
    const chat = new Chat(input);
    // The constraint to prevent a creating a groupChat with the same
    // title in the same group. -> Could possibly be refactored to a better
    // location.
    const results = await Chat.find({
      groupUuid: input.groupUuid,
      title: input.title
    });
    if (results.length != 0) {
      new Error(`The title "${input.title}" already in use!`);
      reject([
        { key: 1, message: `The title "${input.title}" already in use!` }
      ]);
    }
    const group = await getGroupByUuid(input.groupUuid);
    try {
      await chat.save();
      group.chats = [...group.chats, chat._id];
      await group.save();
      resolve(chat);
    } catch (e) {
      // Any other failures will not necessarily appear under e.errors.title
      console.log("Error saving chat: ", e.errors.title.message);
      reject([{ key: 1, message: e.errors.title.message }]);
    }
  });
};

const createMessageAndChat = async input => {
  const { messageInput, ...chatInput } = input;
  const channel = uuidv1() + uuidv4();
  // Necessary for subscriptions
  messageInput.channel = channel;
  // messageInput.count = 1;
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
    input.messageInput.senderUsername = input.senderUsername;
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
  let err;
  const { userId, username, errors } = await authorizeRequest(authorization);
  if (userId) {
    [err, createdChat] = await to(createGroupChat(input, userId, username));
    console.log("The err: ", err);
    console.log("The createdChat: ", createdChat);
    if (err) {
      return { errors: err, chat: null };
    }
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return { errors: null, chat: createdChat };
};

// !! For facilitating infinite scroll !!
// This is the function that is called for the initial groups/groupActivities retrieval
// Need to obtain the list in DESC order and limit it to 20 or 25 messages in each chat.message array.
// How is this best accomplished in mongo?

// THEN for subsequent scroll ups, you'll need to create a new graphQL query to retrieve new messages
// for a particular chat, from the last count that is in the array currently.
// So for a chat with 100 messages, first in the list will be 100 -> and the last will be 80, so we fetch from
// 80 to 60 for the next page.
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
