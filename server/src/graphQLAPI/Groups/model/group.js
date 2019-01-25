const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  creatorUsername: {
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

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

module.exports = Group;
