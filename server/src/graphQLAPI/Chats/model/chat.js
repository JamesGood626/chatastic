const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// So title should be unique, but that can't be managed here, because the rule
// will be applied to all of the chats created in the DB.
// What you want to do is to make title's unique for chat's in the same
// group. -> Would a stored procedure or application logic be more appropriate
// for enforcing this rule?
const chatSchema = new Schema({
  channel: {
    type: String,
    required: true,
    unique: true
  },
  // groupUuid and title should be a unique compound index.
  // You know, due to the no group chats with the same title in the
  // same group restriction you want to enforce.
  groupUuid: {
    type: String,
    required: true
  },
  title: {
    type: String
    // validate: {
    //   validator: async function(v) {
    //     const results = await Chat.find({
    //       groupUuid: this.groupUuid,
    //       title: this.title
    //     });
    //     if (results.length != 0) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   message: props => `The title "${props.value}" already in use!`
    // }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  senderUsername: {
    type: String
  },
  recipientUsername: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  participating: {
    type: Boolean,
    required: true,
    default: true
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "MessageEdge"
    }
  ]
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

module.exports = Chat;
