const { retrieveGroupsList } = require("../../Groups/services");
const {
  retrieveGroupInvitationList
} = require("../../GroupInvitations/services");
const {
  retrieveGroupActivitiesList
} = require("../../GroupActivities/services");

const groups = async ({ groups }, _args, _context) => {
  return await retrieveGroupsList(groups);
};

const groupActivities = async ({ groupActivities }, _args, _context) => {
  return await retrieveGroupActivitiesList(groupActivities);
};

const groupInvitations = async ({ groupInvitations }, _args, _context) => {
  return await retrieveGroupInvitationList(groupInvitations);
};

module.exports = {
  groups,
  groupActivities,
  groupInvitations
};
