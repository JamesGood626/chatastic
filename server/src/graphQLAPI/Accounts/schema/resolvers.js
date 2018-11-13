const { pubsub, withFilter } = require("../../pubsub");
const { createUser, loginUser } = require("../services");
const { retrieveChatsList } = require("../../Chats/services");

const resolvers = {
  Query: {
    allUsers: async (_parentValue, _args, _context) => {
      return [];
    }
  },
  Mutation: {
    createUser: async (_parentValue, { input }, _context) => {
      return await createUser(input);
    },
    loginUser: (_parentValue, { input }, { req }) => {
      return loginUser(input, req);
    }
  },
  Subscription: {
    userCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("userCreated"),
        (payload, variables) => {
          console.log("SUBSCRIBIN");
          return payload.channelId === variables.channelId;
        }
      )
    }
  },
  User: {
    groups: async (parentValue, _args, _context) => {
      return [];
    },
    chats: async ({ chats }, _args, _context) => {
      return await retrieveChatsList(chats);
    }
  }
};

module.exports = resolvers;
