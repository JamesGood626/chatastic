const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  channel: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

module.exports = Chat;
