const { gql } = require("apollo-server-express");

// In order to facilitate the GraphQL type MessageEdge
// I'd need to implement that structure in the MongoDB schema
// Will this have any implications regarding performance?

// Last left off needing to refactor the retrieveMessagesIfAuthorized service function
// to return an object of { errors, messageConnection }

const MessageTypeDef = gql`
  type MessageResult {
    errors: [UserError]
    messageEdge: MessageEdge!
  }

  type PaginatedMessagesResult {
    errors: [UserError]
    messageConnection: MessageConnection!
  }

  type MessageConnection {
    edges: [MessageEdge!]!
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: Int!
    node: Message!
  }

  type Message {
    channel: String!
    text: String!
    sentDate: Date!
    senderUsername: String!
    cursor: Int!
  }

  input createMessageInput {
    text: String!
    sentDate: Date!
  }

  input createMessageInExistingChatInput {
    text: String!
    sentDate: Date!
    chatChannel: String!
  }

  input getMessagesByChatChannelInput {
    start: Int!
    end: Int!
    reverse: Boolean = false
    chatChannel: String!
  }
`;

module.exports = MessageTypeDef;

// products query returns a ProductConnection! :
// products(
//   first: Int
//   after: String
//   last: Int
//   before: String
//   reverse: Boolean = false
//   sortKey: ProductSortKeys = ID
//   query: String): ProductConnection!

// A product connection has fields :
// edges: [ProductEdge!]! -> a list of edges
//    cursor: String! -> A cursor for use in pagination.
//    node: Product! -> The item at the end of ProductEdge
// pageInfo: PageInfo! -> information to aid in pagination
//    hasNextPage: Boolean! -> Indicates if there are more pages to fetch.
//    hasPreviousPage: Boolean! -> Indicates if there are more pages prior to the current page.
