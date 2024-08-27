const mongoose = require("mongoose");
const userAuthCollection = require("../controller/userAuthModel");

class AddProjectService {
  static async addProject(data, res) {
    let userId = data["id"];
    let projectName = data["projectName"];
    let ans = await userAuthCollection.findById(userId);
    console.log(ans);
    // update the document

    var listOfProjects = ans.projects;

    await listOfProjects.push(projectName);
    console.log(listOfProjects);
    

    ans.projects = listOfProjects;
    ans.save().then(function (doc) {
      
      console.log(`updated doc is ${doc}`);
      return res.status(200).json({ message: true, projList: doc.projects });
    });

    await res.status(200).json({ message: true, projList: ans.projects });
  }
}
module.exports = AddProjectService;
