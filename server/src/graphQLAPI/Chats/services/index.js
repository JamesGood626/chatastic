const directChats = [];
const groupChats = [];

const createDirectChat = args => {
  const chat = args.input;
  directChats.push(chat);
  return Promise.resolve(chat);
};

const createGroupChat = args => {
  const chat = args.input;
  groupChats.push(chat);
  return Promise.resolve(chat);
};

module.exports = {
  createDirectChat: createDirectChat,
  createGroupChat: createGroupChat
};
