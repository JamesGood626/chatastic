const groups = [];

const createGroup = args => {
  const group = args.input;
  groups.push(group);
  return Promise.resolve(group);
};

module.exports = {
  createGroup: createGroup
};
