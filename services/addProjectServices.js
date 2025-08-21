const mongoose = require("mongoose");
const userAuthCollection = require("../controller/userAuthModel");

class AddProjectService {
  // Assuming 'mongoose' and 'userAuthCollection' are properly imported and defined globally
  // userAuthCollection should be a Mongoose model (e.g., const userAuthCollection = mongoose.model('User', userSchema);)
  static async addProject(data, res) {
    let userId = data["id"];
    let projectName = data["projectName"];

    try {
      // Check if user exists and project already exists in one query
      const user = await userAuthCollection.findOne({
        _id: userId,
        projects: { $ne: projectName }, // User exists but project doesn't exist
      });

      if (!user) {
        // Check if user exists at all
        const userExists = await userAuthCollection.findById(userId);
        if (!userExists) {
          return res
            .status(404)
            .json({ status: false, message: "User not found." });
        } else {
          return res.status(409).json({
            status: false,
            message: "Project with this name already exists for this user.",
          });
        }
      }

      // Add project using atomic update
      // const updatedDoc = await userAuthCollection.findByIdAndUpdate(
      //   userId,
      //   { $push: { projects: projectName } },
      //   { new: true }
      // );

      const updatedDoc = await userAuthCollection.findByIdAndUpdate(
        userId,
        {
          $push: {
            projects: projectName,
          },
        },
        {
          new: true, // new =true returns the updated document adter modification
        }
      );

      /*
findByIdAndUpdate has 4 parts
1) Id  => represent the id of data
2) Updating field  => represent the new data to get updated , we need to specify mongodb update operators 
like $push,$set (ADd a new element without modifying the original),$unset etc.
if not then new key value pair get inserted bt not the original value as retained 
3) Options 
4) Callback
*/

      return res.status(200).json({
        status: true,
        message: "Project added successfully.",
        projList: updatedDoc.projects,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Failed to add project: ${error.message}`,
      });
    }
  }

  // static async addProject(data, res) {
  //   let userId = data["id"];
  //   let projectName = data["projectName"];
  //   console.log("Attempting to add project:", projectName, "for user:", userId);

  //   try {
  //     // Find the user document
  //     let user = await userAuthCollection.findById(userId);
  //     console.log("Found user:", user);

  //     if (!user) {
  //       // Check if user is null or undefined
  //       return res.status(404).json({
  //         // 404 Not Found is more appropriate here
  //         status: false,
  //         message: "User not found.",
  //       });
  //     }

  //     // Ensure 'projects' field exists and is an array
  //     if (!Array.isArray(user.projects)) {
  //       user.projects = [];
  //     }

  //     // Check if project already exists to avoid duplicates
  //     if (user.projects.includes(projectName)) {
  //       return res.status(409).json({
  //         // 409 Conflict if project already exists
  //         status: false,
  //         message: "Project with this name already exists for this user.",
  //       });
  //     }

  //     // Add the new project name to the array
  //     user.projects.push(projectName);
  //     console.log("Updated project list:", user.projects);

  //     // Save the updated document
  //     // Removed .then() for consistent async/await usage
  //     const updatedDoc = await user.save({ versionKey: false });
  //     console.log(`Updated user document after adding project: ${updatedDoc}`);

  //     return res.status(200).json({
  //       status: true, // Use a boolean for status for consistency
  //       message: "Project added successfully.",
  //       projList: updatedDoc.projects,
  //     });
  //   } catch (error) {
  //     console.error("Error in addProject:", error);
  //     return res.status(500).json({
  //       // 500 Internal Server Error for unexpected issues
  //       status: false,
  //       message: `Failed to add project: ${error.message}`,
  //     });
  //   }
  // }

  static async listProjectsByUser(data, res) {
    let id = data["id"];

    let user_data = await userAuthCollection.findById(id);
    console.log(user_data);

    if (user_data == null) {
      return res.status(400).json({
        status: false,
        message: "USER WITH ID DOES NOT EXIST",
      });
    } else {
      let projectList = user_data.projects;
      return res.status(200).json({
        status: true,
        projectList: projectList,
      });
    }

    // var userData = await userAuthCollection.exists(
    //     {_id:id}
    // );
    // if(userData)
    // {
    //     let userDetails=await userAuthCollection.findById(id);

    // }
    // else
    // {
    //   return res.status(400).json({
    //     status:false,
    //     message:"USER DOES NOT EXSIST"
    //   })
    // }
  }
}
module.exports = AddProjectService;
