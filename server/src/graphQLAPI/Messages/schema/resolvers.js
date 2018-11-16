const { pubsub, withFilter } = require("../../pubsub");
const { createMessageIfAuthorized } = require("../services");
const { getUserById } = require("../../Accounts/services");

const resolvers = {
  Query: {},
  Mutation: {
    createMessageInExistingChat: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdMessage = await createMessageIfAuthorized(
        input,
        authorization
      );
      console.log("THE CREATED MESSAGE BACK IN RESOLVER: ", createdMessage);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdMessage;
    }
  },
  Message: {
    sender: async ({ sender }, _args, _context) => {
      console.log("THE SENDER IN MESSAGE SENDER RESOLVER: ", sender);
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
