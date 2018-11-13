const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    type: Date
    // required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
