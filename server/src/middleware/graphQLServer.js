const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const queryTypeDef = require("../GraphQLAPI");

// TypeDefs
const userTypeDefs = require("../GraphQLAPI/Accounts/schema/userType");
const groupTypeDefs = require("../GraphQLAPI/Groups/schema/groupType");
const chatTypeDefs = require("../GraphQLAPI/Chats/schema/chatType");
const messageTypeDefs = require("../GraphQLAPI/Messages/schema/messageType");

// Resolvers
const userResolvers = require("../GraphQLAPI/Accounts/schema/resolvers");
const groupResolvers = require("../GraphQLAPI/Groups/schema/resolvers");
const chatResolvers = require("../GraphQLAPI/Chats/schema/resolvers");
const messageResolvers = require("../GraphQLAPI/Messages/schema/resolvers");

const typeDefs = [
  queryTypeDef,
  userTypeDefs,
  groupTypeDefs,
  chatTypeDefs,
  messageTypeDefs
];
const resolvers = [
  userResolvers,
  groupResolvers,
  chatResolvers,
  messageResolvers
];

const applyGraphQL = app => {
  // supertest won't work without bodyParser,
  // but apolloServer adds adequate bodyParser in it's implementation, will need to checkout source?
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("*", cors({ origin: `http://localhost:3000` }));
  app.use(helmet());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      headers: req.headers ? req.headers : null,
      req: req ? req : null
    })
  });

  apolloServer.applyMiddleware({ app });

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  return { httpServer, apolloServer };
};

module.exports = applyGraphQL;
