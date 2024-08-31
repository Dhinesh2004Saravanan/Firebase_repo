const { default: mongoose } = require("mongoose");
const dbconfig = require("../config/dbconfig");
const userProjAuthCollection = require("../controller/authProjModel");
const jwtToken = require("jsonwebtoken");
class AuthProjModel {
  static async register(data, res) {
    console.log("authentication project model called");

    let emailId = data["emailId"];
    let password = data["password"];

    let userCred = await userProjAuthCollection.findOne({ emailId: emailId });
    // To check if a user is already registered

    if (userCred == null) {
      let userAuthenticationDetails = new userProjAuthCollection({
        emailId: emailId,
        password: password,
      });

      console.log(userAuthenticationDetails);

      await userAuthenticationDetails.save().then(function (doc) {
        console.log(`user document for registration is ${doc}`);

        const token = jwtToken.sign({ emailId: doc.emailId }, "secretKey", {
          expiresIn: "24h",
        });
        return res.status(200).json({
          status: true,
          userData: doc,
          token,
        });
      });
    }

    return res.status(400).json({
      status: false,
      message: "USER ALREADY depreived",
    });
  }
  static async login(data, res) {
    let email = data["emailId"];
    let password = data["password"];

    let [userCred] = await userProjAuthCollection.find({ emailId: email });
    if (userCred == null) {
      return res.status(400).json({
        status: false,
        message: "user did not regitsered",
      });
    }

    console.log(userCred);
    let isValid = await userCred.comparePassword(password);

    console.log(isValid);
    return res.status(200).json({
      status: isValid,
      message: userCred,
    });
  }

  static async getDataAuth(data, res) {
    let userId = data["userId"];
    let projectName = data["projectName"];
    //await dbconfig();
    await dbconfig(`${userId}_${projectName}`);

    let authData = await userProjAuthCollection.find({});
    console.log(authData);
    return res.status(200).json({
      result: authData,
    });
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
    await collectionInstance.insertOne(data).then(function (doc) {
      console.log(`doc updated successfully`);
    });

    //if not present

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

      await dbconfig(`${id}_${projectName}`);

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
      console.log(finalList);

      return res.json({
        status: true,
        message: finalList,
      });
    } catch (e) {
      return res.json({
        status: false,
        message: "NIL",
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
}

module.exports = AuthProjModel;
