const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
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
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat"
    }
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

// Necessary for testing, otherwise a second model will be created.
const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

module.exports = Group;
