const { getGroupByUuid, createGroupIfAuthorized } = require("../services");
const { getUserById, retrieveMembersList } = require("../../Accounts/services");
const { retrieveChatsList } = require("../../Chats/services");

const resolvers = {
  Query: {
    getGroup: async (_parentValue, { input: { groupUuid } }, _context) => {
      return getGroupByUuid(groupUuid);
    }
  },
  Mutation: {
    createGroup: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      console.log("THE CREATE GROUP MUTATION IS WORKING");
      const createdGroup = await createGroupIfAuthorized(input, authorization);
      console.log("GROUP TO BE RETURNED: ", createdGroup);
      return createdGroup;
    }
    // deleteGroup
  },
  Group: {
    // Removed in 12/15/18 refactor.
    // creator: async ({ creator }, _args, _context) => {
    //   return await getUserById(creator);
    // },
    chats: async ({ chats }, _args, _context) => {
      console.log("THESE ARE THE ARGS YOU'RE IGNORING BUT MIGHT NEED: ", _args);
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
