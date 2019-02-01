const { pubsub, withFilter } = require("../../pubsub");
const {
  createGroupInvitationIfAuthorized,
  acceptGroupInvitationIfAuthorized,
  declineGroupInvitationIfAuthorized
} = require("../services");
const { getGroupById } = require("../../Groups/services");
const { getUserById } = require("../../Accounts/services");

// TODO:
// still need to implement decline group invitation.
const resolvers = {
  Query: {},
  Mutation: {
    createGroupInvitation: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const createdGroupInvitation = await createGroupInvitationIfAuthorized(
        input,
        authorization
      );
      // pubsub.publish("GroupInvitationCreated", {
      //   GroupInvitationCreated: createdGroupInvitation,
      //   channelId: createdGroupInvitation.channelId
      // });
      return { errors: null, groupInvitation: createdGroupInvitation };
    },
    acceptGroupInvitation: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const joinedGroup = await acceptGroupInvitationIfAuthorized(
        input,
        authorization
      );
      if (joinedGroup) {
        const acceptedStatus = {
          acceptedMessage: "Successfully joined.",
          joinedGroup
        };
        return { errors: null, acceptedStatus };
      } else {
        throw new Error(
          "Database Error occured while accepting group invitation."
        );
      }
    },
    declineGroupInvitation: async (
      _parentValue,
      { input },
      { headers: { authorization } }
    ) => {
      const deletedGroup = await declineGroupInvitationIfAuthorized(
        input,
        authorization
      );
      return { errors: null, declinedMessage: "Invitation Rejected." };
    }
  },
  AcceptedStatus: {
    joinedGroup: async ({ joinedGroup }, args, _context) => {
      return await getGroupById(joinedGroup);
    }
  },
  GroupInvitation: {
    group: async ({ group }, args, _context) => {
      return await getGroupById(group);
    },
    inviter: async ({ inviter }, args, _context) => {
      const user = await getUserById(inviter);
      return user;
    },
    invitee: async ({ invitee }, args, _context) => {
      const user = await getUserById(invitee);
      return user;
    }
  }
  // Subscription: {
  //   GroupInvitationCreated: {
  //     subscribe: withFilter(
  //       () => pubsub.asyncIterator("GroupInvitationCreated"),
  //       (payload, variables) => {
  //         console.log("SUBSCRIBIN");
  //         return payload.channelId === variables.channelId;
  //       }
  //     )
  //   }
  // }
};

module.exports = resolvers;
