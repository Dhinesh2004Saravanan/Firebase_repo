const userAuthCollection = require("../controller/userAuthModel");

class UserAuthentication {
  static async register(receivedData, res) {
    let emailId = receivedData["emailId"];
    let password = receivedData["password"];
    console.log(receivedData);
    // to check if a person is already registered

    const regData = await userAuthCollection.find({ emailId: emailId });
    if (regData.length != 0) {
      return res.status(400).json({
        status: false,
        message: "user already registered",
      });
    }

    const userCred = new userAuthCollection({
      emailId: emailId,
      password: password,
    });

    await userCred.save().then(function (doc) {
      console.log("registered details Added successfully");
      console.log(doc);
      return res.status(200).json({
        status: true,
        uniqueId: doc._id.valueOf(),
        message: "User registered successfully",
      });
    });
  }

  // static async login(data, res) {
  //   let email = data["emailId"];
  //   let password = data["password"];

  //   let [userCred] = await userAuthCollection.find({ emailId: email });
  //   if (userCred == null) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "user did not regitsered",
  //     });
  //   }

  //   console.log(userCred.password);
  //   let isValid = await userCred.comparePassword(password);

  //   console.log(isValid);
  //   if (isValid) {
  //     return res.status(200).json({
  //       status: isValid,
  //       message: userCred,
  //     });
  //   } else {
  //     return res.status(400).json({
  //       status: false,
  //       message: "password is incorrect",
  //     });
  //   }
  // }

  static async login(data, res) {
    let email = data["emailId"];
    let password = data["password"];

    let userCred = await userAuthCollection.findOne({ emailId: email });
    if (!userCred) {
      return res.status(400).json({
        status: false,
        message: "User not registered",
      });
    }

    let isValid = await userCred.comparePassword(password);

    if (isValid) {
      return res.status(200).json({
        status: true,
        message: userCred,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Password is incorrect",
      });
    }
  }
}
module.exports = UserAuthentication;
