const { default: mongoose } = require("mongoose");
const dbconfig = require("../config/dbconfig");
const userProjAuthCollection = require("../controller/authProjModel");
const jwtToken = require("jsonwebtoken");
class AuthProjModel {
  static async register(data, res, userId, projectName) {
    console.log("authentication project model called");

    let emailId = data["emailId"];
    let password = data["password"];

    await dbconfig(`${userId}_${projectName}`);

    try {
      let userCred = await userProjAuthCollection.findOne({ emailId: emailId });

      if (userCred == null) {
        let userAuthenticationDetails = new userProjAuthCollection({
          emailId: emailId,
          password: password,
        });

        console.log(userAuthenticationDetails);

        const doc = await userAuthenticationDetails.save();
        console.log(`user document for registration is ${doc}`);

        const token = jwtToken.sign({ emailId: doc.emailId }, "secretKey", {
          expiresIn: "24h",
        });

        return res.status(200).json({
          status: true,
          userData: doc,
          token,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "USER ALREADY EXISTS", // Corrected the typo
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return res
        .status(500)
        .json({ status: false, message: "Registration failed" });
    }
  }
  // static async register(data, res, userId, projectName)
  // {
  //   console.log("authentication project model called");

  //   let emailId = data["emailId"];
  //   let password = data["password"];

  //   await dbconfig(`${userId}_${projectName}`);

  //   let userCred = await userProjAuthCollection.findOne({ emailId: emailId });
  //   // To check if a user is already registered

  //   if (userCred == null) {
  //     let userAuthenticationDetails = new userProjAuthCollection({
  //       emailId: emailId,
  //       password: password,
  //     });

  //     console.log(userAuthenticationDetails);

  //     await userAuthenticationDetails.save().then(async function (doc) {
  //       console.log(`user document for registration is ${doc}`);

  //       const token = jwtToken.sign({ emailId: doc.emailId }, "secretKey", {
  //         expiresIn: "24h",
  //       });

  //       //   await mongoose.connection.close();
  //       return res.status(200).json({
  //         status: true,
  //         userData: doc,
  //         token,
  //       });
  //     });
  //   }

  //   return res.status(400).json({
  //     status: false,
  //     message: "USER ALREADY depreived",
  //   });
  // }
  static async login(data, res, userId, projectName) {
    let email = data["emailId"];
    let password = data["password"];

    await dbconfig(`${userId}_${projectName}`); // Ensure connection to the correct DB

    try {
      const users = await userProjAuthCollection.find({ emailId: email });
      const userCred = users[0]; // Get the first user, if any

      if (!userCred) {
        return res.status(400).json({
          status: false,
          message: "User not registered", // More accurate message
        });
      }

      const isValid = await userCred.comparePassword(password);

      return res.status(200).json({
        status: isValid,
        userData: userCred, // Sending the user data might be more useful
      });
    } catch (error) {
      console.error("Error during login:", error);
      // Optionally, you might want to handle connection errors differently
      // if (error.name === 'MongooseError' && error.message === 'Connection was force closed') {
      //   // Handle the closed connection, perhaps by attempting to reconnect
      //   console.log("Connection was closed, consider reconnecting.");
      // }
      return res.status(500).json({ status: false, message: "Login failed" });
    }
  }

  static async getDataAuth(data, res) {
    try {
      let userId = data["userId"];
      let projectName = data["projectName"];
      //  let connectionString = `mongodb://127.0.0.1:27017/${userId}_${projectName}?maxPoolSize=10`; // Update this with your actual connection string

      await dbconfig(`${userId}_${projectName}`);

      // Perform the database operations
      let authData = await userProjAuthCollection.find({});
      console.log(authData);

      await mongoose.connection.close();

      return res.status(200).json({
        result: authData,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: "An unexpected error occurred",
      });
    }
  }

  static async addData(data, res, uid, projectName, collectionName) {
    await dbconfig(`${uid}_${projectName}`);

    let databaseInstance = mongoose.connection;

    databaseInstance.on("open", async function () {});

    console.log(collectionName);

    databaseInstance.on("error", function (e) {
      console.error(e);
      return res.status(400).json({
        status: false,
        success: false,
      });
    });

    let listOfCollections = await databaseInstance.listCollections();
    var collectionInstance;
    var flag = 0;

    // if collection is already present

    collectionInstance = await databaseInstance.collection(`${collectionName}`);
    await collectionInstance.insertOne(data).then(async function (doc) {
      console.log(`doc updated successfully ${doc.insertedId}`);
    });

    //if not present

    //console.log(collectionInstance);
    await mongoose.connection.close();

    //console.log(collectionInstance);
    return res.status(200).json({
      status: true,
      message: "successfully inserted",
    });
  }

  static async getAllDataCollectionNameForDisplay(data, res) {
    try {
      let id = data["id"];
      let projectName = data["projectName"];

      // open database

      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
      dbconfig(`${id}_${projectName}`);

      let databaseInstance = mongoose.connection;

      databaseInstance.on("open", async function () {
        console.log("opened");
      });
      databaseInstance.on("error", function (req, res) {
        console.log("error");
        throw "NIL";
      });

      let collectionList = await databaseInstance.listCollections();

      let finalList = [];
      for (var i = 0; i < collectionList.length; i++) {
        if (
          collectionList[i].name == "authenticationdataprojects" ||
          collectionList[i].name == "userauths"
        ) {
          continue;
        } else {
          finalList.push(collectionList[i]);
        }
      }
      await mongoose.connection.close();
      console.log(finalList);

      return res.json({
        status: true,
        message: finalList,
      });
    } catch (e) {
      console.error(e);
      return res.json({
        status: false,
        message: e,
      });
    }
  }

  static async getAllDatas(data, res, id, projectName) {
    let collectionName = data["collectionName"];

    console.log("called");
    console.log(projectName + collectionName);

    await dbconfig(`${id}_${projectName}`);
    let databaseInstance = mongoose.connection;
    try {
      databaseInstance.on("open", async function () {
        console.log("db opened");
      });

      let collectionList = await databaseInstance.collection(collectionName);

      let result = await collectionList.find({});

      await mongoose.connection.close();
      let finalres = await result.toArray();

      return res.json({ documents: finalres });
    } catch (e) {
      console.error(e);
      return res.json(400);
    }
  }

  static async getValue(data, res, collectionName) {
    let conditionField = data["where"] == null ? {} : data["where"];

    let databaseInstance = mongoose.connection;

    try {
      databaseInstance.on("open", async function () {
        console.log("database opened");
      });
      databaseInstance.on("error", async function () {
        console.log("database error");
        throw e;
      });
      let collectionInstance = await databaseInstance.collection(
        collectionName
      );

      let result = await collectionInstance.find(conditionField);

      let datas = await result.toArray();

      return res.status(200).json({
        status: true,
        docs: datas,
      });
    } catch (e) {
      console.error(e);
      return res.status(400).json({
        status: false,
      });
    }
  }

  static async updateDocs(data, res, collectionName) {
    console.log("update function successfully");
    let whereCondition = data["where"];

    let updateValue = data["update"];
    console.log(whereCondition);

    if (whereCondition == null && updateValue == null) {
      return res.status(400).json({
        status: false,
        message: "WHERE AND UPDATE VALUE MUST BE SPECIFIED",
      });
    }

    let databaseInstance = mongoose.connection;
    try {
      databaseInstance.on("open", function () {
        console.log("db opened");
      });

      databaseInstance.on("error", function (e) {
        throw e;
      });

      let collectionInstance = await databaseInstance.collection(
        collectionName
      );

      if ("_id" in whereCondition) {
        whereCondition["_id"] = new mongoose.Types.ObjectId(
          whereCondition["_id"]
        );
        let updateData = await collectionInstance.updateMany(whereCondition, {
          $set: updateValue,
        });
        console.log(`updated doc is ${updateData}`);

        return res.json(updateData);
      } else {
        let updateData = await collectionInstance.updateMany(whereCondition, {
          $set: updateValue,
        });
        console.log(`updated doc is ${updateData}`);

        return res.json(updateData);
      }

      // await collectionInstance.deleteMany({ data: "HI" });
    } catch (e) {
      console.error(e);
      return res.status(400).json({
        message: e.toString(),
      });
    }
  }

  static async deleteDocs(data, res, collectionName) {
    let whereCondition = data["where"];

    if (whereCondition == null) {
      return res.status(400).json({
        status: false,
        message: "DELETE VALUE MUST BE SPECIFIED",
      });
    }

    let databaseInstance = mongoose.connection;
    try {
      databaseInstance.on("open", function () {
        console.log("db opened");
      });

      databaseInstance.on("error", function (e) {
        throw e;
      });

      let collectionInstance = await databaseInstance.collection(
        collectionName
      );

      if ("_id" in whereCondition) {
        whereCondition["_id"] = new mongoose.Types.ObjectId(
          whereCondition["_id"]
        );
        let deletedData = await collectionInstance.deleteMany(whereCondition);
        console.log(`deleted doc is ${deletedData}`);

        return res.json(deletedData);
      } else {
        let deletedDocs = await collectionInstance.deleteMany(whereCondition);
        console.log(`deletedDoc doc is ${deletedDocs}`);

        return res.json(deletedDocs);
      }

      // await collectionInstance.deleteMany({ data: "HI" });
    } catch (e) {
      console.error(e);
      return res.status(400).json({
        message: e.toString(),
      });
    }
  }
}

module.exports = AuthProjModel;
