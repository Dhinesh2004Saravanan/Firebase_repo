const mongoose = require("mongoose");
const userAuthCollection = require("../controller/userAuthModel");

class AddProjectService {
  static async addProject(data, res) {
    let userId = data["id"];
    let projectName = data["projectName"];
    console.log(projectName);
    let ans = await userAuthCollection.findById(userId);
    console.log(ans);

    //update the document

    if (ans.projects == null) {
      return res.status(400).json({
        status: false,
        message: "No entry",
      });
    }
    var listOfProjects = ans.projects;

    console.log(typeof listOfProjects);
    await listOfProjects.push(projectName);
    console.log(listOfProjects);

    ans.projects = listOfProjects;
    await ans.save({ versionKey: false }).then(function (doc) {
      console.log(`updated doc is ${doc}`);
      return res.status(200).json({ message: true, projList: doc.projects });
    });
  }
}
module.exports = AddProjectService;
