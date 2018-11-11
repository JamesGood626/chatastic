const { allGroups, createGroup } = require("../services");

const resolvers = {
  Query: {
    allGroups: async (_parentValue, _args, _context) => {
      const groups = await allGroups();
      console.log("THE ALL GROUPS: ", groups);
      return groups;
    }
  },
  Mutation: {
    createGroup: async (_parentValue, args, _context) => {
      const createdGroup = await createGroup(args.input);
      // pubsub.publish("groupCreated", {
      //   groupCreated: createdGroup,
      //   channelId: createdGroup.channelId
      // });
      return createdGroup;
    }
    // deleteGroup
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
