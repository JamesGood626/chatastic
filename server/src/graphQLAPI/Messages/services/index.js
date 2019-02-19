const { Message, MessageEdge } = require("../model/message");
const authorizeRequest = require("../../authorization");
const { getChatByChannel } = require("../../Chats/services");

const createMessage = (input, newCursor = 1) => {
  return new Promise(async (resolve, reject) => {
    const message = new Message(input);
    const messageEdgeInput = {
      cursor: newCursor,
      node: message
    };
    const messageEdge = new MessageEdge(messageEdgeInput);
    try {
      await message.save();
      await messageEdge.save();
      resolve(messageEdge);
    } catch (e) {
      console.log("Error saving messageEdge: ", e);
      reject(e.message);
    }
  });
};

// Refactor
const createMessageIfAuthorized = async (input, authorization) => {
  let createdMessageEdge;
  const { userId, username, errors } = await authorizeRequest(authorization);
  if (userId) {
    const { chatChannel, ...messageInput } = input;
    const chat = await getChatByChannel(chatChannel);
    // console.log("THE CHAT FOR CHAT.MESSAGES: ", chat);
    const length = chat.messages.length;
    const newCursor = length + 1;
    messageInput.senderUsername = username;
    messageInput.channel = chatChannel;
    createdMessageEdge = await createMessage(messageInput, newCursor);
    chat.messages = [...chat.messages, createdMessageEdge];
    await chat.save();
  } else {
    const { decodeTokenError, expiredTokenError } = errors;
    if (expiredTokenError !== null) throw new ForbiddenError(expiredTokenError);
    // Use apollo client httpLinks auto refetch functionality
    // to get the user a new JWT for the decodeTokenError case.
    if (decodeTokenError !== null) throw new ForbiddenError(decodeTokenError);
  }
  return {
    errors: null,
    messageEdge: createdMessageEdge
  };
  // Promise.resolve();
};

// The service function that makes pagination possible
const getMessagesIfAuthorized = async (input, authorization) => {
  let retrievedMessageEdges;
  const { start, end, chatChannel } = input;
  const { userId, username, errors } = await authorizeRequest(authorization);
  if (userId) {
    retrievedMessageEdges = await MessageEdge.find(
      { cursor: { $gte: start, $lte: end } },
      result => {
        return result;
      }
    )
      .populate("node")
      .exec();
  }
  const count = await MessageEdge.count({});
  const pageInfo = {
    hasNextPage: count > end ? true : false,
    hasPreviousPage: start > 0 ? true : false
  };
  return {
    edges: retrievedMessageEdges,
    pageInfo
  };
};

// LAST LEFT OFF HERE:
// OKAY, everything is passing test wise now... But I still need to modify the message retrieval for existing
// chats -> i.e. the infinite scroll pagination query. This will require tweaking the pageInfo
// that is being returned from this function.. and perhaps in another custom function
// for retrieving the list from a start and end provided as params to the GraphQL Query.
// ahhh... this retrieveMessageList is always the first to run... So it by default should always only
// retrieve the first 20-25 messages or something like that.
const retrieveMessageList = async messageEdgeIdArr => {
  const query = {
    cursor: { $gte: 0, $lte: 20 }
  };
  let messageEdge;
  if (messageEdgeIdArr.length > 1) {
    query._id = { $in: messageEdgeIdArr };
    messageEdge = await MessageEdge.find(query)
      .populate("node")
      .exec();
  } else {
    query._id = messageEdgeIdArr[0];
    messageEdge = await MessageEdge.find(query)
      .populate("node")
      .exec();
  }
  const count = await MessageEdge.count({});
  const pageInfo = {
    hasNextPage: count > 20 ? true : false,
    hasPreviousPage: false
  };
  return {
    // edges is an array
    edges: messageEdge,
    pageInfo
  };
};

module.exports = {
  createMessage,
  createMessageIfAuthorized,
  getMessagesIfAuthorized,
  retrieveMessageList
};
