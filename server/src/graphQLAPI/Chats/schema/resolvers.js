const { pubsub, withFilter } = require("../../pubsub");
const { createDirectChat, createGroupChat } = require("../services");

const resolvers = {
  Query: {},
  Mutation: {
    createDirectChat: async (_parentValue, args, _context) => {
      const createdChat = await createDirectChat(args);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdChat;
    },
    createGroupChat: async (_parentValue, args, _context) => {
      const createdChat = await createGroupChat(args);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdChat;
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
