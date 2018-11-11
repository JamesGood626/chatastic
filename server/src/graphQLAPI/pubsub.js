const { PubSub, withFilter } = require("apollo-server");

const pubsub = new PubSub();

module.exports = {
  pubsub: pubsub,
  withFilter: withFilter
};
