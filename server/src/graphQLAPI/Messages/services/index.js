const messages = [];

const createMessage = args => {
  const message = args.input;
  messages.push(message);
  return Promise.resolve(message);
};

module.exports = {
  createMessage: createMessage
};
