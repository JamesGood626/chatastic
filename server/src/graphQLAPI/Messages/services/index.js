let messages = [];

const createMessage = args => {
  const message = args.input;
  messages.push(message);
  return Promise.resolve(message);
};

const resetMessages = () => {
  messages = [];
};

module.exports = {
  createMessage: createMessage,
  resetMessages: resetMessages
};
