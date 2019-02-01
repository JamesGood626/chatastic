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
      console.log("IT WORKED");
      const user = await getUserByUsernameIfAuthorized(
        username,
        authorization,
        authorizeRequest
      );
      return { errors: null, user };
    }
  },
  Mutation: {
    createUser: async (_parentValue, { input }, _context) => {
      // const data = await createUser(input);
      return { errors: null, authenticatedUser: await createUser(input) };
    },
    loginUser: async (_parentValue, { input }, { req }) => {
      return { errors: null, authenticatedUser: await loginUser(input, req) };

      // return await loginUser(input, req);
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
