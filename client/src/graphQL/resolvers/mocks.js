import { GraphQLScalarType } from "graphql";

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

const mocks = {
  Query: {
    // posts: () => posts,
    // author: (_, { id }) => find(authors, { id })
  },

  Mutation: {
    loginUser: (_, { input }) => {
      console.log("THE INPUT FROM TEST LOGIN USER: ", input);
      return {
        uuid: "1223",
        firstname: "String",
        lastname: "String",
        username: "String",
        token: "String"
      };
    },
    updateAuthenticatedUser: (_, { input }) => {
      console.log("DA INPUT: ", input);
    },
    createGroup: (_, { input }) => {
      console.log("DA CREATE GROUP INPUT: ", input);
      const group = {
        id: "String",
        uuid: "String",
        title: "String",
        createdAt: "Date",
        creatorUsername: "Jim",
        chats: [],
        members: []
      };
      return group;
    }
  },
  Date: customDateScalarType
};

export default mocks;

// resolvers from LaunchPad example
// const resolvers = {
//   Query: {
//     posts: () => posts,
//     author: (_, { id }) => find(authors, { id: id }),
//   },
//   Mutation: {
//     upvotePost: (_, { postId }) => {
//       const post = find(posts, { id: postId });
//       if (!post) {
//         throw new Error(`Couldn't find post with id ${postId}`);
//       }
//       post.votes += 1;
//       return post;
//     },
//   },
//   Author: {
//     posts: (author) => filter(posts, { authorId: author.id }),
//   },
//   Post: {
//     author: (post) => find(authors, { id: post.authorId }),
//   },
// };
