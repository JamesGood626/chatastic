const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  uuid: {
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
