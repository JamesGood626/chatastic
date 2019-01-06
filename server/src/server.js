const { httpServer, apolloServer } = require("./app");

const PORT = process.env.PORT || 4000;

httpServer.listen({ port: PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${
      apolloServer.subscriptionsPath
    }`
  );
});

// LAST LEFT OFF
// Working in chats/services/index.js
// Yeah.. just check out the comments there.
