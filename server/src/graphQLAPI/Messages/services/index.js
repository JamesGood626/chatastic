const Message = require("../model/message");

const createMessage = input => {
  return new Promise(async (resolve, reject) => {
    const message = new Message(input);
    try {
      await message.save();
      resolve(message);
    } catch (e) {
      console.log("Error saving message: ", e);
      reject(e.message);
    }
  });
};

const retrieveMessageList = async messageIdArr => {
  if (messageIdArr.length > 1) {
    return await Message.find({ _id: { $in: messageIdArr } });
  } else {
    const message = await Message.findById(messageIdArr[0]);
    return [message];
  }
};

module.exports = {
  createMessage: createMessage,
  retrieveMessageList: retrieveMessageList
};
