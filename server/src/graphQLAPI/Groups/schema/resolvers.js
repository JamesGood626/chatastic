const { allGroups, createGroupWithAssignedCreator } = require("../services");
const { getUserById } = require("../../Accounts/services");
const authorizeRequest = require("../../authorization");

const resolvers = {
  Query: {
    allGroups: async (_parentValue, _args, _context) => {
      const groups = await allGroups();
      return groups;
    }
  },
  Mutation: {
    createGroup: async (_parentValue, args, { headers: { authorization } }) => {
      let createdGroup;
      const { user, expired } = await authorizeRequest(authorization);
      if (user) {
        createdGroup = await createGroupWithAssignedCreator(user, args.input);
      }
      // More than likely won't be necessary
      // pubsub.publish("groupCreated", {
      //   groupCreated: createdGroup,
      //   channelId: createdGroup.channelId
      // });
      return createdGroup || expired;
    }
    // deleteGroup
  },
  Group: {
    creator: async (parentValue, _args, _context) => {
      return await getUserById(parentValue.creator);
    }
  }
  // Subscription: {
  //   userCreated: {
  //     subscribe: withFilter(
  //       () => pubsub.asyncIterator("userCreated"),
  //       (payload, variables) => {
  //         console.log("SUBSCRIBIN");
  //         return payload.channelId === variables.channelId;
  //       }
  //     )
  //   }
  // }
};

module.exports = resolvers;
