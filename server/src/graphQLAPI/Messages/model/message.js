const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// commit auth fail
const messageSchema = new Schema({
  channel: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  sentDate: {
    type: Date,
    required: true
  },
  senderUsername: {
    type: String
  }
  // cursor: {
  //   type: Number,
  //   required: true
  // }
});

const messageEdgeSchema = new Schema({
  cursor: {
    type: Number,
    required: true
  },
  node: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

const MessageEdge =
  mongoose.models.MessageEdge ||
  mongoose.model("MessageEdge", messageEdgeSchema);

module.exports = { Message, MessageEdge };
