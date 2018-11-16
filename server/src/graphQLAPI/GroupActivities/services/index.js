const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const GroupActivity = require("../model/groupActivity");
// const { getUserById, getUserByUuid } = require("../../Accounts/services");
// const { getGroupByUuid } = require("../../Groups/services");

const getGroupActivityById = async id => {
  const groupActivity = await GroupActivity.findById(id);
  console.log("THE FOUND groupActivity: ", groupActivity);
  return groupActivity;
};

// takes uuid, groupUuid, chatId as input
const createGroupActivity = input => {
  return new Promise(async (resolve, reject) => {
    const groupActivity = new GroupActivity(input);
    try {
      await groupActivity.save();
      resolve(groupActivity);
    } catch (e) {
      console.log("Error saving groupActivity: ", e);
      reject(e.message);
    }
  });
};

const retrieveGroupActivitiesList = async IdArr => {
  if (IdArr.length > 1) {
    return await GroupActivity.find({ _id: { $in: IdArr } });
  } else {
    const groupActivity = await GroupActivity.findById(IdArr[0]);
    return [groupActivity];
  }
};

module.exports = {
  createGroupActivity: createGroupActivity,
  getGroupActivityById: getGroupActivityById,
  retrieveGroupActivitiesList: retrieveGroupActivitiesList
};
