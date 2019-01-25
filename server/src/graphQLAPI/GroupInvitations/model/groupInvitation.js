const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupInvitationSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  sentDate: {
    type: Date,
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const GroupInvitation =
  mongoose.models.GroupInvitation ||
  mongoose.model("GroupInvitation", groupInvitationSchema);

module.exports = GroupInvitation;
