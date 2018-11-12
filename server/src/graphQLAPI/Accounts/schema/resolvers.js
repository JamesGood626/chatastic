const { pubsub, withFilter } = require("../../pubsub");
const { createUser, loginUser } = require("../services");

const resolvers = {
  Query: {
    allUsers: async (_parentValue, _args, _context) => {
      // const users = await allUsers();
      return [];
    }
  },
  Mutation: {
    createUser: async (_parentValue, { input }, _context) => {
      const token = await createUser(input);
      // pubsub.publish("userCreated", {
      //   userCreated: createdUser,
      //   channelId: createdUser.channelId
      // });
      return token;
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
    groups: async (parentValue, _args, { req }) => {
      // parentValue will the be returned value from any of the queries/mutations that will
      // be accessible in here whenever the products field is a requested return value
      // on the query/mutation.
      // return await retrieveOrderList(parentValue.order);
      return [];
    },
    chats: async (parentValue, _args, { req }) => {
      // parentValue will the be returned value from any of the queries/mutations that will
      // be accessible in here whenever the products field is a requested return value
      // on the query/mutation.
      // return await retrieveOrderList(parentValue.order);
      return [];
    }
  }
};

module.exports = resolvers;
