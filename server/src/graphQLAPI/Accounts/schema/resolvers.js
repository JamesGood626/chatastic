const { pubsub, withFilter } = require("../../pubsub");
const {
  getUserByUsernameIfAuthorized,
  createUser,
  loginUser
} = require("../services");
const { retrieveGroupsList } = require("../../Groups/services");

const resolvers = {
  Query: {
    getUserByUsername: async (
      _parentValue,
      { input: { username } },
      { headers: { authorization } }
    ) => {
      return await getUserByUsernameIfAuthorized(username, authorization);
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
    groups: async ({ groups }, _args, _context) => {
      return await retrieveGroupsList(groups);
    }
  }
};

module.exports = resolvers;
