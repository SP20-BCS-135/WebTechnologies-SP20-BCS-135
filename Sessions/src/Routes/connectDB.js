const mongoose = require("mongoose");
require("dotenv").config();

const ConnectToMongo = () => {
  mongoose
    .connect(process.env.CONNECTION_MONGO, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("DB Connection Succesful");
    })
    .catch((e) => {
      console.log("Something went wrong Umair ! : ", e);
    });
};

module.exports = ConnectToMongo;
