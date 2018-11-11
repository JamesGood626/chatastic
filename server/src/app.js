const express = require("express");
const initMongoMongooseConnection = require("./middleware/mongo");
const applyGraphQL = require("./middleware/graphQLServer");

const app = express();
initMongoMongooseConnection();
const { httpServer, apolloServer } = applyGraphQL(app);
module.exports = {
  app: app,
  httpServer: httpServer,
  apolloServer: apolloServer
};
