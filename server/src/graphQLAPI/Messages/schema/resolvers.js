const { pubsub, withFilter } = require("../../pubsub");
const {
  createMessageIfAuthorized,
  getMessagesIfAuthorized
} = require("../services");
const { getUserById } = require("../../Accounts/services");

// Service functions need error handling refactoring
const resolvers = {
  Query: {
    getMessagesByChatChannel: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const messageConnection = await getMessagesIfAuthorized(
        input,
        authorization
      );
      return { errors: null, messageConnection };
    }
  },
  Mutation: {
    createMessageInExistingChat: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      return await createMessageIfAuthorized(input, authorization);
      // pubsub.publish("MessageCreated", {
      //   MessageCreated: createdMessage,
      //   channelId: createdMessage.channelId
      // });
    }
  }
  // MessageConnection: {
  //   // Removed in 12/15/18 refactor.
  //   // creator: async ({ user }, _args, _context) => {
  //   //   return await getUserById(user);
  //   // },
  //   edges: async (parentValue, _args, _context) => {
  //     console.log(
  //       "THE PARENT VALUE IN MESSAGE CONNECTION edges: ",
  //       parentValue.edges[0].node
  //     );
  //     return null;
  //     // return await retrieveMessageList(parentValue.messages);
  //   }
  // }

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
