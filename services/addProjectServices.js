const mongoose = require("mongoose");
const userAuthCollection = require("../controller/userAuthModel");

class AddProjectService {
  // Assuming 'mongoose' and 'userAuthCollection' are properly imported and defined globally
  // userAuthCollection should be a Mongoose model (e.g., const userAuthCollection = mongoose.model('User', userSchema);)

  static async addProject(data, res) {
    let userId = data["id"];
    let projectName = data["projectName"];
    console.log("Attempting to add project:", projectName, "for user:", userId);

    try {
      // Find the user document
      let user = await userAuthCollection.findById(userId);
      console.log("Found user:", user);

      if (!user) {
        // Check if user is null or undefined
        return res.status(404).json({
          // 404 Not Found is more appropriate here
          status: false,
          message: "User not found.",
        });
      }

      // Ensure 'projects' field exists and is an array
      if (!Array.isArray(user.projects)) {
        user.projects = [];
      }

      // Check if project already exists to avoid duplicates
      if (user.projects.includes(projectName)) {
        return res.status(409).json({
          // 409 Conflict if project already exists
          status: false,
          message: "Project with this name already exists for this user.",
        });
      }

      // Add the new project name to the array
      user.projects.push(projectName);
      console.log("Updated project list:", user.projects);

      // Save the updated document
      // Removed .then() for consistent async/await usage
      const updatedDoc = await user.save({ versionKey: false });
      console.log(`Updated user document after adding project: ${updatedDoc}`);

      return res.status(200).json({
        status: true, // Use a boolean for status for consistency
        message: "Project added successfully.",
        projList: updatedDoc.projects,
      });
    } catch (error) {
      console.error("Error in addProject:", error);
      return res.status(500).json({
        // 500 Internal Server Error for unexpected issues
        status: false,
        message: `Failed to add project: ${error.message}`,
      });
    }
  }
}
module.exports = AddProjectService;
