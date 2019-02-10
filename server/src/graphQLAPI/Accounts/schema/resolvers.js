const { pubsub, withFilter } = require("../../pubsub");
const authorizeRequest = require("../../authorization");
const { groups, groupActivities, groupInvitations } = require("./subResolvers");
const {
  getUserByUsernameIfAuthorized,
  getUserByUuid,
  createUser,
  loginUser
} = require("../services");

// TODO: Fix test cases to make a mutation for getUserByUsername
// had to switch it from a query to a mutation for the clientside.
const resolvers = {
  Query: {
    allUsers: (_parentValue, _args, _context) => {
      return [
        { name: "sam", age: 20 },
        { name: "jane", age: 30 },
        { name: "freddie", age: 40 }
      ];
    },
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
    loginUser: async (_parentValue, { input }, _context) => {
      return await loginUser(input);
    }
  },
  Subscription: {
    userCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("userCreated"),
        (payload, variables) => {
          return payload.channelId === variables.channelId;
        }
      )
    }
  },
  // SubResolvers
  AuthenticatedUser: {
    groups,
    groupActivities,
    groupInvitations
  }
};

module.exports = resolvers;
