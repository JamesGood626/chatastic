const { pubsub, withFilter } = require("../../pubsub");
const { allUsers, createUser } = require("../services");

const resolvers = {
  Query: {
    allUsers: async (_parentValue, _args, _context) => {
      const users = await allUsers();
      return users;
    }
  },
  Mutation: {
    createUser: async (_parentValue, args, _context) => {
      const createdUser = await createUser(args);
      // pubsub.publish("userCreated", {
      //   userCreated: createdUser,
      //   channelId: createdUser.channelId
      // });
      return createdUser;
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
  }
};

module.exports = resolvers;
