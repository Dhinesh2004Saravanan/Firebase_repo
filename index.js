const express = require("express");
const userAuthServices = require("./services/userAuthServices");
const projectAdd = require("./services/addProjectServices");
const AuthProjServices = require("./services/authProjService");
const jwtToken = require("jsonwebtoken");

const os = require("os");
var app = express();

const dbconfig = require("./config/dbconfig");
const { default: mongoose } = require("mongoose");
//const userAuthCollection = require("./controller/userAuthModel");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res, next) {
  res.json({
    status: true,
  });
});

app.post("/verify", function (req, res) {
  var string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoiZGhpbmVzaDIwMDRzYXJhdmFuYW5AZ21haWwuY29tIiwiaWF0IjoxNzI0OTIwNTgwLCJleHAiOjE3MjUwMDY5ODB9.F-a0WIx9j5hrssYavlFdVx1XNyF6maSTIpZ4MnMxyoo";
  const decoded = jwtToken.verify(string, "secretKey");
  console.log(decoded);

  res.status(200).json({
    decoded,
  });
});

app.post("/jwtToken", function (req, res) {
  let data = req.body;

  return res.status(200).json({
    data: "ji",
    token,
  });
});

const getWifiIpAddress = (res) => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    if (interfaceName.startsWith("wlan") || interfaceName.startsWith("Wi-Fi")) {
      const addresses = networkInterfaces[interfaceName];
      for (const addressInfo of addresses) {
        if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          return res.status(200).json({
            ip: addressInfo.address,
          });
        }
      }
    }
  }
  return res.status(400).json({
    ip: "",
  }); // Return null if no Wi-Fi IP address is found
};

app.get("/getIp", function (req, res) {
  getWifiIpAddress(res);
});

app.post("/*", async function (req, res) {
  // var ip = getWifiIpAddress();
  // console.log(ip);
  var str = `http://localhost:3030/${req.url}`;
  const reqData = req.body;
  console.log(req.url);
  const parts = req.url.split("/");
  console.log(parts);
  console.log(req.socket.remoteAddress);

  // User Register and login auth
  if (req.url == "/auth/register") {
    //User registered function
    await dbconfig();
    let data = req.body;
    return userAuthServices.register(req.body, res);
  } else if (req.url == "/auth/login") {
    await dbconfig();
    //User login

    return userAuthServices.login(req.body, res);
  }

  /// for adding Project
  if (req.url == "/addProject") {
    await dbconfig();
    return projectAdd.addProject(req.body, res);
  }

  // for getting authenticationData from based on given data
  if (parts[parts.length - 2] == "auth" && parts[parts.length - 1] == "reg") {
    var userId = parts[1];
    var projectName = parts[2];

    await dbconfig(`${userId}_${projectName}`);
    console.log("user requested for authentication");
    return AuthProjServices.register(req.body, res, userId, projectName);
  }

  if (parts[parts.length - 2] == "auth" && parts[parts.length - 1] == "log") {
    var userId = parts[1];
    var projectName = parts[2];

    console.log("user requested for authentication");
    await dbconfig(`${userId}_${projectName}`);
    return AuthProjServices.login(req.body, res, userId, projectName);
  }

  // for getting the firebase like Auth Information

  if (req.url == "/getProjectAuthDetails") {
    return AuthProjServices.getDataAuth(req.body, res);
  }
  

  if (parts[parts.length - 1] == "getAllDatas") {
  
    return AuthProjServices.getAllDatas(req.body, res, parts[1], parts[2]);
  }

  if (
    parts[parts.length - 1] == "getDatabaseData" &&
    req.url == "/getDatabaseData"
  ) {
    return AuthProjServices.getAllDataCollectionNameForDisplay(req.body, res);
  }

  if (parts[parts.length - 1] == "get") {
    await dbconfig(`${parts[1]}_${parts[2]}`);
    return AuthProjServices.getValue(req.body, res, parts[3]);
  }

  if (parts[parts.length - 1] == "update") {
    await dbconfig(`${parts[1]}_${parts[2]}`);
    return AuthProjServices.updateDocs(req.body, res, parts[3]);
  }
  if (parts[parts.length - 1] == "delete") {
    await dbconfig(`${parts[1]}_${parts[2]}`);
    return AuthProjServices.deleteDocs(req.body, res, parts[3]);
  }

  if (parts[parts.length - 2] == "addData") {
    let uid = parts[1];
    let projName = parts[2];

    return AuthProjServices.addData(
      req.body,
      res,
      uid,
      projName,
      parts[parts.length - 1]
    );
  }

  return res.status(400).json({
    status: false,
    message: "unknown request for given url",
  });
});
app.listen(3030, function (req, res) {
  console.log("http://localhost:3030");
});

/*

 var userId = parts[1];
  var projectName = parts[2];

  console.log(userId);
  await dbconfig();
  var userInfoDetails = await userAuthCollection.findOne({ userId: userId });

  console.log(`userInfoDetails is ${userInfoDetails.projects}`);

  var listOfproject = [];
  userInfoDetails.projects.map(async function (e) {
    if (projectName == e) {
      await dbconfig();
      console.log("userauth function called");
      //Authentication
      return await AuthProjServices.register(req.body, res);
    }
  });

  // For unwanted requests
  res.status(404).json({
    status: "Unknown request  url",
  });

  var res = projectName in userInfoDetails.projects;

  res.status(200).json({
    status: false,
  });
*/
