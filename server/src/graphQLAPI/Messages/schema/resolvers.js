const { pubsub, withFilter } = require("../../pubsub");
const { createMessage } = require("../services");

const resolvers = {
  Query: {},
  Mutation: {
    createMessage: async (_parentValue, args, _context) => {
      const createdMessage = await createMessage(args);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdMessage;
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
