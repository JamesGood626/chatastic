const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group"
    }
  ],
  groupActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: "GroupActivity"
    }
  ],
  groupInvitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "GroupInvitation"
    }
  ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

// Might need this later
// email: {
//   type: String,
//   unique: true,
//   required: true
// },
