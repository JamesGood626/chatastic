const { createGroupIfUserAuthorizationSuccess } = require("../services");
const { getUserById } = require("../../Accounts/services");

const resolvers = {
  Query: {
    allGroups: async (_parentValue, _args, _context) => {
      const groups = await allGroups();
      return groups;
    }
  },
  Mutation: {
    createGroup: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdGroup = await createGroupIfUserAuthorizationSuccess(
        input,
        authorization
      );
      return createdGroup;
    }
    // deleteGroup
  },
  Group: {
    creator: async ({ creator }, _args, _context) => {
      console.log("GETTING TO CREATOR RESOLVER");
      return await getUserById(creator);
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

// More than likely won't be necessary
// pubsub.publish("groupCreated", {
//   groupCreated: createdGroup,
//   channelId: createdGroup.channelId
// });
