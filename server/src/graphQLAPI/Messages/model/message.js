const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  channelId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
