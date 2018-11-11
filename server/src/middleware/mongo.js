const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

const initMongoMongooseConnection = async () => {
  await mongoose
    .connect(
      MONGO_URI,
      { useNewUrlParser: true }
    )
    .then(res => console.log("mongo connected"));
};

module.exports = initMongoMongooseConnection;
