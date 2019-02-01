// import { HttpLink } from "apollo-boost";
// import { introspectSchema, makeRemoteExecutableSchema } from "graphql-tools";
// import fetch from "isomorphic-fetch";
// // import { httpLink } from "../../App";

// export const link = new HttpLink({
//   uri: "http://localhost:4000/graphql",
//   fetch
// });

// const createSchema = async () => {
//   //console.log("Starting introspection");
//   // Gets the schema of the remote server
//   const schema = await introspectSchema(link);

//   //console.log("got schema: ", schema);

//   // Creates a schema that uses the link to delegate requests to the underlying service.
//   const executableSchema = makeRemoteExecutableSchema({
//     schema,
//     link
//   });

//   //console.log("the executableSchema: ", executableSchema);
//   return executableSchema;
// };

// export default createSchema();
