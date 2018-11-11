const users = [];

const allUsers = () => {
  return Promise.resolve(users);
};

const createUser = args => {
  const user = args.input;
  users.push(user);
  return Promise.resolve(user);
};

module.exports = {
  allUsers: allUsers,
  createUser: createUser
};
