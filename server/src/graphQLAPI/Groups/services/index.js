const Group = require("../model/group");

let groups = [];

const allGroups = () => {
  return Promise.resolve(groups);
};

// const createGroup = args => {
//   const group = args.input;
//   groups.push(group);
//   return Promise.resolve(group);
// };

const createGroup = input => {
  return new Promise(async (resolve, reject) => {
    const group = new Group(input);
    try {
      await group.save();
      resolve(group);
    } catch (e) {
      console.log("Error saving group: ", e);
      reject(e.message);
    }
  });
};

const resetGroups = () => {
  groups = [];
};

module.exports = {
  allGroups: allGroups,
  createGroup: createGroup,
  resetGroups: resetGroups
};
