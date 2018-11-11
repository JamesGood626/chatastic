const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  uuid: {
    type: Number
    // required: true
  },
  channelId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
