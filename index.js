const express = require("express");
const userAuthServices = require("./services/userAuthServices");
const projectAdd = require("./services/addProjectServices");
var app = express();

const dbconfig = require("./config/dbconfig");
const userAuthCollection = require("./controller/userAuthModel");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res, next) {
  res.json({
    status: true,
  });
});
app.post("/*", async function (req, res) {
  await dbconfig();
  var str = `http://localhost:3030/${req.url}`;
  const reqData = req.body;
  const parts = req.url.split("/");
  console.log(parts);
  if (parts[1] != "auth" && parts[2] == "addProject") {
    // add project query
    // await dbconfig();
  } else {
    // If it is 'auth', use the default configuration
    console.log("else");
    // await dbconfig();
  }

  // User Register and login auth
  if (req.url == "/auth/register") {
    //User registered function

    let data = req.body;
    return userAuthServices.register(req.body, res);
  } else if (req.url == "/auth/login") {
    //User login

    return userAuthServices.login(req.body, res);
  }

  /// for adding Project
  if (parts[parts.length - 1] == "addProject") {
    // await dbconfig();
    return projectAdd.addProject(req.body, res);
  }

  // For getting the WORKING FUNCTION BASED ON GIVEN data
  var userId = parts[1];
  var projectName = parts[2];

  console.log(userId);
  var userInfoDetails = await userAuthCollection.findOne({ userId: userId });

  console.log(`userInfoDetails is ${userInfoDetails.projects}`);

  var listOfproject = [];
  userInfoDetails.projects.map(function (e) {
    if (projectName == e) {
      console.log("userauth function called");
      return;
    }
  });

  // For unwanted requests
  res.status(404).json({
    status: "Unknown request  url",
  });

  // var res = projectName in userInfoDetails.projects;

  // res.status(200).json({
  //   status: false,
  // });
});
app.listen(3030, function (req, res) {
  console.log("http://localhost:3030");
});
