const express = require("express");
const applyGraphQL = require("./middleware/graphQLServer");

const app = express();
const { httpServer, apolloServer } = applyGraphQL(app);
module.exports = {
  app: app,
  httpServer: httpServer,
  apolloServer: apolloServer
};
