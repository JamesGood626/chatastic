let users = [];

const allUsers = () => {
  return Promise.resolve(users);
};

const createUser = args => {
  const user = args.input;
  users.push(user);
  return Promise.resolve(user);
};

const loginUser = args => {
  const username = args.input.username;
  // users.push(user);
  const user = users[0];
  return Promise.resolve(user);
};

const resetUsers = () => {
  users = [];
};

module.exports = {
  allUsers: allUsers,
  createUser: createUser,
  resetUsers: resetUsers
};
