const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");

console.log("THE MONGO URI BEING USED: ", MONGO_URI);
const initMongoMongooseConnection = async () => {
  await mongoose
    .connect(
      MONGO_URI,
      { useNewUrlParser: true }
    )
    .then(res => console.log("mongo connected"));
};

module.exports = initMongoMongooseConnection;
