const { pubsub, withFilter } = require("../../pubsub");
const {
  createDirectChatIfAuthorized,
  createGroupChatIfAuthorized
} = require("../services");
const { retrieveMessageList } = require("../../Messages/services");

const resolvers = {
  Query: {},
  Mutation: {
    createDirectChat: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdChat = await createDirectChatIfAuthorized(
        input,
        authorization
      );
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdChat;
    },
    createGroupChat: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdChat = await createGroupChatIfAuthorized(
        input,
        authorization
      );
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdChat;
    }
  },
  Chat: {
    creator: async (parentValue, args, _context) => {
      // Get ya User -> Only need to handle this when creating Group Chat.
    },
    messages: async ({ messages }, args, _context) => {
      return await retrieveMessageList(messages);
    }
  }
  // Subscription: {
  //   messageCreated: {
  //     subscribe: withFilter(
  //       () => pubsub.asyncIterator("messageCreated"),
  //       (payload, variables) => {
  //         console.log("SUBSCRIBIN");
  //         return payload.channelId === variables.channelId;
  //       }
  //     )
  //   }
  // }
};

module.exports = resolvers;
