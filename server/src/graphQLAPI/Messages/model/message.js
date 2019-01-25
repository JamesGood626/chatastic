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
  },
  cursor: {
    type: Number,
    required: true,
    default: 1
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
