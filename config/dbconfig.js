const mongoose = require("mongoose");

async function databaseConnect(name = "FIREBASE_USERS") {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log(`Connection already exists. Using database: ${name}`);
      const db = mongoose.connection.useDb(name);
      return db; // Return the database object
    } else {
      console.log("Creating a new connection.");
      await mongoose.connect(
        `mongodb+srv://dhinesh2004saravanan:9043702596@sample.tebyjlq.mongodb.net/${name}?retryWrites=true&w=majority&appName=Sample` // Please replace YOUR_PASSWORD
      );
      console.log(
        `Successfully connected to MongoDB and using database: ${name}`
      );
      return mongoose.connection.db; // Return the database object
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw the error for the calling code to handle
  }
}
module.exports = async function (name) {
  databaseConnect(name);
};
/*
async function databaseConnect(name = "FIREBASE_USERS") {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("connection already exists");

      await mongoose.connection.useDb(name);
      return;
    } else {
      console.log("new connection");
    }

    await mongoose.connect(
      `mongodb+srv://dhinesh2004saravanan:9043702596@sample.tebyjlq.mongodb.net/${name}?retryWrites=true&w=majority&appName=Sample`
    );

    // console.log("connection open" + conn.STATES);
    /// console.log(conn);

    // console.log(db);
    // db.on("open", (stream) => {
    //   console.log(stream);
    // });
    
  } catch (e) {
    console.error(e);
  }
}
module.exports = async function (name) {
  databaseConnect(name);
};
*/
/*
async function databaseConnect(name = "FIREBASE_USERS") {
  try {
    const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/${name}`);
    // console.log(conn);

    // console.log(db);
    // db.on("open", (stream) => {
    //   console.log(stream);
    // });
  } catch (e) {
    console.error(e);
  }
}

*/
