const { pubsub, withFilter } = require("../../pubsub");
const { createMessageIfAuthorized } = require("../services");
const { getUserById } = require("../../Accounts/services");

const resolvers = {
  Query: {},
  Mutation: {
    createMessageInExistingChat: async (_parentValue, { input }, _context) => {
      const createdMessage = await createMessageIfAuthorized(input);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdMessage;
    }
  },
  Message: {
    sender: async ({ sender }, _args, _context) => {
      return await getUserById(sender);
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
