const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupActivitySchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  groupUuid: {
    type: String,
    requried: true
  },
  directChats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      requried: true
    }
  ]
});

const GroupActivity =
  mongoose.models.GroupActivity ||
  mongoose.model("GroupActivity", groupActivitySchema);

module.exports = GroupActivity;
