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

// Damn... For error handling, you need to refactor
// to support a query pattern like this:
// @query """
// mutation ($menuItem: MenuItemInput!) {
//   createMenuItem(input: $menuItem) {
//     errors { key message }
//     menuItem {
//       name
//       description
//       price
// } }
// } """

// The GraphQL schema that facilitates this:
// object :menu_item_result do
//   field :menu_item, :menu_item
//   field :errors, list_of(:input_error)
// end

// AND:
// object :input_error do
//   field :key, non_null(:string)
//   field :message, non_null(:string)
// end

// OKAY: Plan instead for resuming this project:
// FIRST -> WORK ON THE UI/component structure of the
// react app while implementing it in a TDD Fashion with
// the queries which include errors as data.

// This will help me feel motivated by progress on the client side.
// AND THEN after that is at a good point, I can start refactoring
// this stuff to accomodate the queries.

// Once you do start implementing pagination for the messages,
// that will require refactoring in the current implementation of
// the chat's schema.
