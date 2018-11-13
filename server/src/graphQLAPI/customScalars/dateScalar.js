const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const customDateScalarType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    console.log("THIS IS KIND: ", Kind);
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // ast value is always in string format
    }
    return null;
  }
});

const dateScalarSchema = `
  scalar Date
`;

const dateScalarResolver = {
  Date: customDateScalarType
};

module.exports = {
  dateScalarSchema: dateScalarSchema,
  dateScalarResolver: dateScalarResolver
};
