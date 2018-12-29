const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const queryTypeDef = require("../GraphQLAPI");

// TypeDefs
const { dateScalarSchema } = require("../graphQLAPI/customScalars/dateScalar");
const userTypeDefs = require("../graphQLAPI/Accounts/schema/userType");
const groupTypeDefs = require("../graphQLAPI/Groups/schema/groupType");
const groupInvitationTypeDefs = require("../graphQLAPI/GroupInvitations/schema/groupInvitationType");
const groupActivityTypeDefs = require("../graphQLAPI/GroupActivities/schema/groupActivityType");
const chatTypeDefs = require("../graphQLAPI/Chats/schema/chatType");
const messageTypeDefs = require("../graphQLAPI/Messages/schema/messageType");

// Resolvers
const {
  dateScalarResolver
} = require("../graphQLAPI/customScalars/dateScalar");
const userResolvers = require("../graphQLAPI/Accounts/schema/resolvers");
const groupResolvers = require("../graphQLAPI/Groups/schema/resolvers");
const groupInvitationResolvers = require("../graphQLAPI/GroupInvitations/schema/resolvers");
const chatResolvers = require("../graphQLAPI/Chats/schema/resolvers");
const messageResolvers = require("../graphQLAPI/Messages/schema/resolvers");

const typeDefs = [
  queryTypeDef,
  userTypeDefs,
  groupTypeDefs,
  groupInvitationTypeDefs,
  groupActivityTypeDefs,
  chatTypeDefs,
  messageTypeDefs,
  dateScalarSchema
];

const resolvers = [
  userResolvers,
  groupResolvers,
  groupInvitationResolvers,
  chatResolvers,
  messageResolvers,
  dateScalarResolver
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
