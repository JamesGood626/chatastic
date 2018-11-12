const express = require("express");
const initMongoMongooseConnection = require("./middleware/mongo");
const initPassport = require("./middleware/passport");
const applyGraphQL = require("./middleware/graphQLServer");

const app = express();
initMongoMongooseConnection();
initPassport(app);
const { httpServer, apolloServer } = applyGraphQL(app);
module.exports = {
  httpServer: httpServer,
  apolloServer: apolloServer
};
