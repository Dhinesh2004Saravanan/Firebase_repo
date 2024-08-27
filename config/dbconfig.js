const mongoose = require("mongoose");

async function databaseConnect(name = "FIREBASE_USERS") {
  try {
    await mongoose
      .connect(`mongodb://127.0.0.1:27017/${name}`)
      .then(function () {
        console.log("success" + name);
      });
  } catch (e) {
    console.error(e);
  }
}
module.exports = async function (name) {
  databaseConnect(name);
};
