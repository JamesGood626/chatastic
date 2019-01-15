const { pubsub, withFilter } = require("../../pubsub");
const {
  createDirectChatIfAuthorized,
  createGroupChatIfAuthorized
} = require("../services");
const { getUserById } = require("../../Accounts/services");
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
    // Removed in 12/15/18 refactor.
    // creator: async ({ user }, _args, _context) => {
    //   return await getUserById(user);
    // },
    messages: async ({ messages }, _args, _context) => {
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
