const { pubsub, withFilter } = require("../../pubsub");
const authorizeRequest = require("../../authorization");
const { groups, groupActivities, groupInvitations } = require("./subResolvers");
const {
  getUserByUsernameIfAuthorized,
  getUserByUuid,
  createUser,
  loginUser
} = require("../services");

const resolvers = {
  Query: {
    getUserByUsername: async (
      _parentValue,
      { input: { username } },
      { headers: { authorization } }
    ) => {
      return await getUserByUsernameIfAuthorized(
        username,
        authorization,
        authorizeRequest
      );
    }
  },
  Mutation: {
    createUser: async (_parentValue, { input }, _context) => {
      return await createUser(input);
    },
    loginUser: async (_parentValue, { input }, { req }) => {
      return await loginUser(input, req);
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
  // SubResolvers
  User: {
    groups,
    groupActivities,
    groupInvitations
  },
  Authenticated: {
    groups,
    groupActivities,
    groupInvitations
  }
};

module.exports = resolvers;
