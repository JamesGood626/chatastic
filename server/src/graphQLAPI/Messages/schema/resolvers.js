const { pubsub, withFilter } = require("../../pubsub");
const {
  createMessageIfAuthorized,
  retrieveMessagesIfAuthorized
} = require("../services");
const { getUserById } = require("../../Accounts/services");

const resolvers = {
  Query: {
    retrieveMessagesByChatChannel: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const retrievedMessages = await retrieveMessagesIfAuthorized(
        input,
        authorization
      );
      console.log("THE RESOLVER IS BEING HIT", retrievedMessages);
      return retrievedMessages;
    }
  },
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
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
      return createdMessage;
    }
  }
  // Message: {
  // sender: async ({ sender }, _args, _context) => {
  //   console.log("THE SENDER IN MESSAGE SENDER RESOLVER: ", sender);
  //   return await getUserById(sender);
  // }
  // }
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
