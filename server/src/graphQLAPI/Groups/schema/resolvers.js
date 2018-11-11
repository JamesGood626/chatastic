const { createGroup } = require("../services");

const resolvers = {
  Query: {},
  Mutation: {
    createGroup: async (_parentValue, args, _context) => {
      const createdGroup = await createGroup(args);
      return createdGroup;
    }
  }
};

module.exports = resolvers;
