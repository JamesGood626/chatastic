const { getGroupByUuid, createGroupIfAuthorized } = require("../services");
const { getUserById, retrieveMembersList } = require("../../Accounts/services");
const { retrieveChatsList } = require("../../Chats/services");

// Service functions need error handling refactoring
const resolvers = {
  Query: {
    getGroup: async (_parentValue, { input: { groupUuid } }, _context) => {
      const group = await getGroupByUuid(groupUuid);
      return { errors: null, group };
    }
  },
  Mutation: {
    createGroup: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdGroup = await createGroupIfAuthorized(input, authorization);
      return { errors: null, group: createdGroup };
    }
    // deleteGroup
  },
  Group: {
    // Removed in 12/15/18 refactor.
    // creator: async ({ creator }, _args, _context) => {
    //   return await getUserById(creator);
    // },
    chats: async ({ chats }, _args, _context) => {
      return await retrieveChatsList(chats);
    },
    members: async ({ members }, _args, _context) => {
      return await retrieveMembersList(members);
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
